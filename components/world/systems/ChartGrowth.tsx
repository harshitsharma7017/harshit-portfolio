"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface ChartGrowthProps {
  offset: [number, number, number];
  active: boolean;
  progress: number;
}

const BAR_HEIGHTS = [1.2, 0.8, 1.6, 0.5, 1.0, 1.4];

export function ChartGrowth({ offset, active, progress }: ChartGrowthProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current || !active) return;
    groupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const targetHeight = BAR_HEIGHTS[i] * Math.min(1, Math.max(0, (progress - 0.3) * 1.5));
      
      // Mechanical, framerate-independent decay rather than rubbery lerp
      const damping = 10.0;
      const lerpT = 1.0 - Math.exp(-damping * delta);
      
      mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, targetHeight, lerpT);
      mesh.position.y = (mesh.scale.y * BAR_HEIGHTS[i]) / 2;
    });
  });

  if (!active) return null;

  return (
    <group ref={groupRef} position={offset}>
      {BAR_HEIGHTS.map((height, i) => (
        <mesh key={i} position={[i * 0.5 - 1.25, 0, 0]} scale={[1, 0.01, 1]}>
          <boxGeometry args={[0.25, height, 0.25]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} transparent opacity={0.6} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
