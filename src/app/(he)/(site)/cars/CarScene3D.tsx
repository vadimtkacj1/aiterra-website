'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import type { CarBody, CarPart } from './CarAssembly'

export type AssemblyProgress = {
  current: number
  turn: number
  pitch: number
  inside: boolean
  invalidate: (() => void) | null
}

const MODEL_BY_BODY: Record<CarBody, string> = {
  sedan: 'sedan',
  hatchback: 'hatchback-sports',
  wagon: 'hatchback-sports',
  suv: 'suv',
}

const MODELS_PATH = '/models/cars/'
const DEBRIS = ['debris-door', 'debris-drivetrain-axle', 'debris-bumper', 'debris-bolt'] as const
type DebrisName = (typeof DEBRIS)[number]

const SPAN = 0.32
const ABSORB = 0.1
const FOV = 26
const INSIDE_FOV = 68
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3)
const clamp = (value: number) => Math.min(1, Math.max(0, value))
const stage = (progress: number, start: number) => easeOut(clamp((progress - start) / SPAN))

type Rest = { position: THREE.Vector3; rotation: THREE.Euler; scale: number }
type Motion = 'move' | 'absorb' | 'pop'

type Animated = {
  part: CarPart | null
  object: THREE.Object3D
  rest: Rest
  start: number
  from: THREE.Vector3
  spin: THREE.Vector3
  motion: Motion
}

type Loaded =
  | { kind: 'toy'; car: THREE.Group; debris: Record<DebrisName, THREE.Group> }
  | { kind: 'real'; car: THREE.Group }

type Built = {
  root: THREE.Group
  cabinLight: THREE.PointLight | null
  animated: Animated[]
  lights: { sprite: THREE.Sprite; start: number }[]
  shadow: THREE.Mesh
  size: THREE.Vector3
  center: THREE.Vector3
  eye: THREE.Vector3 | null
}

function loadModels(body: CarBody, realModel: string | null): Promise<Loaded> {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  const load = (name: string) => loader.loadAsync(`${MODELS_PATH}${name}`).then((gltf) => gltf.scene)
  if (realModel) return load(realModel).then((car) => ({ kind: 'real', car }))
  return Promise.all([load(`${MODEL_BY_BODY[body]}.glb`), ...DEBRIS.map((name) => load(`${name}.glb`))]).then(([car, ...parts]) => ({
    kind: 'toy',
    car,
    debris: Object.fromEntries(DEBRIS.map((name, index) => [name, parts[index]])) as Record<DebrisName, THREE.Group>,
  }))
}

const restOf = (object: THREE.Object3D): Rest => ({
  position: object.position.clone(),
  rotation: object.rotation.clone(),
  scale: object.scale.x,
})

function radialTexture(inner: string, outer: string, size: number) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, inner)
    gradient.addColorStop(1, outer)
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
  }
  return new THREE.CanvasTexture(canvas)
}

function addShadow(root: THREE.Group, box: THREE.Box3, size: THREE.Vector3) {
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(size.x * 1.9, size.z * 1.35),
    new THREE.MeshBasicMaterial({
      map: radialTexture('rgba(0,0,0,0.55)', 'rgba(0,0,0,0)', 128),
      transparent: true,
      depthWrite: false,
      opacity: 0,
    }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = box.min.y + 0.005
  root.add(shadow)
  return shadow
}

function addLamps(root: THREE.Group, scale: number, spots: { position: THREE.Vector3; start: number; tail: boolean }[]) {
  const head = radialTexture('rgba(255,236,170,1)', 'rgba(0,0,0,0)', 64)
  const tail = radialTexture('rgba(255,70,80,1)', 'rgba(0,0,0,0)', 64)
  return spots.map(({ position, start, tail: isTail }) => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: isTail ? tail : head, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }),
    )
    sprite.position.copy(position)
    sprite.scale.setScalar(scale)
    root.add(sprite)
    return { sprite, start }
  })
}

function buildToyScene(model: THREE.Group, debris: Record<DebrisName, THREE.Group>): Built {
  const root = new THREE.Group()
  const car = model.clone(true)
  root.add(car)
  const body = car.getObjectByName('body') ?? car
  const box = new THREE.Box3().setFromObject(car)
  const size = box.getSize(new THREE.Vector3())
  const animated: Animated[] = [
    {
      part: 'body',
      object: body,
      rest: restOf(body),
      start: 0,
      from: new THREE.Vector3(0, size.y * 2.6, 0),
      spin: new THREE.Vector3(0.35, 0.7, 0.25),
      motion: 'move',
    },
  ]

  const wheels = car.children.filter((child) => child.name.startsWith('wheel'))
  for (const wheel of wheels) {
    const front = wheel.position.z > 0
    const side = wheel.position.x === 0 ? 0 : Math.sign(wheel.position.x)
    animated.push({
      part: front ? 'frontWheel' : 'rearWheel',
      object: wheel,
      rest: restOf(wheel),
      start: side === 0 ? 0.44 : front ? 0.3 : 0.38,
      from: new THREE.Vector3(side * size.x * 2.2, size.y * 0.4, side === 0 ? -size.z : front ? size.z * 0.35 : -size.z * 0.35),
      spin: new THREE.Vector3(front ? -14 : 14, 0, 0),
      motion: 'move',
    })
  }

  const place = (template: THREE.Group, position: THREE.Vector3, start: number, from: THREE.Vector3, scale: number) => {
    const part = template.clone(true)
    part.position.copy(position)
    part.scale.setScalar(scale)
    root.add(part)
    animated.push({ part: null, object: part, rest: restOf(part), start, from, spin: new THREE.Vector3(2.4, 3.2, 1.2), motion: 'absorb' })
  }

  for (const side of [1, -1]) {
    place(
      debris['debris-door'],
      new THREE.Vector3(side * (box.max.x - 0.02), box.min.y + size.y * 0.18, 0.05),
      0.1,
      new THREE.Vector3(side * size.x * 1.8, size.y * 1.2, 0.4),
      (size.y * 0.55) / 0.9,
    )
  }
  for (const wheel of wheels.filter((child) => child.position.x > 0)) {
    place(
      debris['debris-drivetrain-axle'],
      new THREE.Vector3(0, wheel.position.y - 0.12, wheel.position.z),
      0.05,
      new THREE.Vector3(0, -size.y * 1.6, wheel.position.z * 0.6),
      (size.x * 0.8) / 1.2,
    )
  }
  place(
    debris['debris-bumper'],
    new THREE.Vector3(0, box.min.y + size.y * 0.12, box.max.z - 0.05),
    0.22,
    new THREE.Vector3(-size.x * 0.4, size.y * 1.8, size.z * 1.1),
    (size.x * 0.85) / 1.3,
  )
  for (const wheel of wheels.filter((child) => child.position.x !== 0)) {
    const side = Math.sign(wheel.position.x)
    place(
      debris['debris-bolt'],
      new THREE.Vector3(wheel.position.x + side * 0.12, wheel.position.y - 0.08, wheel.position.z),
      wheel.position.z > 0 ? 0.36 : 0.44,
      new THREE.Vector3(side * size.x * 1.4, size.y * 1.4, wheel.position.z * 1.8),
      0.9,
    )
  }

  const lights = addLamps(
    root,
    size.x * 0.24,
    [1, -1].flatMap((side) => [
      { position: new THREE.Vector3(side * size.x * 0.27, box.min.y + size.y * 0.42, box.max.z + 0.02), start: 0.5, tail: false },
      { position: new THREE.Vector3(side * size.x * 0.3, box.min.y + size.y * 0.45, box.min.z - 0.02), start: 0.56, tail: true },
    ]),
  )
  return {
    root,
    cabinLight: null,
    animated,
    lights,
    shadow: addShadow(root, box, size),
    size,
    center: box.getCenter(new THREE.Vector3()),
    eye: null,
  }
}

const REAL_PARTS: Record<string, { part: CarPart | null; start: number; from: [number, number, number]; spin?: [number, number, number]; motion?: Motion }> = {
  chassis: { part: null, start: 0, from: [0, -1.5, 0] },
  trim: { part: 'cabin', start: 0.05, from: [0, -1.1, 0] },
  body: { part: 'body', start: 0.1, from: [0, 2, 0], spin: [0.12, 0.35, 0.08] },
  glass: { part: 'glass', start: 0.22, from: [0, 2.6, 0] },
  taillights: { part: 'taillight', start: 0.56, from: [0, 0.4, -1.8] },
  plate: { part: null, start: 0.62, from: [0, 0, 0.8], motion: 'pop' },
  'plate-rear': { part: null, start: 0.64, from: [0, 0, -0.8], motion: 'pop' },
  'badge-front': { part: null, start: 0.68, from: [0, 0.3, 0.5], motion: 'pop' },
  'badge-rear': { part: null, start: 0.7, from: [0, 0.3, -0.5], motion: 'pop' },
  'wordmark-rear': { part: null, start: 0.72, from: [0, 0, -0.5], motion: 'pop' },
}

function buildRealScene(model: THREE.Group): Built {
  const root = new THREE.Group()
  const car = model.clone(true)
  root.add(car)
  const box = new THREE.Box3().setFromObject(car)
  const size = box.getSize(new THREE.Vector3())
  const animated: Animated[] = []
  car.traverse((object) => {
    const config = REAL_PARTS[object.name]
    if (config) {
      animated.push({
        part: config.part,
        object,
        rest: restOf(object),
        start: config.start,
        from: new THREE.Vector3(...config.from),
        spin: new THREE.Vector3(...(config.spin ?? [0, 0, 0])),
        motion: config.motion ?? 'move',
      })
      return
    }
    if (object.name.startsWith('wheel-')) {
      const front = object.name.includes('front')
      const side = Math.sign(object.position.x) || 1
      animated.push({
        part: front ? 'frontWheel' : 'rearWheel',
        object,
        rest: restOf(object),
        start: front ? 0.3 : 0.38,
        from: new THREE.Vector3(side * 2.4, 0.35, front ? 0.7 : -0.7),
        spin: new THREE.Vector3(front ? -14 : 14, 0, 0),
        motion: 'move',
      })
    }
  })
  const lights = addLamps(
    root,
    0.32,
    [1, -1].map((side) => ({ position: new THREE.Vector3(side * 0.52, 0.72, 2.16), start: 0.5, tail: false })),
  )
  const cabinLight = new THREE.PointLight('#fff4e0', 0, 2.6, 1.4)
  cabinLight.position.set(0.1, 1.3, 0.1)
  root.add(cabinLight)
  return {
    root,
    cabinLight,
    animated,
    lights,
    shadow: addShadow(root, box, size),
    size,
    center: box.getCenter(new THREE.Vector3()),
    eye: new THREE.Vector3(0.375, 1.1, 0),
  }
}

function Environment() {
  const { gl, scene, invalidate } = useThree()
  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl)
    const texture = generator.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = texture
    invalidate()
    return () => {
      scene.environment = null
      texture.dispose()
      generator.dispose()
    }
  }, [gl, scene, invalidate])
  return null
}

function Assembly({
  loaded,
  progress,
  onPick,
}: {
  loaded: Loaded
  progress: AssemblyProgress
  onPick: (part: CarPart) => void
}) {
  const scene = useMemo(() => (loaded.kind === 'real' ? buildRealScene(loaded.car) : buildToyScene(loaded.car, loaded.debris)), [loaded])
  const shown = useRef(-1)
  const inside = useRef(0)
  const { camera, size, invalidate } = useThree()
  const orbit = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  const driverLook = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    progress.invalidate = invalidate
    invalidate()
    return () => {
      progress.invalidate = null
    }
  }, [invalidate, progress])

  useFrame(() => {
    const target = progress.current
    const next = shown.current < 0 ? target : THREE.MathUtils.lerp(shown.current, target, 0.18)
    shown.current = Math.abs(next - target) < 0.0005 ? target : next
    const p = shown.current
    const insideTarget = progress.inside && scene.eye ? 1 : 0
    inside.current = Math.abs(inside.current - insideTarget) < 0.002 ? insideTarget : THREE.MathUtils.lerp(inside.current, insideTarget, 0.12)

    for (const item of scene.animated) {
      const e = stage(p, item.start)
      const away = 1 - e
      item.object.position.set(
        item.rest.position.x + item.from.x * away,
        item.rest.position.y + item.from.y * away,
        item.rest.position.z + item.from.z * away,
      )
      item.object.rotation.set(
        item.rest.rotation.x + item.spin.x * away,
        item.rest.rotation.y + item.spin.y * away,
        item.rest.rotation.z + item.spin.z * away,
      )
      if (item.motion === 'absorb') {
        const gone = clamp((p - item.start - SPAN) / ABSORB)
        item.object.scale.setScalar(item.rest.scale * (1 - easeOut(gone)))
        item.object.visible = gone < 1
      } else if (item.motion === 'pop') {
        item.object.scale.setScalar(item.rest.scale * Math.max(0.001, e))
        item.object.visible = e > 0.001
      }
    }
    for (const light of scene.lights) {
      ;(light.sprite.material as THREE.SpriteMaterial).opacity = stage(p, light.start) * 0.9 * (1 - inside.current)
    }
    ;(scene.shadow.material as THREE.MeshBasicMaterial).opacity = stage(p, 0.05)
    if (scene.cabinLight) scene.cabinLight.intensity = 5 * inside.current

    const aspect = size.width / Math.max(1, size.height)
    const halfWidth = Math.max(scene.size.z, scene.size.x) * 0.5
    const vertical = THREE.MathUtils.degToRad(FOV) / 2
    const horizontal = Math.atan(Math.tan(vertical) * aspect)
    const distance = Math.max(halfWidth / Math.tan(horizontal), (scene.size.y * 0.95) / Math.tan(vertical)) * 0.92
    const angle = THREE.MathUtils.lerp(1.95, 1.05, easeOut(p)) + (progress.inside ? 0 : progress.turn)
    orbit.set(
      scene.center.x + Math.sin(angle) * distance,
      scene.center.y + distance * 0.36,
      scene.center.z + Math.cos(angle) * distance,
    )
    look.set(scene.center.x, scene.center.y * 0.9, scene.center.z)

    const perspective = camera as THREE.PerspectiveCamera
    if (scene.eye && inside.current > 0) {
      const yaw = progress.inside ? progress.turn : 0
      const pitch = progress.inside ? progress.pitch : 0
      driverLook.set(
        scene.eye.x + Math.sin(yaw) * Math.cos(pitch) * 3,
        scene.eye.y - 0.42 + Math.sin(pitch) * 3,
        scene.eye.z + Math.cos(yaw) * Math.cos(pitch) * 3,
      )
      camera.position.lerpVectors(orbit, scene.eye, inside.current)
      look.lerp(driverLook, inside.current)
    } else {
      camera.position.copy(orbit)
    }
    const fov = THREE.MathUtils.lerp(FOV, INSIDE_FOV, inside.current)
    if (Math.abs(perspective.fov - fov) > 0.01) {
      perspective.fov = fov
      perspective.updateProjectionMatrix()
    }
    camera.lookAt(look)

    if (shown.current !== target || inside.current !== insideTarget) invalidate()
  })

  const pick = (object: THREE.Object3D) => {
    for (let node: THREE.Object3D | null = object; node; node = node.parent) {
      const found = scene.animated.find((item) => item.object === node && item.part)
      if (found?.part) return found.part
    }
    return null
  }

  return (
    <primitive
      object={scene.root}
      onClick={(event: { object: THREE.Object3D; stopPropagation: () => void }) => {
        if (progress.inside) return
        const part = pick(event.object)
        if (!part) return
        event.stopPropagation()
        onPick(part)
      }}
      onPointerOver={(event: { object: THREE.Object3D }) => {
        if (!progress.inside && pick(event.object)) document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = ''
      }}
    />
  )
}

export default function CarScene3D({
  body,
  realModel,
  progress,
  onReady,
  onPick,
}: {
  body: CarBody
  realModel: string | null
  progress: AssemblyProgress
  onReady: () => void
  onPick: (part: CarPart) => void
}) {
  const drag = useRef<{ x: number; y: number; turn: number; pitch: number } | null>(null)
  const [loaded, setLoaded] = useState<Loaded | null>(null)

  useEffect(() => {
    let cancelled = false
    loadModels(body, realModel)
      .then((models) => {
        if (!cancelled) setLoaded(models)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [body, realModel])

  useEffect(() => {
    if (loaded) onReady()
  }, [loaded, onReady])

  if (!loaded) return null
  return (
    <div
      style={{ position: 'absolute', inset: 0, touchAction: 'pan-y', cursor: 'grab' }}
      onPointerDown={(event) => {
        if (progress.current < 0.9) return
        drag.current = { x: event.clientX, y: event.clientY, turn: progress.turn, pitch: progress.pitch }
      }}
      onPointerMove={(event) => {
        if (!drag.current) return
        const dx = (event.clientX - drag.current.x) / 140
        progress.turn = progress.inside ? drag.current.turn + dx : drag.current.turn - dx
        if (progress.inside) {
          progress.pitch = THREE.MathUtils.clamp(drag.current.pitch - (event.clientY - drag.current.y) / 220, -0.6, 0.5)
        }
        progress.invalidate?.()
      }}
      onPointerUp={() => {
        drag.current = null
      }}
      onPointerCancel={() => {
        drag.current = null
      }}
    >
      <Canvas
        frameloop="demand"
        dpr={[1, 1.75]}
        camera={{ fov: FOV, near: 0.02, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      >
        {loaded.kind === 'real' ? <Environment /> : null}
        <hemisphereLight args={['#dfe9ff', '#0b1230', loaded.kind === 'real' ? 0.6 : 1.1]} />
        <directionalLight position={[3, 6, 4]} intensity={loaded.kind === 'real' ? 1.6 : 2.2} />
        <directionalLight position={[-4, 3, -3]} intensity={0.6} color="#3e96f9" />
        <Assembly loaded={loaded} progress={progress} onPick={onPick} />
      </Canvas>
    </div>
  )
}
