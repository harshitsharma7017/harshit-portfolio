"use client";

import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface CollectionClusterProps {
  id: string;
  position: [number, number, number];
  radius: number;
  activityLevel: number; // 0–1, controls LED pulse rate and status point density
  onRegisterTrigger?: (id: string, trigger: () => void) => void;
  variant?: "default" | "bright";
}

// Distribute points on a sphere surface using golden spiral
function fibonacciSphere(count: number, radius: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push([
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius,
    ]);
  }
  return points;
}

export function CollectionCluster({
  id,
  position,
  radius,
  activityLevel,
  onRegisterTrigger,
  variant = "default",
}: CollectionClusterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ledRefs = useRef<THREE.Mesh[]>([]);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringState = useRef({ active: false, progress: 0 });
  const timeRef = useRef(0);

  // LED positions on shell surface
  const ledCount = Math.max(3, Math.round(3 + activityLevel * 5));
  const ledPositions = useMemo(
    () => fibonacciSphere(ledCount, radius * 1.01),
    [ledCount, radius]
  );

  // Index ring trigger
  const triggerIndexRing = useCallback(() => {
    ringState.current.active = true;
    ringState.current.progress = 0;
  }, []);

  // Register trigger with parent
  useEffect(() => {
    if (onRegisterTrigger) {
      onRegisterTrigger(id, triggerIndexRing);
    }
  }, [id, triggerIndexRing, onRegisterTrigger]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    // Inner core heartbeat — barely perceptible Y oscillation
    if (innerRef.current) {
      innerRef.current.position.y =
        Math.sin(t * 0.3 + radius) * 0.03;
    }

    // LED pulsing — each LED has unique phase, rate scales with activity
    ledRefs.current.forEach((led, idx) => {
      if (!led) return;
      const mat = led.material as THREE.MeshStandardMaterial;
      const phase = idx * 2.7 + radius * 3.1;
      const rate = 0.5 + activityLevel * 2.0;
      const pulse = 0.15 + 0.85 * Math.max(0, Math.sin(t * rate + phase));
      mat.emissiveIntensity = pulse;
      mat.opacity = 0.3 + pulse * 0.7;
    });

    // Index ring animation
    if (ringRef.current) {
      const ring = ringState.current;
      const mat = ringRef.current.material as THREE.MeshStandardMaterial;

      if (ring.active) {
        ring.progress += delta * 2.5; // ~0.4s full cycle

        const scale = 1.0 + ring.progress * 0.8;
        ringRef.current.scale.set(scale, scale, scale);
        mat.opacity = Math.max(0, 0.6 * (1.0 - ring.progress));
        mat.emissiveIntensity = Math.max(0, 1.0 * (1.0 - ring.progress));

        if (ring.progress >= 1.0) {
          ring.active = false;
          ring.progress = 0;
          mat.opacity = 0;
          ringRef.current.scale.set(1, 1, 1);
        }
      } else {
        mat.opacity = 0;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer shell — faceted icosahedron */}
      <mesh>
        <icosahedronGeometry args={[radius, 1]} />
        {variant === "bright" ? (
          <meshStandardMaterial
            color="#888888"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        ) : (
          <meshStandardMaterial
            color="#111111"
            roughness={0.5}
            metalness={0.7}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>

      {/* Wireframe overlay — faceted edge lines */}
      <mesh>
        <icosahedronGeometry args={[radius * 1.002, 1]} />
        <meshStandardMaterial
          color="#222222"
          wireframe
          roughness={0.3}
          metalness={0.9}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Inner core — denser, packed documents */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[radius * 0.55, 1]} />
        {variant === "bright" ? (
          <meshStandardMaterial
            color="#222222"
            emissive="#ffffff"
            emissiveIntensity={0.2}
            roughness={0.8}
            metalness={0.5}
            transparent
            opacity={0.9}
          />
        ) : (
          <meshStandardMaterial
            color="#080808"
            roughness={0.95}
            metalness={0.15}
            transparent
            opacity={0.85}
          />
        )}
      </mesh>

      {/* Inner core wireframe — document structure hint */}
      <mesh ref={innerRef ? undefined : undefined}>
        <icosahedronGeometry args={[radius * 0.56, 2]} />
        {variant === "bright" ? (
          <meshStandardMaterial
            color="#ffffff"
            wireframe
            roughness={0.3}
            metalness={0.9}
            transparent
            opacity={0.15}
          />
        ) : (
          <meshStandardMaterial
            color="#222222"
            wireframe
            roughness={0.3}
            metalness={0.9}
            transparent
            opacity={0.06}
          />
        )}
      </mesh>

      {/* Status LEDs — write/read operations */}
      {ledPositions.map((pos, idx) => (
        <mesh
          key={`led-${id}-${idx}`}
          position={pos}
          ref={(el) => {
            if (el) ledRefs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[radius * 0.025, 6, 6]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1.4}
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Index ring — equatorial, triggered by query arrival */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[radius * 0.9, radius * 1.1, 48]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
