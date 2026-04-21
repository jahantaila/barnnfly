"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Blob({
  position,
  color,
  scale,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  speed?: number;
}) {
  const m = useRef<Mesh>(null);
  useFrame((state) => {
    if (!m.current) return;
    const t = state.clock.elapsedTime * speed;
    m.current.position.y = position[1] + Math.sin(t * 0.6) * 0.3;
    m.current.rotation.x = t * 0.1;
    m.current.rotation.y = t * 0.15;
  });
  return (
    <mesh ref={m} position={position} scale={scale}>
      <sphereGeometry args={[1, 48, 48]} />
      <MeshDistortMaterial
        color={color}
        distort={0.55}
        speed={2}
        roughness={0.2}
        metalness={0.3}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

export default function AmbientBackdrop() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 3, 5]} intensity={0.8} />
      <Blob position={[-3.5, 1.5, -2]} color="#1f4dff" scale={1.4} speed={0.8} />
      <Blob position={[3.5, -1.2, -1]} color="#6b8bff" scale={1.1} speed={1.2} />
      <Blob position={[0, 2.2, -3]} color="#0a0e27" scale={0.9} speed={0.6} />
    </Canvas>
  );
}
