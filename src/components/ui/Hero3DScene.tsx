'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import { SpinnerRing } from '@/components/ui/SpinnerRing'
import * as THREE from 'three'

function SpiralModel() {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const fitted = useRef(false)
  const { scene } = useGLTF('/obj/model.draco.glb')

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
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/obj/model.draco.glb')

export default function Hero3DScene() {
  return (
    <div className="relative h-full w-full min-h-[180px]">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-4, 2, 3]} intensity={4} color="#1B1BB3" />
        <pointLight position={[4, -2, 2]} intensity={3} color="#530FAD" />
        <Suspense
          fallback={
            <Html center prepend zIndexRange={[100, 0]}>
              <div className="pointer-events-none flex flex-col items-center">
                <SpinnerRing variant="on-light" className="h-12 w-12" aria-label="טוען מודל" />
              </div>
            </Html>
          }
        >
          <SpiralModel />
        </Suspense>
      </Canvas>
    </div>
  )
}
