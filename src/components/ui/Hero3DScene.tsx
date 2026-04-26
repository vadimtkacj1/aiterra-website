'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import * as THREE from 'three'

function ModelLoadSpinner() {
  const { active, loaded, total } = useProgress()
  const busy = active || (total > 0 && loaded < total)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!busy) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [busy])

  if (!mounted || !busy) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[8000] flex flex-col items-center justify-center gap-4 bg-white"
      role="status"
      aria-busy="true"
      aria-label="Loading 3D model"
    >
      <div
        className="h-14 w-14 shrink-0 rounded-full border-[3px] border-gray-200/90 border-t-[#530FAD] animate-spin shadow-sm"
        aria-hidden
      />
    </div>,
    document.body,
  )
}

function SpiralModel() {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const fitted = useRef(false)

  const materials = useLoader(
    MTLLoader,
    '/obj/Meshy_AI_Azure_Spiral_0423123824_texture.mtl',
    (loader) => {
      loader.setResourcePath('/obj/')
    },
  )

  const obj = useLoader(
    OBJLoader,
    '/obj/Meshy_AI_Azure_Spiral_0423123824_texture.obj',
    (loader) => {
      materials.preload()
      loader.setMaterials(materials)
    },
  )

  useFrame((state) => {
    if (!groupRef.current) return

    if (!fitted.current) {
      groupRef.current.updateWorldMatrix(true, true)

      const box = new THREE.Box3().setFromObject(groupRef.current)
      const center = new THREE.Vector3()
      box.getCenter(center)

      let maxRadius = 0
      const v = new THREE.Vector3()
      groupRef.current.traverse((child) => {
        const mesh = child as THREE.Mesh
        if (!mesh.isMesh) return
        const pos = mesh.geometry.attributes.position
        for (let i = 0; i < pos.count; i++) {
          v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld)
          const d = v.distanceTo(center)
          if (d > maxRadius) maxRadius = d
        }
      })

      const perspCamera = camera as THREE.PerspectiveCamera
      const vFov = (perspCamera.fov * Math.PI) / 180
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * perspCamera.aspect)
      const minFov = Math.min(vFov, hFov)
      const dist = (maxRadius / Math.tan(minFov / 2)) * 1.2

      camera.position.set(center.x, center.y, center.z + dist)
      camera.lookAt(center)
      camera.updateMatrixWorld()
      camera.updateProjectionMatrix()
      fitted.current = true
    }

    groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08
  })

  return (
    <group ref={groupRef} scale={3.5}>
      <primitive object={obj} />
    </group>
  )
}

export default function Hero3DScene() {
  return (
    <div className="relative h-full w-full min-h-[180px]">
      <ModelLoadSpinner />
      <Canvas
        camera={{ position: [0, 0, 20], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-4, 2, 3]} intensity={4} color="#1B1BB3" />
        <pointLight position={[4, -2, 2]} intensity={3} color="#530FAD" />
        <pointLight position={[0, 0, 4]} intensity={1.5} color="#ffffff" />
        <Suspense fallback={null}>
          <SpiralModel />
        </Suspense>
      </Canvas>
    </div>
  )
}
