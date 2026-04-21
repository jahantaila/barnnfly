"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function BlueOrb() {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = t * 0.15;
    mesh.current.rotation.y = t * 0.2;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.4}>
      <mesh ref={mesh} position={[0, 0, 0]} scale={1.6}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#1f4dff"
          distort={0.45}
          speed={1.6}
          roughness={0.1}
          metalness={0.4}
        />
      </mesh>
    </Float>
  );
}

function InkTorus() {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.x = Math.sin(t * 0.3) * 0.6;
    mesh.current.rotation.y = t * 0.25;
  });
  return (
    <Float speed={1.0} rotationIntensity={0.5} floatIntensity={1.8}>
      <mesh ref={mesh} position={[2.6, -0.6, -1]} scale={0.55}>
        <torusKnotGeometry args={[1, 0.32, 180, 24]} />
        <meshStandardMaterial
          color="#0a0e27"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
    </Float>
  );
}

function WhiteCapsule() {
  return (
    <Float speed={0.8} rotationIntensity={0.3} floatIntensity={1.2}>
      <mesh position={[-2.3, 1.2, -0.6]} rotation={[0.4, 0.2, -0.3]} scale={0.5}>
        <capsuleGeometry args={[0.6, 1.2, 8, 24]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.15}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} />
      <directionalLight position={[-3, -2, 2]} intensity={0.5} color="#1f4dff" />
      <BlueOrb />
      <InkTorus />
      <WhiteCapsule />
      <Environment preset="city" />
    </Canvas>
  );
}
