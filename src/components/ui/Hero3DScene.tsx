'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const BLUE = new THREE.Color('#2447D6')
const AZURE = new THREE.Color('#3E96F9')

/**
 * AITERRA ribbon logomark: a Möbius band built as a solid sweep. A rounded-rectangle
 * cross-section travels an elliptical path with a half twist while the path itself
 * folds vertically (potato-chip saddle). The cross-section's 180° symmetry lets the
 * seam weld exactly, so the mesh is closed and shades seamlessly.
 */
const RIBBON = {
  Rx: 1.0,          // path ellipse radius X
  Rz: 0.8,          // path ellipse radius Z
  width: 0.66,      // band width
  thick: 0.04,      // band thickness
  corner: 0.016,    // cross-section corner radius
  phi0: -0.45,      // twist phase at u=0
  wave: 0.3,        // vertical saddle amplitude
  wavePhase: -0.35, // saddle orientation
  M: 360,           // sweep segments
  A: 5,             // segments per cross-section corner arc
}

/** Ribbon gradient, sampled from the brand artwork (deep -> mid -> light). */
const COL_DEEP = new THREE.Color('#2B49CB')
const COL_MID = new THREE.Color('#2F5FE9')
const COL_LIGHT = new THREE.Color('#49B9F4')

const PARTICLE_COUNT = 90

/** Camera framing: margin around the mark and how far below frame-center it sits (keeps it clear of the header). */
const FIT_MARGIN = 1.12
const CAMERA_Y_LIFT = 0.5

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

function buildRibbonGeometry() {
  const { Rx, Rz, width, thick, corner, phi0, wave, wavePhase, M, A } = RIBBON
  const P = 4 * (A + 1) // cross-section vertex count (even, 180°-symmetric)

  // rounded-rectangle cross-section, CCW
  const a = width / 2
  const b = thick / 2
  const rc = Math.min(corner, b * 0.95)
  const prof: [number, number][] = []
  const cornerCenters: [number, number, number][] = [
    [a - rc, b - rc, 0],
    [-a + rc, b - rc, Math.PI / 2],
    [-a + rc, -b + rc, Math.PI],
    [a - rc, -b + rc, (3 * Math.PI) / 2],
  ]
  for (const [ccx, ccy, th0] of cornerCenters) {
    for (let i = 0; i <= A; i++) {
      const th = th0 + (Math.PI / 2) * (i / A)
      prof.push([ccx + rc * Math.cos(th), ccy + rc * Math.sin(th)])
    }
  }

  const V = M * P
  const positions = new Float32Array(V * 3)
  // seam weld: ring M maps to ring 0 with the profile shifted by P/2 (half-turn symmetry)
  const vid = (ring: number, k: number) =>
    ring === M ? (k + P / 2) % P : ring * P + (k % P)

  for (let i = 0; i < M; i++) {
    const u = (2 * Math.PI * i) / M
    const cx = Rx * Math.cos(u)
    const cz = Rz * Math.sin(u)
    const cy = wave * Math.sin(2 * u + wavePhase)
    const psi = u / 2 + phi0
    const c = Math.cos(psi)
    const s = Math.sin(psi)
    // width dir d and thickness dir n in the (radial, up) frame
    const d = [c * Math.cos(u), s, c * Math.sin(u)]
    const n = [-s * Math.cos(u), c, -s * Math.sin(u)]
    for (let k = 0; k < P; k++) {
      const [x, y] = prof[k]
      const id = i * P + k
      positions[id * 3] = cx + x * d[0] + y * n[0]
      positions[id * 3 + 1] = cy + x * d[1] + y * n[1]
      positions[id * 3 + 2] = cz + x * d[2] + y * n[2]
    }
  }

  const indices = new Uint32Array(M * P * 6)
  let ptr = 0
  for (let i = 0; i < M; i++) {
    for (let k = 0; k < P; k++) {
      const a0 = vid(i, k)
      const a1 = vid(i, k + 1)
      const b0 = vid(i + 1, k)
      const b1 = vid(i + 1, k + 1)
      indices[ptr++] = a0
      indices[ptr++] = b0
      indices[ptr++] = b1
      indices[ptr++] = a0
      indices[ptr++] = b1
      indices[ptr++] = a1
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setIndex(new THREE.BufferAttribute(indices, 1))
  geometry.computeVertexNormals()
  return geometry
}

type SceneAssets = {
  markGeometry: THREE.BufferGeometry
  particlesGeometry: THREE.BufferGeometry
  dotTexture: THREE.CanvasTexture
  markRadius: number
}

function buildScene(): SceneAssets {
  const markGeometry = buildRibbonGeometry()
  markGeometry.center()
  markGeometry.computeBoundingSphere()

  // ribbon gradient: height + facing direction + a lit crest along the sweep,
  // matching the brand artwork's deep-to-light flow
  {
    const pos = markGeometry.attributes.position
    const nrm = markGeometry.attributes.normal
    const colors = new Float32Array(pos.count * 3)
    const box = new THREE.Box3().setFromBufferAttribute(pos as THREE.BufferAttribute)
    const span = box.max.y - box.min.y || 1
    const color = new THREE.Color()
    for (let i = 0; i < pos.count; i++) {
      const h = THREE.MathUtils.clamp((pos.getY(i) - box.min.y) / span, 0, 1)
      const u = Math.atan2(pos.getZ(i) / RIBBON.Rz, pos.getX(i) / RIBBON.Rx)
      const crest = 0.5 + 0.5 * Math.cos(u - 1.1)
      const s = 0.5 + 0.5 * nrm.getY(i) // 0 facing down -> 1 facing up
      const t = THREE.MathUtils.clamp(0.12 + 0.38 * h + 0.18 * crest * h + 0.36 * s, 0, 1)
      if (t < 0.5) color.copy(COL_DEEP).lerp(COL_MID, t * 2)
      else color.copy(COL_MID).lerp(COL_LIGHT, (t - 0.5) * 2)
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
      color.copy(BLUE).lerp(AZURE, rng())
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
      // slow continuous spin: the ribbon has no front/back, so it reads well
      // from every angle (unlike the old letterform, which needed a pendulum)
      markRef.current.rotation.y = t * 0.28
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
          <meshPhysicalMaterial
            vertexColors
            metalness={0}
            roughness={0.36}
            clearcoat={0.4}
            clearcoatRoughness={0.3}
            envMapIntensity={0.5}
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
        onCreated={({ gl }) => {
          // Neutral keeps the ribbon's blues saturated; the default ACES greys them out
          gl.toneMapping = THREE.NeutralToneMapping
        }}
      >
        <StudioEnvironment />
        <directionalLight position={[4, 6, 5]} intensity={0.85} color="#ffffff" />
        <pointLight position={[-4, 1, 3]} intensity={4} color="#2447D6" />
        <pointLight position={[4, -2, 2]} intensity={3.5} color="#3E96F9" />
        <LogoMark />
      </Canvas>
    </div>
  )
}
