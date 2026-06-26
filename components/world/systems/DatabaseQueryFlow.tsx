"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { setInstanceMatrix } from "@/lib/three/instancing";

// --- Types ---
export interface CollectionTarget {
  id: string;
  position: [number, number, number];
  radius: number;
  connections: string[]; // IDs of connected collections
}

interface QueryPacket {
  // 'descend' = arriving from backend, 'fanout' = traveling between collections, 'response' = ascending back
  type: "descend" | "fanout" | "response";
  progress: number; // 0→1
  speed: number;
  active: boolean;
  targetId: string;
  // For descend: start position high above
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
}

interface DatabaseQueryFlowProps {
  collections: CollectionTarget[];
  active: boolean;
  indexRingTriggers: React.RefObject<Map<string, () => void>>;
}

const INBOUND_COUNT = 300;
const FANOUT_COUNT = 150;
const RESPONSE_COUNT = 150;
const TOTAL = INBOUND_COUNT + FANOUT_COUNT + RESPONSE_COUNT;

export function DatabaseQueryFlow({
  collections,
  active,
  indexRingTriggers,
}: DatabaseQueryFlowProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const packets = useRef<QueryPacket[]>([]);
  const spawnTimer = useRef(0);

  const geometry = useMemo(() => new THREE.OctahedronGeometry(0.05, 0), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000",
        emissive: "#ffffff",
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.85,
        roughness: 0.3,
        metalness: 0.5,
      }),
    []
  );

  // Weighted target selection — higher activity collections receive more queries
  const collectionWeights = useMemo(() => {
    // Use radius as proxy for importance/traffic
    const total = collections.reduce((s, c) => s + c.radius, 0);
    return collections.map((c) => c.radius / total);
  }, [collections]);

  function pickRandomCollection(): CollectionTarget {
    const r = Math.random();
    let cumulative = 0;
    for (let i = 0; i < collections.length; i++) {
      cumulative += collectionWeights[i];
      if (r <= cumulative) return collections[i];
    }
    return collections[collections.length - 1];
  }

  function createDescendPacket(): QueryPacket {
    const target = pickRandomCollection();
    const tp = new THREE.Vector3(...target.position);
    const spread = 8;
    return {
      type: "descend",
      progress: 0,
      speed: 0.15 + Math.random() * 0.15,
      active: true,
      targetId: target.id,
      startPos: new THREE.Vector3(
        tp.x + (Math.random() - 0.5) * spread,
        12 + Math.random() * 4,
        tp.z + (Math.random() - 0.5) * spread * 0.5
      ),
      endPos: tp,
    };
  }

  function createFanoutPacket(fromId: string): QueryPacket | null {
    const from = collections.find((c) => c.id === fromId);
    if (!from || from.connections.length === 0) return null;
    const targetId =
      from.connections[Math.floor(Math.random() * from.connections.length)];
    const target = collections.find((c) => c.id === targetId);
    if (!target) return null;

    return {
      type: "fanout",
      progress: 0,
      speed: 0.25 + Math.random() * 0.15,
      active: true,
      targetId: target.id,
      startPos: new THREE.Vector3(...from.position),
      endPos: new THREE.Vector3(...target.position),
    };
  }

  function createResponsePacket(): QueryPacket {
    const source = pickRandomCollection();
    const sp = new THREE.Vector3(...source.position);
    return {
      type: "response",
      progress: 0,
      speed: 0.1 + Math.random() * 0.1,
      active: true,
      targetId: source.id,
      startPos: sp,
      endPos: new THREE.Vector3(
        sp.x + (Math.random() - 0.5) * 6,
        14 + Math.random() * 3,
        sp.z + (Math.random() - 0.5) * 3
      ),
    };
  }

  // Initialize packet pool
  useEffect(() => {
    const pool: QueryPacket[] = [];
    for (let i = 0; i < INBOUND_COUNT; i++) {
      const p = createDescendPacket();
      p.progress = Math.random(); // stagger initial positions
      pool.push(p);
    }
    for (let i = 0; i < FANOUT_COUNT; i++) {
      pool.push({
        type: "fanout",
        progress: 0,
        speed: 0.25,
        active: false, // start inactive, activated by arrivals
        targetId: "",
        startPos: new THREE.Vector3(0, -200, 0),
        endPos: new THREE.Vector3(0, -200, 0),
      });
    }
    for (let i = 0; i < RESPONSE_COUNT; i++) {
      const p = createResponsePacket();
      p.progress = Math.random();
      pool.push(p);
    }
    packets.current = pool;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh || !active) return;

    const pos = new THREE.Vector3();
    const hidePos = new THREE.Vector3(0, -200, 0);
    const hideScale = new THREE.Vector3(0.001, 0.001, 0.001);
    const triggers = indexRingTriggers.current;

    // Spawn timer for staggered fanout activation
    spawnTimer.current += delta;

    // Find inactive fanout slots
    const inactiveFanouts: number[] = [];
    packets.current.forEach((p, i) => {
      if (p.type === "fanout" && !p.active) {
        inactiveFanouts.push(i);
      }
    });

    packets.current.forEach((pkt, i) => {
      if (!pkt.active) {
        setInstanceMatrix(mesh, i, hidePos, hideScale);
        return;
      }

      pkt.progress += pkt.speed * delta;

      if (pkt.progress >= 1.0) {
        // Packet arrived at destination
        if (pkt.type === "descend") {
          // Trigger index ring on the target collection
          if (triggers) {
            const trigger = triggers.get(pkt.targetId);
            if (trigger) trigger();
          }

          // Spawn fan-out packets (1–3)
          const fanoutCount = 1 + Math.floor(Math.random() * 2);
          for (let f = 0; f < fanoutCount; f++) {
            if (inactiveFanouts.length === 0) break;
            const slotIdx = inactiveFanouts.pop()!;
            const fanout = createFanoutPacket(pkt.targetId);
            if (fanout) {
              packets.current[slotIdx] = fanout;
            }
          }

          // Recycle as new descend packet
          const newPkt = createDescendPacket();
          Object.assign(pkt, newPkt);
        } else if (pkt.type === "fanout") {
          // Trigger index ring on arrival
          if (triggers) {
            const trigger = triggers.get(pkt.targetId);
            if (trigger) trigger();
          }
          // Deactivate — will be reused by future arrivals
          pkt.active = false;
        } else if (pkt.type === "response") {
          // Recycle
          const newPkt = createResponsePacket();
          Object.assign(pkt, newPkt);
        }

        setInstanceMatrix(mesh, i, hidePos, hideScale);
        return;
      }

      // Interpolate position
      pos.lerpVectors(pkt.startPos, pkt.endPos, pkt.progress);

      // Add subtle arc for descend/response packets
      if (pkt.type === "descend" || pkt.type === "response") {
        const arc = Math.sin(pkt.progress * Math.PI) * 0.8;
        pos.x += arc * 0.3 * Math.sin(i * 1.7);
      }

      // Fanout packets get a slight curve
      if (pkt.type === "fanout") {
        const arc = Math.sin(pkt.progress * Math.PI) * 0.4;
        pos.y += arc;
      }

      // Scale: response packets are smaller
      if (pkt.type === "response") {
        const s = 0.6;
        setInstanceMatrix(mesh, i, pos, new THREE.Vector3(s, s, s));
      } else {
        setInstanceMatrix(mesh, i, pos);
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
