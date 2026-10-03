import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useNotes } from './store'

const W = 1.8, H = 2.4, T = 0.09

function Notebook() {
  const open = useNotes((s) => s.open)
  const color = useNotes((s) => s.notes.find((n) => n.id === s.activeId)?.color ?? '#ff5ca8')
  const root = useRef(), cover = useRef(), page = useRef(), band = useRef()
  const target = useRef({ open: 0 })

  useFrame((state, dt) => {
    const k = 1 - Math.pow(0.0015, dt)
    target.current.open = THREE.MathUtils.lerp(target.current.open, open ? 1 : 0, k)
    const o = target.current.open
    cover.current.rotation.y = -o * Math.PI * 0.92
    page.current.rotation.y = -o * Math.PI * 0.78
    // drift left while open so the editor has room, tilt toward the pointer when closed
    root.current.position.x = THREE.MathUtils.lerp(root.current.position.x, open ? -1.1 : 0, k)
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, (open ? 0.1 : -0.45) + state.pointer.x * 0.25, k)
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -state.pointer.y * 0.12, k)
    band.current.color.lerp(new THREE.Color(color), 0.1)
  })

  return (
    <group ref={root} position={[0, 0, 0]}>
      {/* spine at x = 0, pages extend toward +x */}
      <mesh position={[-0.02, 0, 0]}>
        <boxGeometry args={[0.1, H, T * 2.4]} />
        <meshStandardMaterial color="#151232" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[W / 2, 0, -T * 0.9]}>
        <boxGeometry args={[W, H, 0.04]} />
        <meshStandardMaterial color="#1b1745" roughness={0.5} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[W / 2 + 0.01, 0, -T * 0.6 + i * 0.03]}>
          <boxGeometry args={[W - 0.1, H - 0.1, 0.02]} />
          <meshStandardMaterial color="#f3efe6" roughness={0.9} />
        </mesh>
      ))}
      <group ref={page} position={[0, 0, T * 0.1]}>
        <mesh position={[W / 2, 0, 0]}>
          <boxGeometry args={[W - 0.1, H - 0.1, 0.02]} />
          <meshStandardMaterial color="#faf6ec" roughness={0.9} />
        </mesh>
      </group>
      <group ref={cover} position={[0, 0, T * 0.9]}>
        <mesh position={[W / 2, 0, 0]}>
          <boxGeometry args={[W, H, 0.05]} />
          <meshStandardMaterial color="#1b1745" roughness={0.35} metalness={0.45} />
        </mesh>
        <mesh position={[W * 0.78, 0, 0.03]}>
          <boxGeometry args={[0.12, H, 0.012]} />
          <meshStandardMaterial ref={band} color="#ff5ca8" emissive="#ff5ca8" emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[W * 0.42, H * 0.28, 0.03]}>
          <circleGeometry args={[0.2, 48]} />
          <meshStandardMaterial color="#38e8ff" emissive="#38e8ff" emissiveIntensity={0.9} />
        </mesh>
      </group>
    </group>
  )
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0.9, 0, 6], fov: 38 }} dpr={[1, 2]} style={{ position: 'fixed', inset: 0 }}>
      <color attach="background" args={['#07070f']} />
      <fog attach="fog" args={['#07070f', 7, 16]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 4]} intensity={30} color="#38e8ff" />
      <pointLight position={[-4, -2, 3]} intensity={25} color="#ff5ca8" />
      <Environment preset="night" />
      <Sparkles count={110} scale={[14, 8, 6]} size={2.2} speed={0.25} color="#a78bfa" />
      <Sparkles count={40} scale={[10, 6, 4]} size={4} speed={0.4} color="#38e8ff" />
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
        <Notebook />
      </Float>
      <ContactShadows position={[0, -1.9, 0]} opacity={0.5} scale={9} blur={3} far={4} color="#c026d3" />
    </Canvas>
  )
}
