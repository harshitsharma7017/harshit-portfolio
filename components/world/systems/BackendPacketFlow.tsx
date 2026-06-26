"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PERFORMANCE } from "@/lib/constants";
import { setInstanceMatrix } from "@/lib/three/instancing";

// Tier Y positions must match ServerCore
const TIER_Y = [5.0, 3.8, 2.6, 1.4, 0.2, -1.0];
const TIER_GAP = TIER_Y[0] - TIER_Y[1]; // 1.2
const TOTAL_HEIGHT = TIER_Y[0] - TIER_Y[TIER_Y.length - 1]; // 6.0

// Lane positions — 4 disciplined columns
const LANES = [-1.2, -0.4, 0.4, 1.2];

const REQUEST_COUNT = 800;
const RESPONSE_COUNT = PERFORMANCE.backendPackets - REQUEST_COUNT; // 400

// Conduit X/Z positions for response path (matching ServerCore conduit corners)
const CONDUIT_XZ: [number, number][] = [
  [-4.0 * 0.42, -2.5 * 0.42],
  [4.0 * 0.42, -2.5 * 0.42],
  [-4.0 * 0.42, 2.5 * 0.42],
  [4.0 * 0.42, 2.5 * 0.42],
];

// --- Request Packet State ---
interface RequestPacket {
  progress: number; // 0 (top) → 1 (bottom)
  speed: number;
  lane: number; // index into LANES
  isError: boolean;
  errorTier: number; // which tier the error ejects at
  active: boolean;
}

// --- Response Packet State ---
interface ResponsePacket {
  progress: number; // 0 (bottom) → 1 (top)
  speed: number;
  conduit: number; // index into CONDUIT_XZ
  active: boolean;
}

interface BackendPacketFlowProps {
  active: boolean;
  throughputMultiplier: number;
}

export function BackendPacketFlow({
  active,
  throughputMultiplier,
}: BackendPacketFlowProps) {
  const requestMeshRef = useRef<THREE.InstancedMesh>(null);
  const responseMeshRef = useRef<THREE.InstancedMesh>(null);
  const requestPackets = useRef<RequestPacket[]>([]);
  const responsePackets = useRef<ResponsePacket[]>([]);

  // Octahedron for requests — more geometric, crystalline
  const requestGeo = useMemo(
    () => new THREE.OctahedronGeometry(0.06, 0),
    []
  );
  const requestMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000",
        emissive: "#ffffff",
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.9,
        roughness: 0.3,
        metalness: 0.5,
      }),
    []
  );

  // Smaller, dimmer geometry for responses
  const responseGeo = useMemo(
    () => new THREE.OctahedronGeometry(0.04, 0),
    []
  );
  const responseMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000",
        emissive: "#ffffff",
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.35,
        roughness: 0.5,
        metalness: 0.3,
      }),
    []
  );

  // Initialize packets
  useEffect(() => {
    requestPackets.current = Array.from({ length: REQUEST_COUNT }, (_, i) => ({
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.005,
      lane: i % LANES.length,
      isError: Math.random() < 0.06,
      errorTier: Math.floor(Math.random() * 4) + 1, // tiers 1-4
      active: true,
    }));

    responsePackets.current = Array.from({ length: RESPONSE_COUNT }, (_, i) => ({
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.004,
      conduit: i % CONDUIT_XZ.length,
      active: true,
    }));
  }, []);

  useFrame(() => {
    const reqMesh = requestMeshRef.current;
    const resMesh = responseMeshRef.current;
    if (!reqMesh || !resMesh || !active) return;

    const throughput = throughputMultiplier;
    const pos = new THREE.Vector3();
    const hidePos = new THREE.Vector3(0, -200, 0);
    const hideScale = new THREE.Vector3(0.001, 0.001, 0.001);

    // ---- REQUEST PACKETS (descending) ----
    requestPackets.current.forEach((pkt, i) => {
      if (!pkt.active) {
        setInstanceMatrix(reqMesh, i, hidePos, hideScale);
        return;
      }

      pkt.progress += pkt.speed * throughput;

      if (pkt.progress >= 1) {
        pkt.progress = 0;
        pkt.isError = Math.random() < 0.06 / throughput;
        pkt.errorTier = Math.floor(Math.random() * 4) + 1;
        pkt.lane = Math.floor(Math.random() * LANES.length);
      }

      // Map progress to Y position (top → bottom)
      const rawY = TIER_Y[0] + 1.5 - pkt.progress * (TOTAL_HEIGHT + 3.0);

      // Tier-boundary deceleration: packets slow down as they cross each tier
      let y = rawY;
      for (let t = 0; t < TIER_Y.length; t++) {
        const tierCenter = TIER_Y[t];
        const dist = Math.abs(rawY - tierCenter);
        if (dist < 0.3) {
          // Subtle "stick" — packet hovers near the tier briefly
          const stickFactor = 1.0 - (dist / 0.3);
          y += stickFactor * 0.05 * Math.sin(pkt.progress * Math.PI * 20 + i);
          break;
        }
      }

      const x = LANES[pkt.lane];
      const z = Math.sin(pkt.progress * Math.PI * 6 + pkt.lane) * 0.15;

      // Error ejection
      if (pkt.isError) {
        const errorY = TIER_Y[pkt.errorTier];
        if (y <= errorY + 0.5 && y >= errorY - 0.5) {
          // Eject sideways
          const ejectProgress = 1.0 - Math.abs(y - errorY) / 0.5;
          const ejectX = x + ejectProgress * 4.0 * (pkt.lane < 2 ? -1 : 1);
          pos.set(ejectX, y, z);

          if (ejectProgress > 0.9) {
            pkt.active = false;
            setTimeout(() => {
              pkt.active = true;
              pkt.progress = 0;
              pkt.isError = Math.random() < 0.06;
            }, 400);
          }

          setInstanceMatrix(reqMesh, i, pos);
          return;
        }
      }

      pos.set(x, y, z);
      setInstanceMatrix(reqMesh, i, pos);
    });

    // ---- RESPONSE PACKETS (ascending through conduits) ----
    responsePackets.current.forEach((pkt, i) => {
      if (!pkt.active) {
        setInstanceMatrix(resMesh, i, hidePos, hideScale);
        return;
      }

      pkt.progress += pkt.speed * throughput;

      if (pkt.progress >= 1) {
        pkt.progress = 0;
        pkt.conduit = Math.floor(Math.random() * CONDUIT_XZ.length);
      }

      // Map progress to Y position (bottom → top)
      const y = TIER_Y[TIER_Y.length - 1] - 0.5 + pkt.progress * (TOTAL_HEIGHT + 2.0);
      const [cx, cz] = CONDUIT_XZ[pkt.conduit];

      // Subtle spiral around the conduit column
      const spiralRadius = 0.08;
      const spiralAngle = pkt.progress * Math.PI * 8 + pkt.conduit * 1.5;
      const x = cx + Math.cos(spiralAngle) * spiralRadius;
      const z = cz + Math.sin(spiralAngle) * spiralRadius;

      pos.set(x, y, z);
      setInstanceMatrix(resMesh, i, pos);
    });
  });


  return (
    <group>
      {/* Request packets — descending */}
      <instancedMesh
        ref={requestMeshRef}
        args={[requestGeo, requestMat, REQUEST_COUNT]}
        frustumCulled={false}
      />

      {/* Response packets — ascending */}
      <instancedMesh
        ref={responseMeshRef}
        args={[responseGeo, responseMat, RESPONSE_COUNT]}
        frustumCulled={false}
      />
    </group>
  );
}
