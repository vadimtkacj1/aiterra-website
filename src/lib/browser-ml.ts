const ORT_BASE = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/'
const MODELS = {
  upscale: '/models/realesr-general-x4v3.onnx',
  background: '/models/u2netp.onnx',
  faces: '/models/face_detection_yunet_2023mar.onnx',
}

const UPSCALE_FACTOR = 4
const UPSCALE_TILE = 128
const UPSCALE_PAD = 10
const BACKGROUND_SIZE = 320
const FACE_INPUT = 640
const FACE_STRIDES = [8, 16, 32]
const FACE_THRESHOLD = 0.6
const FACE_OVERLAP = 0.3
const PIXEL_BLOCKS = 9
const IMAGENET_MEAN = [0.485, 0.456, 0.406]
const IMAGENET_STD = [0.229, 0.224, 0.225]

type OrtTensor = { data: Float32Array; dims: number[]; dispose?: () => void }
type OrtSession = {
  inputNames: string[]
  outputNames: string[]
  run: (feeds: Record<string, OrtTensor>) => Promise<Record<string, OrtTensor>>
}
type Ort = {
  env: { wasm: { wasmPaths: string; numThreads: number } }
  Tensor: new (type: 'float32', data: Float32Array, dims: number[]) => OrtTensor
  InferenceSession: { create: (url: string, options: { executionProviders: string[] }) => Promise<OrtSession> }
}

export type FaceBox = { x: number; y: number; width: number; height: number; score: number }
export type SketchStyle = 'pencil' | 'coloring'
export type Progress = (share: number) => void

declare global {
  interface Window {
    ort?: Ort
  }
}

let ortLoading: Promise<Ort> | null = null
const sessions = new Map<string, Promise<OrtSession>>()

function loadOrt() {
  ortLoading ??= new Promise<Ort>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `${ORT_BASE}ort.webgpu.min.js`
    script.onload = () => {
      const ort = window.ort
      if (!ort) return reject(new Error('runtime'))
      ort.env.wasm.wasmPaths = ORT_BASE
      ort.env.wasm.numThreads = 1
      resolve(ort)
    }
    script.onerror = () => {
      ortLoading = null
      reject(new Error('runtime'))
    }
    document.head.appendChild(script)
  })
  return ortLoading
}

const hasWebGpu = () => 'gpu' in navigator

async function sessionFor(url: string, providers: string[]) {
  const ort = await loadOrt()
  if (!sessions.has(url)) sessions.set(url, ort.InferenceSession.create(url, { executionProviders: providers }))
  return { ort, session: await (sessions.get(url) as Promise<OrtSession>) }
}

const nextFrame = () => new Promise((resolve) => setTimeout(resolve))

function newCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

const context = (canvas: HTMLCanvasElement) =>
  canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D

export async function fileToCanvas(file: File, maxSide: number) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = newCanvas(Math.round(bitmap.width * scale), Math.round(bitmap.height * scale))
  context(canvas).drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return { canvas, resized: scale < 1 }
}

export const upscaleLimit = () => (hasWebGpu() ? 1024 : 640)

export async function upscale(source: HTMLCanvasElement, onProgress: Progress) {
  const { ort, session } = await sessionFor(MODELS.upscale, hasWebGpu() ? ['webgpu', 'wasm'] : ['wasm'])
  const { width, height } = source
  const output = newCanvas(width * UPSCALE_FACTOR, height * UPSCALE_FACTOR)
  const outputContext = context(output)
  const sourceContext = context(source)
  const columns = Math.ceil(width / UPSCALE_TILE)
  const rows = Math.ceil(height / UPSCALE_TILE)

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const left = column * UPSCALE_TILE
      const top = row * UPSCALE_TILE
      const tileWidth = Math.min(UPSCALE_TILE, width - left)
      const tileHeight = Math.min(UPSCALE_TILE, height - top)
      const x = Math.max(0, left - UPSCALE_PAD)
      const y = Math.max(0, top - UPSCALE_PAD)
      const cropWidth = Math.min(width, left + tileWidth + UPSCALE_PAD) - x
      const cropHeight = Math.min(height, top + tileHeight + UPSCALE_PAD) - y
      const pixels = sourceContext.getImageData(x, y, cropWidth, cropHeight).data
      const size = cropWidth * cropHeight
      const input = new Float32Array(size * 3)
      for (let index = 0; index < size; index += 1) {
        for (let channel = 0; channel < 3; channel += 1) {
          input[channel * size + index] = pixels[index * 4 + channel] / 255
        }
      }
      const tensor = new ort.Tensor('float32', input, [1, 3, cropHeight, cropWidth])
      const result = await session.run({ [session.inputNames[0]]: tensor })
      const out = result[session.outputNames[0]]
      const [, , outHeight, outWidth] = out.dims
      const image = outputContext.createImageData(outWidth, outHeight)
      const outSize = outWidth * outHeight
      for (let index = 0; index < outSize; index += 1) {
        for (let channel = 0; channel < 3; channel += 1) {
          image.data[index * 4 + channel] = Math.max(0, Math.min(255, out.data[channel * outSize + index] * 255))
        }
        image.data[index * 4 + 3] = 255
      }
      outputContext.putImageData(
        image,
        x * UPSCALE_FACTOR,
        y * UPSCALE_FACTOR,
        (left - x) * UPSCALE_FACTOR,
        (top - y) * UPSCALE_FACTOR,
        tileWidth * UPSCALE_FACTOR,
        tileHeight * UPSCALE_FACTOR,
      )
      tensor.dispose?.()
      out.dispose?.()
      onProgress((row * columns + column + 1) / (rows * columns))
      await nextFrame()
    }
  }
  return output
}

export async function removeBackground(source: HTMLCanvasElement) {
  const { ort, session } = await sessionFor(MODELS.background, ['wasm'])
  const small = newCanvas(BACKGROUND_SIZE, BACKGROUND_SIZE)
  const smallContext = context(small)
  smallContext.drawImage(source, 0, 0, BACKGROUND_SIZE, BACKGROUND_SIZE)
  const pixels = smallContext.getImageData(0, 0, BACKGROUND_SIZE, BACKGROUND_SIZE).data
  const size = BACKGROUND_SIZE * BACKGROUND_SIZE
  let brightest = 1
  for (let index = 0; index < pixels.length; index += 1) {
    if (index % 4 !== 3 && pixels[index] > brightest) brightest = pixels[index]
  }
  const input = new Float32Array(size * 3)
  for (let index = 0; index < size; index += 1) {
    for (let channel = 0; channel < 3; channel += 1) {
      input[channel * size + index] =
        (pixels[index * 4 + channel] / brightest - IMAGENET_MEAN[channel]) / IMAGENET_STD[channel]
    }
  }
  const tensor = new ort.Tensor('float32', input, [1, 3, BACKGROUND_SIZE, BACKGROUND_SIZE])
  const result = await session.run({ [session.inputNames[0]]: tensor })
  const mask = result[session.outputNames[0]].data
  let low = Infinity
  let high = -Infinity
  for (let index = 0; index < size; index += 1) {
    low = Math.min(low, mask[index])
    high = Math.max(high, mask[index])
  }
  const maskImage = smallContext.createImageData(BACKGROUND_SIZE, BACKGROUND_SIZE)
  for (let index = 0; index < size; index += 1) {
    maskImage.data[index * 4 + 3] = (255 * (mask[index] - low)) / (high - low || 1)
  }
  smallContext.putImageData(maskImage, 0, 0)

  const output = newCanvas(source.width, source.height)
  const outputContext = context(output)
  outputContext.imageSmoothingQuality = 'high'
  outputContext.drawImage(small, 0, 0, output.width, output.height)
  outputContext.globalCompositeOperation = 'source-in'
  outputContext.drawImage(source, 0, 0)
  return output
}

const intersection = (a: FaceBox, b: FaceBox) => {
  const width = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
  const height = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)
  if (width <= 0 || height <= 0) return 0
  const shared = width * height
  return shared / (a.width * a.height + b.width * b.height - shared)
}

const clampUnit = (value: number) => Math.min(1, Math.max(0, value))

export async function detectFaces(source: HTMLCanvasElement) {
  const { ort, session } = await sessionFor(MODELS.faces, ['wasm'])
  const scale = FACE_INPUT / Math.max(source.width, source.height)
  const square = newCanvas(FACE_INPUT, FACE_INPUT)
  const squareContext = context(square)
  squareContext.drawImage(source, 0, 0, source.width * scale, source.height * scale)
  const pixels = squareContext.getImageData(0, 0, FACE_INPUT, FACE_INPUT).data
  const size = FACE_INPUT * FACE_INPUT
  const input = new Float32Array(size * 3)
  for (let index = 0; index < size; index += 1) {
    input[index] = pixels[index * 4 + 2]
    input[size + index] = pixels[index * 4 + 1]
    input[size * 2 + index] = pixels[index * 4]
  }
  const tensor = new ort.Tensor('float32', input, [1, 3, FACE_INPUT, FACE_INPUT])
  const result = await session.run({ [session.inputNames[0]]: tensor })

  const candidates: FaceBox[] = []
  for (const stride of FACE_STRIDES) {
    const cells = FACE_INPUT / stride
    const cls = result[`cls_${stride}`].data
    const obj = result[`obj_${stride}`].data
    const bbox = result[`bbox_${stride}`].data
    for (let row = 0; row < cells; row += 1) {
      for (let column = 0; column < cells; column += 1) {
        const index = row * cells + column
        const score = Math.sqrt(clampUnit(cls[index]) * clampUnit(obj[index]))
        if (score < FACE_THRESHOLD) continue
        const centerX = (column + bbox[index * 4]) * stride
        const centerY = (row + bbox[index * 4 + 1]) * stride
        const width = Math.exp(bbox[index * 4 + 2]) * stride
        const height = Math.exp(bbox[index * 4 + 3]) * stride
        candidates.push({
          x: (centerX - width / 2) / scale,
          y: (centerY - height / 2) / scale,
          width: width / scale,
          height: height / scale,
          score,
        })
      }
    }
  }
  return candidates
    .sort((a, b) => b.score - a.score)
    .reduce<FaceBox[]>(
      (kept, box) => (kept.some((other) => intersection(other, box) > FACE_OVERLAP) ? kept : [...kept, box]),
      [],
    )
}

export function pixelateFaces(source: HTMLCanvasElement, boxes: FaceBox[]) {
  const output = newCanvas(source.width, source.height)
  const outputContext = context(output)
  outputContext.drawImage(source, 0, 0)
  for (const { x, y, width, height } of boxes) {
    const left = Math.max(0, Math.round(x))
    const top = Math.max(0, Math.round(y))
    const boxWidth = Math.min(source.width - left, Math.round(width))
    const boxHeight = Math.min(source.height - top, Math.round(height))
    if (boxWidth <= 0 || boxHeight <= 0) continue
    const block = newCanvas(PIXEL_BLOCKS, PIXEL_BLOCKS)
    context(block).drawImage(source, left, top, boxWidth, boxHeight, 0, 0, PIXEL_BLOCKS, PIXEL_BLOCKS)
    outputContext.imageSmoothingEnabled = false
    outputContext.drawImage(block, left, top, boxWidth, boxHeight)
  }
  return output
}

function boxBlur(values: Float32Array, width: number, height: number, radius: number) {
  const blurred = new Float32Array(values.length)
  const span = radius * 2 + 1
  for (let y = 0; y < height; y += 1) {
    let sum = 0
    for (let x = -radius; x <= radius; x += 1) sum += values[y * width + Math.min(width - 1, Math.max(0, x))]
    for (let x = 0; x < width; x += 1) {
      blurred[y * width + x] = sum / span
      sum += values[y * width + Math.min(width - 1, x + radius + 1)] - values[y * width + Math.max(0, x - radius)]
    }
  }
  const result = new Float32Array(values.length)
  for (let x = 0; x < width; x += 1) {
    let sum = 0
    for (let y = -radius; y <= radius; y += 1) sum += blurred[Math.min(height - 1, Math.max(0, y)) * width + x]
    for (let y = 0; y < height; y += 1) {
      result[y * width + x] = sum / span
      sum +=
        blurred[Math.min(height - 1, y + radius + 1) * width + x] - blurred[Math.max(0, y - radius) * width + x]
    }
  }
  return result
}

const SKETCH_BLUR_SHARE = 0.008
const SKETCH_PASSES = 3
const COLORING_THRESHOLD = 225

export function photoToSketch(source: HTMLCanvasElement, style: SketchStyle) {
  const { width, height } = source
  const image = context(source).getImageData(0, 0, width, height)
  const size = width * height
  const gray = new Float32Array(size)
  for (let index = 0; index < size; index += 1) {
    gray[index] =
      image.data[index * 4] * 0.299 + image.data[index * 4 + 1] * 0.587 + image.data[index * 4 + 2] * 0.114
  }
  const radius = Math.max(2, Math.round(Math.max(width, height) * SKETCH_BLUR_SHARE))
  let blurred: Float32Array = gray.map((value) => 255 - value)
  for (let pass = 0; pass < SKETCH_PASSES; pass += 1) blurred = boxBlur(blurred, width, height, radius)

  const output = newCanvas(width, height)
  const outputContext = context(output)
  const result = outputContext.createImageData(width, height)
  for (let index = 0; index < size; index += 1) {
    const dodge = blurred[index] >= 255 ? 255 : Math.min(255, (gray[index] * 255) / (255 - blurred[index]))
    const value = style === 'coloring' ? (dodge < COLORING_THRESHOLD ? 0 : 255) : dodge
    result.data[index * 4] = value
    result.data[index * 4 + 1] = value
    result.data[index * 4 + 2] = value
    result.data[index * 4 + 3] = 255
  }
  outputContext.putImageData(result, 0, 0)
  return output
}

export const canvasToUrl = (canvas: HTMLCanvasElement) =>
  new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(URL.createObjectURL(blob)) : reject(new Error('encode'))), 'image/png')
  })
