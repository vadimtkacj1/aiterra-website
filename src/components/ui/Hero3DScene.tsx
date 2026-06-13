'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const BLUE = new THREE.Color('#1B1BB3')
const PURPLE = new THREE.Color('#530FAD')

/**
 * AITERRA logomark outline, traced from the brand logo raster (public/icons/logo.svg).
 * Image space: 1063x1063, y-down. Two pieces: the "A" body and the detached slash.
 */
const MARK_BODY: [number, number][] = [
  [527, 56.5],
  [843.5, 650],
  [702.5, 649],
  [525, 323.5],
  [313.5, 720],
  [453, 720.5],
  [535.5, 846],
  [109.5, 847],
]
const MARK_SLASH: [number, number][] = [
  [550.5, 721],
  [882, 720.5],
  [949.5, 847],
  [640, 847.5],
]

/** Logomark bbox in image space — used to center and scale into world units. */
const BBOX = { minX: 109.5, maxX: 949.5, minY: 56.5, maxY: 847.5 }
const MARK_WIDTH = 2.4
const EXTRUDE_DEPTH = 0.34

const PARTICLE_COUNT = 90

/** Camera framing: margin around the mark and how far below frame-center it sits (keeps it clear of the header). */
const FIT_MARGIN = 1.18
const CAMERA_Y_LIFT = 0.13

/** Deterministic PRNG — the scene must look identical on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Round dot sprite so points render as circles instead of squares. */
function makeDotTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.6, 'rgba(255,255,255,0.9)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function toShape(points: [number, number][]) {
  const scale = MARK_WIDTH / (BBOX.maxX - BBOX.minX)
  const cx = (BBOX.minX + BBOX.maxX) / 2
  const cy = (BBOX.minY + BBOX.maxY) / 2
  const shape = new THREE.Shape()
  points.forEach(([x, y], i) => {
    const px = (x - cx) * scale
    const py = (cy - y) * scale // flip y: image space is y-down
    if (i === 0) shape.moveTo(px, py)
    else shape.lineTo(px, py)
  })
  shape.closePath()
  return shape
}

type SceneAssets = {
  markGeometry: THREE.ExtrudeGeometry
  particlesGeometry: THREE.BufferGeometry
  dotTexture: THREE.CanvasTexture
  markRadius: number
}

function buildScene(): SceneAssets {
  const markGeometry = new THREE.ExtrudeGeometry([toShape(MARK_BODY), toShape(MARK_SLASH)], {
    depth: EXTRUDE_DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.028,
    bevelSegments: 2,
    curveSegments: 1,
  })
  markGeometry.center()
  markGeometry.computeBoundingSphere()

  // brand gradient: blue at the apex -> purple at the base
  {
    const pos = markGeometry.attributes.position
    const colors = new Float32Array(pos.count * 3)
    const box = new THREE.Box3().setFromBufferAttribute(pos as THREE.BufferAttribute)
    const span = box.max.y - box.min.y || 1
    const color = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const t = THREE.MathUtils.clamp((box.max.y - pos.getY(i)) / span, 0, 1)
      color.copy(BLUE).lerp(PURPLE, t)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    markGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

  // ambient particle field drifting around the mark
  const rng = mulberry32(20260613)
  const particlesGeometry = new THREE.BufferGeometry()
  {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const color = new THREE.Color()
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 1.5 + rng() * 1.0
      const theta = rng() * Math.PI * 2
      const y = (rng() - 0.5) * 2.4
      positions[i * 3] = Math.cos(theta) * radius
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(theta) * radius
      color.copy(BLUE).lerp(PURPLE, rng())
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

  const dotTexture = makeDotTexture()
  const markRadius = markGeometry.boundingSphere?.radius ?? 1.7

  return { markGeometry, particlesGeometry, dotTexture, markRadius }
}

function disposeScene(assets: SceneAssets) {
  assets.markGeometry.dispose()
  assets.particlesGeometry.dispose()
  assets.dotTexture.dispose()
}

/** Procedural studio reflections — zero network cost, generated on the GPU once. */
function StudioEnvironment() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const envScene = new RoomEnvironment()
    const env = pmrem.fromScene(envScene, 0.04)
    scene.environment = env.texture
    envScene.dispose()
    pmrem.dispose()
    return () => {
      scene.environment = null
      env.dispose()
    }
  }, [gl, scene])

  return null
}

function LogoMark() {
  const markRef = useRef<THREE.Group>(null)
  const swayRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const bucketRef = useRef(0)
  const timeRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })

  // StrictMode-safe resource lifecycle: create and dispose are paired in one effect.
  const [assets, setAssets] = useState<SceneAssets | null>(null)
  useEffect(() => {
    const built = buildScene()
    setAssets(built)
    return () => disposeScene(built)
  }, [])

  // The hero container is pointer-events-none (so text/buttons stay clickable),
  // which the canvas inherits — R3F's own pointer state never updates. Track the
  // cursor at window level instead for the parallax sway.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    if (!assets) return
    const { camera, size } = state

    // refit camera when canvas width OR height changes (the canvas is portrait at
    // common desktop sizes, so the fit distance depends on both dimensions)
    const bucket = Math.round(size.width / 48) * 10000 + Math.round(size.height / 48)
    if (bucket !== bucketRef.current) {
      bucketRef.current = bucket
      const fitRadius = assets.markRadius * 1.12
      const persp = camera as THREE.PerspectiveCamera
      const vFov = (persp.fov * Math.PI) / 180
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * persp.aspect)
      const minFov = Math.min(vFov, hFov)
      const dist = (fitRadius / Math.tan(minFov / 2)) * FIT_MARGIN
      camera.position.set(0, CAMERA_Y_LIFT * fitRadius, dist)
      camera.lookAt(0, 0, 0)
      persp.updateProjectionMatrix()
    }

    // own time accumulator: R3F resets its clock when frameloop toggles
    // ('never' <-> 'always'), which would snap the pose on scroll-back.
    timeRef.current += Math.min(delta, 0.1)
    const t = timeRef.current

    if (markRef.current) {
      // pendulum swing (±31°) instead of full rotation: the mark stays readable
      // at all times, never turns edge-on or shows its mirrored back
      markRef.current.rotation.y = Math.sin(t * 0.35) * 0.55
      markRef.current.position.y = Math.sin(t * 0.7) * 0.06
    }
    if (swayRef.current) {
      // pointer parallax, frame-rate-independent damping
      const targetX = -0.08 + pointerRef.current.y * 0.1
      const targetZ = pointerRef.current.x * 0.06
      swayRef.current.rotation.x = THREE.MathUtils.damp(swayRef.current.rotation.x, targetX, 2.5, delta)
      swayRef.current.rotation.z = THREE.MathUtils.damp(swayRef.current.rotation.z, targetZ, 2.5, delta)
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.05
    }
  })

  if (!assets) return null

  return (
    <group ref={swayRef}>
      <group ref={markRef}>
        <mesh geometry={assets.markGeometry}>
          <meshStandardMaterial
            vertexColors
            metalness={0.35}
            roughness={0.28}
            envMapIntensity={1.1}
          />
        </mesh>
      </group>

      <points ref={particlesRef} geometry={assets.particlesGeometry}>
        <pointsMaterial
          vertexColors
          size={0.045}
          sizeAttenuation
          map={assets.dotTexture}
          transparent
          opacity={0.55}
          alphaTest={0.1}
          depthWrite={false}
        />
      </points>
    </group>
  )
}

export default function Hero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)

  // Pause rendering entirely while the hero is scrolled out of view — zero GPU/CPU cost off-screen.
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.05 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative h-full w-full min-h-[180px] max-w-[100vw] overflow-hidden">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        className="h-full w-full"
      >
        <StudioEnvironment />
        <directionalLight position={[4, 6, 5]} intensity={1.1} color="#ffffff" />
        <pointLight position={[-4, 1, 3]} intensity={6} color="#1B1BB3" />
        <pointLight position={[4, -2, 2]} intensity={5} color="#530FAD" />
        <LogoMark />
      </Canvas>
    </div>
  )
}
