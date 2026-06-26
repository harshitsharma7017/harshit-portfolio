"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// --- Tier Configuration ---
const TIERS = [
  { label: "ROUTER", y: 5.0 },
  { label: "MIDDLEWARE", y: 3.8 },
  { label: "CONTROLLER", y: 2.6 },
  { label: "SERVICE", y: 1.4 },
  { label: "MODEL", y: 0.2 },
  { label: "DATABASE", y: -1.0 },
] as const;

const TIER_WIDTH = 4.0;
const TIER_DEPTH = 2.5;
const TIER_HEIGHT = 0.15;
const CONDUIT_RADIUS = 0.025;

// Conduit column positions (4 corners, slightly inset)
const CONDUIT_POSITIONS: [number, number][] = [
  [-TIER_WIDTH * 0.42, -TIER_DEPTH * 0.42],
  [TIER_WIDTH * 0.42, -TIER_DEPTH * 0.42],
  [-TIER_WIDTH * 0.42, TIER_DEPTH * 0.42],
  [TIER_WIDTH * 0.42, TIER_DEPTH * 0.42],
];

// --- LED Configuration ---
const LEDS_PER_TIER = 3;
const LED_RADIUS = 0.04;

interface ServerCoreProps {
  active: boolean;
  throughputMultiplier: number;
}

export function ServerCore({ active, throughputMultiplier }: ServerCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ledRefs = useRef<THREE.Mesh[]>([]);
  const conduitRefs = useRef<THREE.Mesh[]>([]);
  const timeRef = useRef(0);

  // Pre-compute LED positions per tier
  const ledPositions = useMemo(() => {
    return TIERS.map((tier) => {
      const leds: [number, number, number][] = [];
      for (let j = 0; j < LEDS_PER_TIER; j++) {
        const x = -TIER_WIDTH * 0.3 + j * (TIER_WIDTH * 0.3);
        const y = tier.y + TIER_HEIGHT * 0.5 + 0.005;
        const z = TIER_DEPTH * 0.45;
        leds.push([x, y, z]);
      }
      return leds;
    });
  }, []);

  // Conduit geometry
  const conduitHeight = useMemo(() => {
    return TIERS[0].y - TIERS[TIERS.length - 1].y + TIER_HEIGHT;
  }, []);

  const conduitCenterY = useMemo(() => {
    return (TIERS[0].y + TIERS[TIERS.length - 1].y) / 2;
  }, []);

  // Animate LEDs and conduit glow
  useFrame((_, delta) => {
    if (!active) return;
    timeRef.current += delta;
    const t = timeRef.current;

    // Pulse LEDs — each LED has a unique phase
    ledRefs.current.forEach((led, idx) => {
      if (!led) return;
      const mat = led.material as THREE.MeshStandardMaterial;
      const tierIdx = Math.floor(idx / LEDS_PER_TIER);
      const ledIdx = idx % LEDS_PER_TIER;
      const phase = tierIdx * 1.7 + ledIdx * 2.3;
      const rate = 0.8 + throughputMultiplier * 0.6;
      const pulse = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * rate * 3.0 + phase));
      mat.emissiveIntensity = pulse;
      mat.opacity = 0.5 + pulse * 0.5;
    });

    // Breathe conduit emissive — slow heartbeat
    conduitRefs.current.forEach((conduit, idx) => {
      if (!conduit) return;
      const mat = conduit.material as THREE.MeshStandardMaterial;
      const phase = idx * 0.5;
      const breathe = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.6 + phase));
      mat.emissiveIntensity = breathe;
    });
  });

  if (!active) return null;

  // Collect LED refs across all tiers
  let globalLedIdx = 0;

  return (
    <group ref={groupRef}>
      {/* === TIERS === */}
      {TIERS.map((tier, tierIdx) => (
        <group key={tier.label} position={[0, tier.y, 0]}>
          {/* Solid slab — the tier platform */}
          <mesh>
            <boxGeometry args={[TIER_WIDTH, TIER_HEIGHT, TIER_DEPTH]} />
            <meshStandardMaterial
              color="#0c0c0c"
              roughness={0.3}
              metalness={0.8}
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* Wireframe cage overlay */}
          <mesh>
            <boxGeometry args={[TIER_WIDTH + 0.04, TIER_HEIGHT + 0.04, TIER_DEPTH + 0.04]} />
            <meshBasicMaterial
              color="#ffffff"
              wireframe
              transparent
              opacity={0.06}
            />
          </mesh>

          {/* Thin edge accent — top surface border */}
          <mesh position={[0, TIER_HEIGHT * 0.5 + 0.005, 0]}>
            <boxGeometry args={[TIER_WIDTH + 0.02, 0.005, TIER_DEPTH + 0.02]} />
            <meshStandardMaterial
              color="#000000"
              emissive="#ffffff"
              emissiveIntensity={0.15}
              transparent
              opacity={0.3}
            />
          </mesh>

          {/* Status LEDs */}
          {ledPositions[tierIdx].map((pos, ledIdx) => {
            const refIdx = globalLedIdx++;
            return (
              <mesh
                key={`led-${tierIdx}-${ledIdx}`}
                position={pos}
                ref={(el) => {
                  if (el) ledRefs.current[refIdx] = el;
                }}
              >
                <sphereGeometry args={[LED_RADIUS, 8, 8]} />
                <meshStandardMaterial
                  color="#000000"
                  emissive="#ffffff"
                  emissiveIntensity={0.5}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            );
          })}

          {/* Subtle inner panel — recessed surface for depth */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[TIER_WIDTH * 0.85, TIER_HEIGHT * 0.6, TIER_DEPTH * 0.9]} />
            <meshStandardMaterial
              color="#080808"
              roughness={0.5}
              metalness={0.6}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* === VERTICAL CONDUITS === */}
      {CONDUIT_POSITIONS.map(([cx, cz], idx) => (
        <mesh
          key={`conduit-${idx}`}
          position={[cx, conduitCenterY, cz]}
          ref={(el) => {
            if (el) conduitRefs.current[idx] = el;
          }}
        >
          <cylinderGeometry args={[CONDUIT_RADIUS, CONDUIT_RADIUS, conduitHeight, 8]} />
          <meshStandardMaterial
            color="#000000"
            emissive="#ffffff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* === BASE PLATFORM === */}
      <mesh position={[0, TIERS[TIERS.length - 1].y - 0.3, 0]}>
        <boxGeometry args={[TIER_WIDTH + 0.5, 0.05, TIER_DEPTH + 0.5]} />
        <meshStandardMaterial
          color="#050505"
          roughness={0.4}
          metalness={0.9}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Subtle ground reflection plane */}
      <mesh
        position={[0, TIERS[TIERS.length - 1].y - 0.35, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[TIER_WIDTH * 1.5, TIER_DEPTH * 1.5]} />
        <meshStandardMaterial
          color="#080808"
          roughness={0.2}
          metalness={1.0}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}
