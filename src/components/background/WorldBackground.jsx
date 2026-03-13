import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Cloud, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================
// Sky Gradient Background
// ============================================================
function SkyBackground() {
  const meshRef = useRef()
  return (
    <mesh ref={meshRef} position={[0, 0, -20]} scale={[100, 60, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial>
        <color attach="color" args={['#AEE8F8']} />
      </meshBasicMaterial>
    </mesh>
  )
}

// ============================================================
// Rolling Hills
// ============================================================
function Hill({ position, color, scale = [1, 1, 1] }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshToonMaterial color={color} />
    </mesh>
  )
}

function Hills() {
  return (
    <group position={[0, -5, -8]}>
      <Hill position={[-12, 0, 0]} color="#6BC95C" scale={[3, 2, 2]} />
      <Hill position={[-5, -0.5, 0]} color="#5DBB41" scale={[4, 2.5, 2]} />
      <Hill position={[4, 0, 0]} color="#6BC95C" scale={[5, 3, 2]} />
      <Hill position={[14, -0.5, 0]} color="#5DBB41" scale={[3.5, 2, 2]} />
      <Hill position={[22, 0, 0]} color="#7DD96D" scale={[3, 2, 2]} />
      <Hill position={[-20, 0, 0]} color="#7DD96D" scale={[4, 2.5, 2]} />
    </group>
  )
}

// ============================================================
// Ground
// ============================================================
function Ground() {
  return (
    <mesh position={[0, -8, -5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 20]} />
      <meshToonMaterial color="#6BC95C" />
    </mesh>
  )
}

// ============================================================
// Train Track
// ============================================================
function TrainTrack() {
  const railMaterial = <meshToonMaterial color="#8B7355" />
  return (
    <group position={[0, -6.8, -3]}>
      {/* Rail 1 */}
      <mesh position={[0, 0.1, 0.4]} rotation={[0, 0, 0]}>
        <boxGeometry args={[60, 0.1, 0.15]} />
        <meshToonMaterial color="#888888" />
      </mesh>
      {/* Rail 2 */}
      <mesh position={[0, 0.1, -0.4]} rotation={[0, 0, 0]}>
        <boxGeometry args={[60, 0.1, 0.15]} />
        <meshToonMaterial color="#888888" />
      </mesh>
      {/* Sleepers */}
      {Array.from({ length: 30 }, (_, i) => (
        <mesh key={i} position={[-14 + i * 1.2, 0, 0]}>
          <boxGeometry args={[0.8, 0.1, 1.2]} />
          <meshToonMaterial color="#8B7355" />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================
// Cartoon Train
// ============================================================
function TrainCar({ offset = 0 }) {
  return (
    <group position={[offset, 0, 0]}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2.2, 1.2, 1]} />
        <meshToonMaterial color="#FF6B6B" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[2.0, 0.3, 0.9]} />
        <meshToonMaterial color="#D63031" />
      </mesh>
      {/* Window */}
      <mesh position={[0.3, 0.6, 0.51]}>
        <boxGeometry args={[0.5, 0.4, 0.05]} />
        <meshToonMaterial color="#74B9FF" />
      </mesh>
      <mesh position={[-0.4, 0.6, 0.51]}>
        <boxGeometry args={[0.4, 0.35, 0.05]} />
        <meshToonMaterial color="#74B9FF" />
      </mesh>
      {/* Wheels */}
      {[-0.65, 0.65].map((x, i) => (
        <mesh key={i} position={[x, -0.15, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.18, 12]} />
          <meshToonMaterial color="#2D3436" />
        </mesh>
      ))}
      {[-0.65, 0.65].map((x, i) => (
        <mesh key={`b${i}`} position={[x, -0.15, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.18, 12]} />
          <meshToonMaterial color="#2D3436" />
        </mesh>
      ))}
    </group>
  )
}

function TrainEngine() {
  return (
    <group>
      {/* Engine body */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[2.5, 1.4, 1.1]} />
        <meshToonMaterial color="#FDCB6E" />
      </mesh>
      {/* Front boiler */}
      <mesh position={[1.4, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 0.8, 16]} />
        <meshToonMaterial color="#E17055" />
      </mesh>
      {/* Chimney */}
      <mesh position={[1.1, 1.3, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.5, 10]} />
        <meshToonMaterial color="#2D3436" />
      </mesh>
      {/* Cabin */}
      <mesh position={[-0.5, 1.5, 0]}>
        <boxGeometry args={[1.4, 0.7, 1]} />
        <meshToonMaterial color="#E17055" />
      </mesh>
      {/* Front face + eyes */}
      <mesh position={[1.81, 0.55, 0]}>
        <boxGeometry args={[0.05, 0.7, 0.9]} />
        <meshToonMaterial color="#F9CA24" />
      </mesh>
      {/* Happy face eyes */}
      <mesh position={[1.83, 0.7, 0.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshToonMaterial color="#2D3436" />
      </mesh>
      <mesh position={[1.83, 0.7, -0.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshToonMaterial color="#2D3436" />
      </mesh>
      {/* Wheels */}
      {[-0.8, 0.2].map((x, i) => (
        <mesh key={i} position={[x, -0.1, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.2, 14]} />
          <meshToonMaterial color="#2D3436" />
        </mesh>
      ))}
      {[-0.8, 0.2].map((x, i) => (
        <mesh key={`b${i}`} position={[x, -0.1, -0.56]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.2, 14]} />
          <meshToonMaterial color="#2D3436" />
        </mesh>
      ))}
    </group>
  )
}

function AnimatedTrain() {
  const trainRef = useRef()
  const t = useRef(0)
  const LOOP = 40

  useFrame((_, delta) => {
    t.current = (t.current + delta * 2.5) % LOOP
    if (trainRef.current) {
      trainRef.current.position.x = -20 + t.current * (40 / LOOP)
    }
  })

  return (
    <group ref={trainRef} position={[-20, -5.4, -3]}>
      <TrainEngine />
      <TrainCar offset={-2.7} />
      <TrainCar offset={-5.2} />
    </group>
  )
}

// ============================================================
// Smoke Puffs
// ============================================================
function SmokeParticle({ delay = 0 }) {
  const meshRef = useRef()
  const t = useRef(delay)
  useFrame((_, delta) => {
    t.current += delta
    if (meshRef.current) {
      meshRef.current.position.y = ((t.current * 0.8) % 3)
      meshRef.current.material.opacity = Math.max(0, 1 - (t.current % 3) / 3)
    }
  })
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.15, 8, 8]} />
      <meshToonMaterial color="white" transparent opacity={0.8} />
    </mesh>
  )
}

// ============================================================
// Floating Clouds
// ============================================================
function CartoonCloud({ position }) {
  return (
    <Float speed={0.5} floatIntensity={0.5} rotationIntensity={0}>
      <group position={position}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.8, 12, 8]} />
          <meshToonMaterial color="white" />
        </mesh>
        <mesh position={[0.7, 0.2, 0]}>
          <sphereGeometry args={[0.6, 12, 8]} />
          <meshToonMaterial color="white" />
        </mesh>
        <mesh position={[-0.7, 0.1, 0]}>
          <sphereGeometry args={[0.55, 12, 8]} />
          <meshToonMaterial color="white" />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.65, 12, 8]} />
          <meshToonMaterial color="white" />
        </mesh>
      </group>
    </Float>
  )
}

// ============================================================
// Floating Balloons
// ============================================================
function Balloon({ position, color }) {
  return (
    <Float speed={1.2} floatIntensity={1} rotationIntensity={0.2}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshToonMaterial color={color} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.5, 4]} />
          <meshToonMaterial color="#888" />
        </mesh>
      </group>
    </Float>
  )
}

// ============================================================
// Stars / Sparkles
// ============================================================
function Sparkles3D() {
  const points = useMemo(() => {
    return Array.from({ length: 50 }, () => [
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 20 + 5,
      (Math.random() - 0.5) * 10 - 5,
    ])
  }, [])

  return (
    <>
      {points.map((pos, i) => (
        <Float key={i} speed={Math.random() * 2 + 0.5} floatIntensity={0.5}>
          <mesh position={pos}>
            <octahedronGeometry args={[0.06, 0]} />
            <meshToonMaterial color={['#FFD93D', '#FF6B9D', '#C77DFF', '#4ECDC4'][i % 4]} />
          </mesh>
        </Float>
      ))}
    </>
  )
}

// ============================================================
// Cartoon Trees
// ============================================================
function CartoonTree({ position, color = '#5DBB41' }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 8]} />
        <meshToonMaterial color="#8B7355" />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.6, 1.0, 10]} />
        <meshToonMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.4, 0.8, 10]} />
        <meshToonMaterial color={color} />
      </mesh>
    </group>
  )
}

// ============================================================
// Main Scene
// ============================================================
function Scene() {
  return (
    <>
      {/* Sky */}
      <SkyBackground />

      {/* Ambient + directional light */}
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight position={[10, 15, 5]} intensity={1.2} color="#fff5e0" />

      {/* Stars  */}
      <Stars radius={60} depth={40} count={300} factor={2} saturation={0.5} fade speed={0.5} />

      {/* Sparkle stars */}
      <Sparkles3D />

      {/* Clouds */}
      <CartoonCloud position={[-8, 5, -10]} />
      <CartoonCloud position={[-2, 6, -12]} />
      <CartoonCloud position={[6, 4.5, -10]} />
      <CartoonCloud position={[13, 6, -12]} />
      <CartoonCloud position={[-14, 4, -10]} />

      {/* Balloons */}
      <Balloon position={[-6, 2, -5]} color="#FF6B9D" />
      <Balloon position={[5, 3, -6]} color="#FFD93D" />
      <Balloon position={[-2, 4, -7]} color="#C77DFF" />
      <Balloon position={[10, 2, -5]} color="#4ECDC4" />
      <Balloon position={[-12, 3, -6]} color="#FF8C42" />

      {/* Ground & Hills */}
      <Ground />
      <Hills />

      {/* Trees */}
      <CartoonTree position={[-16, -5.5, -4]} color="#5DBB41" />
      <CartoonTree position={[-14, -5.5, -4.5]} color="#6BC95C" />
      <CartoonTree position={[15, -5.5, -4]} color="#5DBB41" />
      <CartoonTree position={[17, -5.5, -4.5]} color="#7DD96D" />

      {/* Train track */}
      <TrainTrack />

      {/* Animated Train */}
      <AnimatedTrain />
    </>
  )
}

// ============================================================
// WorldBackground – exported component
// ============================================================
export default function WorldBackground() {
  return (
    <div id="three-bg">
      <Canvas
        camera={{ position: [0, 2, 12], fov: 60 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
