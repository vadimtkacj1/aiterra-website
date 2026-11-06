'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { CarBody, CarPart } from './CarAssembly'

export type AssemblyProgress = { current: number; turn: number; invalidate: (() => void) | null }

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
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3)
const clamp = (value: number) => Math.min(1, Math.max(0, value))
const stage = (progress: number, start: number) => easeOut(clamp((progress - start) / SPAN))

type Rest = { position: THREE.Vector3; rotation: THREE.Euler }

type Animated = {
  part: CarPart | null
  object: THREE.Object3D
  rest: Rest
  start: number
  from: THREE.Vector3
  spin: THREE.Vector3
  absorb: boolean
  scale: number
}

type Loaded = { car: THREE.Group; debris: Record<DebrisName, THREE.Group> }

function loadModels(body: CarBody): Promise<Loaded> {
  const loader = new GLTFLoader()
  const load = (name: string) => loader.loadAsync(`${MODELS_PATH}${name}.glb`).then((gltf) => gltf.scene)
  return Promise.all([load(MODEL_BY_BODY[body]), ...DEBRIS.map(load)]).then(([car, ...parts]) => ({
    car,
    debris: Object.fromEntries(DEBRIS.map((name, index) => [name, parts[index]])) as Record<DebrisName, THREE.Group>,
  }))
}

function restOf(object: THREE.Object3D): Rest {
  return { position: object.position.clone(), rotation: object.rotation.clone() }
}

function shadowTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(0,0,0,0.55)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
  }
  return new THREE.CanvasTexture(canvas)
}

function glowTexture(color: string) {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
  }
  return new THREE.CanvasTexture(canvas)
}

function buildScene({ car: model, debris }: Loaded) {
  const root = new THREE.Group()
  const car = model.clone(true)
  root.add(car)
  const body = car.getObjectByName('body') ?? car
  const box = new THREE.Box3().setFromObject(car)
  const size = box.getSize(new THREE.Vector3())
  const animated: Animated[] = []

  animated.push({
    part: 'body',
    object: body,
    rest: restOf(body),
    start: 0,
    from: new THREE.Vector3(0, size.y * 2.6, 0),
    spin: new THREE.Vector3(0.35, 0.7, 0.25),
    absorb: false,
    scale: 1,
  })

  car.children
    .filter((child) => child.name.startsWith('wheel'))
    .forEach((wheel) => {
      const front = wheel.position.z > 0
      const side = wheel.position.x === 0 ? 0 : Math.sign(wheel.position.x)
      animated.push({
        part: front ? 'frontWheel' : 'rearWheel',
        object: wheel,
        rest: restOf(wheel),
        start: side === 0 ? 0.44 : front ? 0.3 : 0.38,
        from: new THREE.Vector3(side * size.x * 2.2, size.y * 0.4, side === 0 ? -size.z : front ? size.z * 0.35 : -size.z * 0.35),
        spin: new THREE.Vector3(front ? -14 : 14, 0, 0),
        absorb: false,
        scale: 1,
      })
    })

  const place = (template: THREE.Group, position: THREE.Vector3, rotationY: number, start: number, from: THREE.Vector3, scale: number) => {
    const part = template.clone(true)
    part.position.copy(position)
    part.rotation.set(0, rotationY, 0)
    part.scale.setScalar(scale)
    root.add(part)
    animated.push({
      part: null,
      object: part,
      rest: restOf(part),
      start,
      from,
      spin: new THREE.Vector3(2.4, 3.2, 1.2),
      absorb: true,
      scale,
    })
  }

  const doorScale = (size.y * 0.55) / 0.9
  for (const side of [1, -1]) {
    place(
      debris['debris-door'],
      new THREE.Vector3(side * (box.max.x - 0.02), box.min.y + size.y * 0.18, 0.05),
      0,
      0.1,
      new THREE.Vector3(side * size.x * 1.8, size.y * 1.2, 0.4),
      doorScale,
    )
  }
  const axleScale = (size.x * 0.8) / 1.2
  for (const wheel of car.children.filter((child) => child.name.startsWith('wheel') && child.position.x > 0)) {
    place(
      debris['debris-drivetrain-axle'],
      new THREE.Vector3(0, wheel.position.y - 0.12, wheel.position.z),
      0,
      0.05,
      new THREE.Vector3(0, -size.y * 1.6, wheel.position.z * 0.6),
      axleScale,
    )
  }
  place(
    debris['debris-bumper'],
    new THREE.Vector3(0, box.min.y + size.y * 0.12, box.max.z - 0.05),
    0,
    0.22,
    new THREE.Vector3(-size.x * 0.4, size.y * 1.8, size.z * 1.1),
    (size.x * 0.85) / 1.3,
  )
  for (const wheel of car.children.filter((child) => child.name.startsWith('wheel') && child.position.x !== 0)) {
    const side = Math.sign(wheel.position.x)
    place(
      debris['debris-bolt'],
      new THREE.Vector3(wheel.position.x + side * 0.12, wheel.position.y - 0.08, wheel.position.z),
      0,
      wheel.position.z > 0 ? 0.36 : 0.44,
      new THREE.Vector3(side * size.x * 1.4, size.y * 1.4, wheel.position.z * 1.8),
      0.9,
    )
  }

  const lights: { sprite: THREE.Sprite; start: number }[] = []
  const lamp = (texture: THREE.Texture, position: THREE.Vector3, start: number) => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }),
    )
    sprite.position.copy(position)
    sprite.scale.setScalar(size.x * 0.24)
    root.add(sprite)
    lights.push({ sprite, start })
  }
  const head = glowTexture('rgba(255,236,170,1)')
  const tail = glowTexture('rgba(255,70,80,1)')
  for (const side of [1, -1]) {
    lamp(head, new THREE.Vector3(side * size.x * 0.27, box.min.y + size.y * 0.42, box.max.z + 0.02), 0.5)
    lamp(tail, new THREE.Vector3(side * size.x * 0.3, box.min.y + size.y * 0.45, box.min.z - 0.02), 0.56)
  }

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(size.x * 1.9, size.z * 1.35),
    new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false, opacity: 0 }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = box.min.y + 0.005
  root.add(shadow)

  return { root, animated, lights, shadow, size, center: box.getCenter(new THREE.Vector3()) }
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
  const scene = useMemo(() => buildScene(loaded), [loaded])
  const shown = useRef(-1)
  const { camera, size, invalidate } = useThree()

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
      if (item.absorb) {
        const gone = clamp((p - item.start - SPAN) / ABSORB)
        item.object.scale.setScalar(item.scale * (1 - easeOut(gone)))
        item.object.visible = gone < 1
      }
    }
    for (const light of scene.lights) {
      ;(light.sprite.material as THREE.SpriteMaterial).opacity = stage(p, light.start) * 0.95
    }
    ;(scene.shadow.material as THREE.MeshBasicMaterial).opacity = stage(p, 0.05)

    const aspect = size.width / Math.max(1, size.height)
    const halfWidth = Math.max(scene.size.z, scene.size.x) * 0.5
    const vertical = THREE.MathUtils.degToRad(FOV) / 2
    const horizontal = Math.atan(Math.tan(vertical) * aspect)
    const distance = Math.max(halfWidth / Math.tan(horizontal), (scene.size.y * 0.95) / Math.tan(vertical)) * 0.92
    const angle = THREE.MathUtils.lerp(1.95, 1.05, easeOut(p)) + progress.turn
    camera.position.set(
      scene.center.x + Math.sin(angle) * distance,
      scene.center.y + distance * 0.36,
      scene.center.z + Math.cos(angle) * distance,
    )
    camera.lookAt(scene.center.x, scene.center.y * 0.9, scene.center.z)

    if (shown.current !== target) invalidate()
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
        const part = pick(event.object)
        if (!part) return
        event.stopPropagation()
        onPick(part)
      }}
      onPointerOver={(event: { object: THREE.Object3D }) => {
        if (pick(event.object)) document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = ''
      }}
    />
  )
}

export default function CarScene3D({
  body,
  progress,
  onReady,
  onPick,
}: {
  body: CarBody
  progress: AssemblyProgress
  onReady: () => void
  onPick: (part: CarPart) => void
}) {
  const drag = useRef<{ x: number; turn: number } | null>(null)
  const [loaded, setLoaded] = useState<Loaded | null>(null)

  useEffect(() => {
    let cancelled = false
    loadModels(body)
      .then((models) => {
        if (!cancelled) setLoaded(models)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [body])

  useEffect(() => {
    if (loaded) onReady()
  }, [loaded, onReady])

  if (!loaded) return null
  return (
    <div
      style={{ position: 'absolute', inset: 0, touchAction: 'pan-y', cursor: 'grab' }}
      onPointerDown={(event) => {
        if (progress.current < 0.9) return
        drag.current = { x: event.clientX, turn: progress.turn }
      }}
      onPointerMove={(event) => {
        if (!drag.current) return
        progress.turn = drag.current.turn - (event.clientX - drag.current.x) / 140
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
      camera={{ fov: FOV, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
    >
      <hemisphereLight args={['#dfe9ff', '#0b1230', 1.1]} />
      <directionalLight position={[3, 6, 4]} intensity={2.2} />
      <directionalLight position={[-4, 3, -3]} intensity={0.6} color="#3e96f9" />
      <Assembly loaded={loaded} progress={progress} onPick={onPick} />
    </Canvas>
    </div>
  )
}
