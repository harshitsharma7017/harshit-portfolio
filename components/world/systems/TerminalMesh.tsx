"use client";

import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface TerminalMeshProps {
  position: [number, number, number];
  scale?: number;
  active?: boolean;
  imageUrl?: string;
}

export function TerminalMesh({
  position,
  scale = 1,
  active = true,
  imageUrl,
}: TerminalMeshProps) {
  const texture = useTexture(imageUrl || "/projects/citycore.png"); // Fallback if needed, though shouldn't be
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 1.6, 0.08]} />
        <meshStandardMaterial color="#080808" roughness={0.85} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[2.2, 1.3, 0.01]} />
        {imageUrl ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshPhysicalMaterial 
            color="#000000" 
            metalness={0.9} 
            roughness={0.15} 
            clearcoat={1.0} 
            clearcoatRoughness={0.1} 
          />
        )}
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[2.5, 0.06, 0.1]} />
        <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.9} />
      </mesh>
    </group>
  );
}
