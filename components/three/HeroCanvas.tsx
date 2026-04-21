"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

/**
 * Hero 3D: a single, intentional dog bone.
 * Classic cartoon-bone silhouette (four lobes + shaft), Derby Digital blue
 * with a clean polished PBR material. Slow rotation + gentle float — no
 * distortion, no competing objects, no blur. Sits to the right of the
 * headline so the text stays the hero of the hero.
 */

function DogBone() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.35;
    group.current.rotation.x = Math.sin(t * 0.4) * 0.08;
  });

  const mat = {
    color: "#1f4dff",
    metalness: 0.35,
    roughness: 0.18,
    envMapIntensity: 1.1,
  } as const;

  return (
    <Float
      speed={1.1}
      rotationIntensity={0.15}
      floatIntensity={1.2}
      floatingRange={[-0.15, 0.15]}
    >
      <group ref={group} rotation={[0.15, -0.2, 0.1]} scale={1.05}>
        {/* Shaft */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <capsuleGeometry args={[0.42, 2.2, 16, 32]} />
          <meshStandardMaterial {...mat} />
        </mesh>

        {/* Left end — two lobes */}
        <mesh position={[-1.42, 0.48, 0]} castShadow>
          <sphereGeometry args={[0.6, 48, 48]} />
          <meshStandardMaterial {...mat} />
        </mesh>
        <mesh position={[-1.42, -0.48, 0]} castShadow>
          <sphereGeometry args={[0.6, 48, 48]} />
          <meshStandardMaterial {...mat} />
        </mesh>

        {/* Right end — two lobes */}
        <mesh position={[1.42, 0.48, 0]} castShadow>
          <sphereGeometry args={[0.6, 48, 48]} />
          <meshStandardMaterial {...mat} />
        </mesh>
        <mesh position={[1.42, -0.48, 0]} castShadow>
          <sphereGeometry args={[0.6, 48, 48]} />
          <meshStandardMaterial {...mat} />
        </mesh>

        {/* Subtle specular highlight sphere — a tiny "shine" dot */}
        <mesh position={[-0.3, 0.3, 0.45]} scale={0.08}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </Float>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.3, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      shadows
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 5, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#a8b8ff" />
      <DogBone />
      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.35}
        scale={6}
        blur={2.4}
        far={3}
        color="#1f4dff"
      />
      <Environment preset="city" />
    </Canvas>
  );
}
