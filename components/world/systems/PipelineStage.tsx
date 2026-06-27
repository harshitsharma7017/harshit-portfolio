"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const STAGES = [
  "Ingest",
  "Validate",
  "Compute",
  "Assemble",
  "Output",
];

interface PipelineStageProps {
  offset: [number, number, number];
  active: boolean;
  progress: number;
}

export function PipelineStage({ offset, active, progress }: PipelineStageProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !active) return;
    groupRef.current.children.forEach((child, i) => {
      const threshold = (i + 1) / STAGES.length;
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = progress >= threshold - 0.15 ? 0.9 : 0.2;
      }
    });
  });

  if (!active) return null;

  return (
    <group ref={groupRef} position={offset}>
      {STAGES.map((_, i) => (
        <mesh key={STAGES[i]} position={[i * 1.8 - 3.6, 0, 0]}>
          <boxGeometry args={[1.2, 0.6, 0.6]} />
          <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.7} transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}
