"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PERFORMANCE } from "@/lib/constants";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { setInstanceMatrix } from "@/lib/three/instancing";

interface Packet {
  progress: number;
  speed: number;
  lane: number;
  isError: boolean;
  active: boolean;
}

interface InstancedPacketStreamProps {
  origin: [number, number, number];
  target: [number, number, number];
  active: boolean;
}

export function InstancedPacketStream({
  origin,
  target,
  active,
}: InstancedPacketStreamProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { state } = useExperienceContext();
  const packets = useRef<Packet[]>([]);

  const geometry = useMemo(() => new THREE.BoxGeometry(0.03, 0.03, 0.12), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  useEffect(() => {
    packets.current = Array.from({ length: PERFORMANCE.backendPackets }, (_, i) => ({
      progress: Math.random(),
      speed: 0.008 + Math.random() * 0.012,
      lane: (i % 20) / 20,
      isError: Math.random() < 0.08,
      active: true,
    }));
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh || !active) return;

    const throughput = state.throughputMultiplier;
    const originVec = new THREE.Vector3(...origin);
    const targetVec = new THREE.Vector3(...target);
    const direction = targetVec.clone().sub(originVec);
    const dummy = new THREE.Vector3();
    const offset = new THREE.Vector3();

    packets.current.forEach((packet, i) => {
      if (!packet.active) {
        dummy.set(0, -100, 0);
        setInstanceMatrix(mesh, i, dummy, new THREE.Vector3(0.001, 0.001, 0.001));
        return;
      }

      packet.progress += packet.speed * throughput;
      if (packet.progress >= 1) {
        packet.progress = 0;
        packet.isError = Math.random() < 0.08 / throughput;
      }

      const spread = (packet.lane - 0.5) * 6;
      offset.set(spread, Math.sin(packet.progress * Math.PI * 4) * 0.3, spread * 0.5);
      dummy.copy(originVec).add(direction.clone().multiplyScalar(packet.progress)).add(offset);

      if (packet.isError && packet.progress > 0.7) {
        dummy.y -= (packet.progress - 0.7) * 8;
        if (packet.progress > 0.95) {
          packet.active = false;
          setTimeout(() => {
            packet.active = true;
            packet.progress = 0;
            packet.isError = Math.random() < 0.08;
          }, 500);
        }
      }

      setInstanceMatrix(mesh, i, dummy);
    });
  });

  if (!active) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, PERFORMANCE.backendPackets]}
      frustumCulled={false}
    />
  );
}
