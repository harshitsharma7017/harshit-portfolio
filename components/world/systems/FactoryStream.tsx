"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { setInstanceMatrix } from "@/lib/three/instancing";

// --- Types ---
export interface ModuleNode {
  position: [number, number, number];
  scale: [number, number, number];
}

interface StreamPacket {
  type: "inbound" | "pipeline" | "outbound";
  progress: number; // 0→1
  speed: number;
  active: boolean;
  // For pipeline: which segment (0→1, 1→2, etc.)
  segment: number;
  // For inbound: whether this will be rejected at validation
  rejected: boolean;
  rejectionProgress: number;
}

interface FactoryStreamProps {
  modules: ModuleNode[]; // ordered array of 6 module positions
  active: boolean;
  onIntakeArrive?: () => void; // trigger intake surface pulse
}

const INBOUND_COUNT = 80;
const PIPELINE_COUNT = 250;
const OUTBOUND_COUNT = 50;
const TOTAL = INBOUND_COUNT + PIPELINE_COUNT + OUTBOUND_COUNT;

export function FactoryStream({
  modules,
  active,
  onIntakeArrive,
}: FactoryStreamProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const packets = useRef<StreamPacket[]>([]);

  const geometry = useMemo(() => new THREE.OctahedronGeometry(0.04, 0), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000",
        emissive: "#ffffff",
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.8,
        roughness: 0.3,
        metalness: 0.5,
      }),
    []
  );

  // Pre-compute module centers as Vector3
  const moduleCenters = useMemo(
    () => modules.map((m) => new THREE.Vector3(...m.position)),
    [modules]
  );

  // Inbound entry point: upper-left, above Module 0
  const inboundOrigin = useMemo(() => {
    const m0 = moduleCenters[0];
    return new THREE.Vector3(m0.x - 5, m0.y + 6, m0.z - 2);
  }, [moduleCenters]);

  // Outbound exit: below Module 5
  const outboundExit = useMemo(() => {
    const m5 = moduleCenters[5];
    return new THREE.Vector3(m5.x + 2, m5.y - 5, m5.z + 1);
  }, [moduleCenters]);

  // Initialize packets
  useEffect(() => {
    const pool: StreamPacket[] = [];

    // Inbound
    for (let i = 0; i < INBOUND_COUNT; i++) {
      pool.push({
        type: "inbound",
        progress: Math.random(),
        speed: 0.3 + Math.random() * 0.2,
        active: true,
        segment: 0,
        rejected: false,
        rejectionProgress: 0,
      });
    }

    // Pipeline
    for (let i = 0; i < PIPELINE_COUNT; i++) {
      const seg = Math.floor(Math.random() * 5); // segments 0-4 (between 6 modules)
      pool.push({
        type: "pipeline",
        progress: Math.random(),
        speed: 0.2 + Math.random() * 0.15,
        active: true,
        segment: seg,
        rejected: seg === 0 && Math.random() < 0.10, // ~10% rejection at validation (segment 0→1)
        rejectionProgress: 0,
      });
    }

    // Outbound
    for (let i = 0; i < OUTBOUND_COUNT; i++) {
      pool.push({
        type: "outbound",
        progress: Math.random(),
        speed: 0.15 + Math.random() * 0.1,
        active: true,
        segment: 0,
        rejected: false,
        rejectionProgress: 0,
      });
    }

    packets.current = pool;
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh || !active) return;

    const pos = new THREE.Vector3();
    const hidePos = new THREE.Vector3(0, -200, 0);
    const hideScale = new THREE.Vector3(0.001, 0.001, 0.001);

    packets.current.forEach((pkt, i) => {
      if (!pkt.active) {
        setInstanceMatrix(mesh, i, hidePos, hideScale);
        return;
      }

      pkt.progress += pkt.speed * delta;

      if (pkt.type === "inbound") {
        // Fly from inboundOrigin → Module 0
        if (pkt.progress >= 1.0) {
          // Trigger intake pulse
          if (onIntakeArrive) onIntakeArrive();
          pkt.progress = 0;
          pkt.speed = 0.3 + Math.random() * 0.2;
        }

        pos.lerpVectors(inboundOrigin, moduleCenters[0], pkt.progress);
        // Arc
        pos.y += Math.sin(pkt.progress * Math.PI) * 1.0;
        pos.x += Math.sin(pkt.progress * Math.PI * 2 + i * 0.7) * 0.3;

        setInstanceMatrix(mesh, i, pos);
      } else if (pkt.type === "pipeline") {
        // Flow between modules[segment] → modules[segment+1]
        const fromIdx = pkt.segment;
        const toIdx = pkt.segment + 1;

        if (pkt.progress >= 1.0) {
          // Move to next segment
          pkt.segment = (pkt.segment + 1) % 5;
          pkt.progress = 0;
          pkt.speed = 0.2 + Math.random() * 0.15;
          // New rejection chance at segment 0 (heading toward validation)
          pkt.rejected = pkt.segment === 0 && Math.random() < 0.10;
          pkt.rejectionProgress = 0;
        }

        // Check for validation rejection at segment 0→1
        if (pkt.rejected && pkt.segment === 0 && pkt.progress > 0.7) {
          // Deflect sideways
          pkt.rejectionProgress += delta * 2.0;
          pos.lerpVectors(moduleCenters[fromIdx], moduleCenters[toIdx], pkt.progress);
          pos.y += Math.sin(pkt.progress * Math.PI) * 0.5;
          // Eject to the side
          pos.x += pkt.rejectionProgress * 4.0 * (i % 2 === 0 ? 1 : -1);
          pos.y -= pkt.rejectionProgress * 1.5;

          const fadeScale = Math.max(0.01, 1.0 - pkt.rejectionProgress);
          setInstanceMatrix(mesh, i, pos, new THREE.Vector3(fadeScale, fadeScale, fadeScale));

          if (pkt.rejectionProgress >= 1.0) {
            // Reset: recycle back to a random segment
            pkt.rejected = false;
            pkt.rejectionProgress = 0;
            pkt.segment = Math.floor(Math.random() * 5);
            pkt.progress = 0;
          }
          return;
        }

        // Normal flow
        pos.lerpVectors(moduleCenters[fromIdx], moduleCenters[toIdx], pkt.progress);
        // Gentle arc between modules
        const arc = Math.sin(pkt.progress * Math.PI) * 0.5;
        pos.y += arc;
        // Subtle lateral wobble
        pos.z += Math.sin(pkt.progress * Math.PI * 3 + i * 0.5) * 0.08;

        setInstanceMatrix(mesh, i, pos);
      } else {
        // OUTBOUND: Module 5 → exit, brightening
        if (pkt.progress >= 1.0) {
          pkt.progress = 0;
          pkt.speed = 0.15 + Math.random() * 0.1;
        }

        pos.lerpVectors(moduleCenters[5], outboundExit, pkt.progress);
        // Gentle arc downward
        pos.y -= pkt.progress * pkt.progress * 1.5;

        // Scale: slightly larger than normal packets (these are reports)
        const reportScale = 1.2 + pkt.progress * 0.5;
        setInstanceMatrix(mesh, i, pos, new THREE.Vector3(reportScale, reportScale, reportScale));
      }
    });
  });

  if (!active) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, TOTAL]}
      frustumCulled={false}
    />
  );
}
