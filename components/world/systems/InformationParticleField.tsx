"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PERFORMANCE } from "@/lib/constants";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { setInstanceMatrix } from "@/lib/three/instancing";

interface ParticleData {
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
}

interface InformationParticleFieldProps {
  count?: number;
  zoneOffset?: [number, number, number];
  visible?: boolean;
}

export function InformationParticleField({
  count = PERFORMANCE.bootParticles,
  zoneOffset = [0, 0, 0],
  visible = true,
}: InformationParticleFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { state } = useExperienceContext();
  const bootProgress = useRef(0);

  const particles = useMemo(() => {
    const data: ParticleData[] = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 16,
        z: (Math.random() - 0.5) * 6,
        targetX: (Math.random() - 0.5) * 4,
        targetY: (Math.random() - 0.5) * 3,
        targetZ: (Math.random() - 0.5) * 2,
      });
    }
    return data;
  }, [count]);

  const geometry = useMemo(() => new THREE.BoxGeometry(0.025, 0.025, 0.025), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.7,
      }),
    []
  );

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh || !visible) return;

    const isBoot = state.activeZone === "boot";
    if (isBoot && !state.bootComplete) {
      bootProgress.current = Math.min(1, bootProgress.current + delta * 0.15);
    }

    const coalesceAmount = isBoot ? bootProgress.current : 0;
    const dummy = new THREE.Vector3();

    particles.forEach((p, i) => {
      if (isBoot) {
        p.x += (p.targetX - p.x) * 0.02 * (0.5 + coalesceAmount);
        p.y += (p.targetY - p.y) * 0.02 * (0.5 + coalesceAmount);
        p.z += (p.targetZ - p.z) * 0.02 * (0.5 + coalesceAmount);
      } else {
        p.y += 0.0008;
        if (p.y > 6) p.y = -6;
      }

      dummy.set(p.x + zoneOffset[0], p.y + zoneOffset[1], p.z + zoneOffset[2]);
      setInstanceMatrix(mesh, i, dummy);
    });
  });

  if (!visible) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  );
}
