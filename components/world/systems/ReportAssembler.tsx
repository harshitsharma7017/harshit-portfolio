"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface ReportAssemblerProps {
  offset: [number, number, number];
  active: boolean;
  progress: number;
}

export function ReportAssembler({ offset, active, progress }: ReportAssemblerProps) {
  const pagesRef = useRef<THREE.Group>(null);
  const pageCount = 5;

  const pages = useMemo(
    () =>
      Array.from({ length: pageCount }, (_, i) => ({
        y: i * 0.08,
        z: i * 0.02,
      })),
    []
  );

  useFrame(() => {
    if (!pagesRef.current || !active) return;
    pagesRef.current.children.forEach((child, i) => {
      if (i >= pageCount) return;
      const threshold = (i + 1) / pageCount;
      const visible = progress >= threshold * 0.6;
      child.visible = visible;
      if (visible) {
        child.position.y = pages[i].y + Math.sin(Date.now() * 0.001 + i) * 0.01;
      }
    });
  });

  if (!active) return null;

  return (
    <group ref={pagesRef} position={offset}>
      {pages.map((page, i) => (
        <mesh key={i} position={[0, page.y, page.z]} visible={false}>
          <boxGeometry args={[1.4, 1.8, 0.02]} />
          <meshPhysicalMaterial color="#000000" metalness={0.8} roughness={0.1} transmission={0.9} clearcoat={1.0} clearcoatRoughness={0.05} transparent opacity={0.7} />
        </mesh>
      ))}

      {progress > 0.75 && (
        <mesh position={[2.5, 1.5 + (progress - 0.75) * 4, 0]} rotation={[0.2, -0.3, 0.1]}>
          <boxGeometry args={[1.2, 1.6, 0.02]} />
          <meshPhysicalMaterial color="#000000" metalness={0.8} roughness={0.1} transmission={0.9} clearcoat={1.0} clearcoatRoughness={0.05} transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}
