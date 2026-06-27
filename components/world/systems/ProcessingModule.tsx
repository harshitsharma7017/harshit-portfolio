"use client";

import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type ModuleType =
  | "intake"
  | "validation"
  | "statistics"
  | "outlier"
  | "chart"
  | "delivery";

interface ProcessingModuleProps {
  position: [number, number, number];
  scale: [number, number, number]; // width, height, depth of platform
  moduleType: ModuleType;
  active: boolean;
  onRegisterIntakePulse?: (trigger: () => void) => void;
}

export function ProcessingModule({
  position,
  scale,
  moduleType,
  active,
  onRegisterIntakePulse,
}: ProcessingModuleProps) {
  const timeRef = useRef(0);

  // Refs for animated internal geometry
  const statBarsRef = useRef<THREE.Group>(null);
  const outlierRingRef = useRef<THREE.Mesh>(null);
  const outlierState = useRef({ timer: 0, active: false, progress: 0 });
  const chartPanelsRef = useRef<THREE.Group>(null);
  const deliveryRef = useRef<THREE.Group>(null);
  const deliveryState = useRef({ timer: 0, phase: 0 }); // phase: 0=build, 1=bright, 2=exit
  const intakePulseRef = useRef<THREE.Mesh>(null);
  const intakePulseState = useRef({ active: false, progress: 0 });
  const ledRefs = useRef<THREE.Mesh[]>([]);

  // Register intake pulse trigger
  const triggerIntakePulse = useCallback(() => {
    intakePulseState.current.active = true;
    intakePulseState.current.progress = 0;
  }, []);

  useEffect(() => {
    if (moduleType === "intake" && onRegisterIntakePulse) {
      onRegisterIntakePulse(triggerIntakePulse);
    }
  }, [moduleType, onRegisterIntakePulse, triggerIntakePulse]);

  useFrame((_, delta) => {
    if (!active) return;
    timeRef.current += delta;
    const t = timeRef.current;

    // LED pulse
    ledRefs.current.forEach((led, idx) => {
      if (!led) return;
      const mat = led.material as THREE.MeshStandardMaterial;
      const pulse = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 1.5 + idx * 2.1));
      mat.emissiveIntensity = pulse;
    });

    // --- Module-specific animations ---

    // STATISTICS: oscillating bars
    if (moduleType === "statistics" && statBarsRef.current) {
      statBarsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const baseHeight = 0.3 + (i % 3) * 0.2;
        const targetH = baseHeight + Math.sin(t * 0.8 + i * 1.3) * 0.15;
        mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, Math.max(0.05, targetH), 0.06);
        mesh.position.y = (mesh.scale.y * 1.0) / 2 + scale[1] * 0.5;
      });
    }

    // OUTLIER: periodic ring flash
    if (moduleType === "outlier" && outlierRingRef.current) {
      const os = outlierState.current;
      const mat = outlierRingRef.current.material as THREE.MeshStandardMaterial;

      if (!os.active) {
        os.timer += delta;
        if (os.timer > 2.0 + Math.random() * 2.0) {
          os.active = true;
          os.progress = 0;
          os.timer = 0;
        }
        mat.opacity = 0;
      } else {
        os.progress += delta * 3.5; // ~0.3s
        const s = 1.0 + os.progress * 0.6;
        outlierRingRef.current.scale.set(s, s, s);
        mat.opacity = Math.max(0, 0.8 * (1.0 - os.progress));
        mat.emissiveIntensity = Math.max(0, 1.5 * (1.0 - os.progress));
        if (os.progress >= 1.0) {
          os.active = false;
          mat.opacity = 0;
          outlierRingRef.current.scale.set(1, 1, 1);
        }
      }
    }

    // CHART: progressive panel opacity cycle
    if (moduleType === "chart" && chartPanelsRef.current) {
      const cycleTime = 4.0; // full cycle in seconds
      const phase = (t % cycleTime) / cycleTime;
      chartPanelsRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        const panelPhase = i / 3;
        const reveal = Math.max(0, Math.min(1, (phase - panelPhase * 0.25) * 3));
        mat.opacity = 0.05 + reveal * 0.5;
        mat.emissiveIntensity = reveal * 0.3;
      });
    }

    // DELIVERY: brighten → hold → glide down → fade → reset
    if (moduleType === "delivery" && deliveryRef.current) {
      const ds = deliveryState.current;
      ds.timer += delta;

      const stack = deliveryRef.current.children[0] as THREE.Mesh | undefined;
      if (stack) {
        const mat = stack.material as THREE.MeshStandardMaterial;
        if (ds.phase === 0) {
          // Build: fade in over 1s
          const buildProgress = Math.min(1, ds.timer / 1.0);
          mat.opacity = buildProgress * 0.7;
          mat.emissiveIntensity = buildProgress * 0.5;
          stack.position.y = scale[1] * 0.5 + 0.15;
          if (ds.timer >= 1.0) { ds.phase = 1; ds.timer = 0; }
        } else if (ds.phase === 1) {
          // Bright hold: peak white for 0.5s
          mat.opacity = 0.95;
          mat.emissiveIntensity = 2.0;
          if (ds.timer >= 0.5) { ds.phase = 2; ds.timer = 0; }
        } else {
          // Exit: glide down and fade over 1s
          const exitProgress = Math.min(1, ds.timer / 1.0);
          stack.position.y = scale[1] * 0.5 + 0.15 - exitProgress * 2.0;
          mat.opacity = Math.max(0, 0.95 * (1 - exitProgress));
          mat.emissiveIntensity = Math.max(0, 2.0 * (1 - exitProgress));
          if (ds.timer >= 1.0) { ds.phase = 0; ds.timer = 0; }
        }
      }
    }

    // INTAKE: surface pulse on data arrival
    if (moduleType === "intake" && intakePulseRef.current) {
      const ip = intakePulseState.current;
      const mat = intakePulseRef.current.material as THREE.MeshStandardMaterial;
      if (ip.active) {
        ip.progress += delta * 4.0;
        const s = 1.0 + ip.progress * 0.5;
        intakePulseRef.current.scale.set(s, 1, s);
        mat.opacity = Math.max(0, 0.4 * (1 - ip.progress));
        mat.emissiveIntensity = Math.max(0, 1.0 * (1 - ip.progress));
        if (ip.progress >= 1.0) {
          ip.active = false;
          mat.opacity = 0;
          intakePulseRef.current.scale.set(1, 1, 1);
        }
      } else {
        mat.opacity = 0;
      }
    }
  });


  return (
    <group position={position}>
      {/* Platform base */}
      <mesh>
        <boxGeometry args={scale} />
        <meshStandardMaterial
          color="#080808"
          roughness={0.85}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Wireframe cage */}
      <mesh>
        <boxGeometry args={[scale[0] + 0.03, scale[1] + 0.03, scale[2] + 0.03]} />
        <meshStandardMaterial color="#111111" wireframe roughness={0.3} metalness={0.9} transparent opacity={0.12} />
      </mesh>

      {/* Top edge accent */}
      <mesh position={[0, scale[1] * 0.5 + 0.003, 0]}>
        <boxGeometry args={[scale[0] + 0.01, 0.004, scale[2] + 0.01]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.2}
          transparent
          opacity={0.25}
          toneMapped={false}
        />
      </mesh>

      {/* Status LEDs */}
      {[0.3, -0.3].map((xOff, idx) => (
        <mesh
          key={`led-${idx}`}
          position={[xOff * scale[0], scale[1] * 0.5 + 0.02, scale[2] * 0.45]}
          ref={(el) => { if (el) ledRefs.current[idx] = el; }}
        >
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1.5}
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* === MODULE-SPECIFIC INTERNALS === */}

      {/* INTAKE: receiving grid lines */}
      {moduleType === "intake" && (
        <group>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`grid-h-${i}`} position={[0, scale[1] * 0.5 + 0.008, (i - 2) * (scale[2] * 0.2)]}>
              <boxGeometry args={[scale[0] * 0.85, 0.003, 0.008]} />
              <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.9} transparent opacity={0.5} />
            </mesh>
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`grid-v-${i}`} position={[(i - 2) * (scale[0] * 0.2), scale[1] * 0.5 + 0.008, 0]}>
              <boxGeometry args={[0.008, 0.003, scale[2] * 0.85]} />
              <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.9} transparent opacity={0.5} />
            </mesh>
          ))}
          {/* Pulse ring on data arrival */}
          <mesh
            ref={intakePulseRef}
            position={[0, scale[1] * 0.5 + 0.01, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[scale[0] * 0.15, scale[0] * 0.2, 32]} />
            <meshStandardMaterial
              color="#ffffff" emissive="#ffffff" emissiveIntensity={0}
              transparent opacity={0} side={THREE.DoubleSide} toneMapped={false}
            />
          </mesh>
        </group>
      )}

      {/* VALIDATION: filter gate — two parallel walls */}
      {moduleType === "validation" && (
        <group>
          <mesh position={[0, scale[1] * 0.5 + 0.25, scale[2] * 0.2]}>
            <boxGeometry args={[scale[0] * 0.8, 0.5, 0.03]} />
            <meshStandardMaterial color="#080808" roughness={0.8} metalness={0.25} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, scale[1] * 0.5 + 0.25, -scale[2] * 0.2]}>
            <boxGeometry args={[scale[0] * 0.8, 0.5, 0.03]} />
            <meshStandardMaterial color="#080808" roughness={0.8} metalness={0.25} transparent opacity={0.8} />
          </mesh>
          {/* Gate wireframe accent */}
          <mesh position={[0, scale[1] * 0.5 + 0.5, 0]}>
            <boxGeometry args={[scale[0] * 0.82, 0.01, scale[2] * 0.4 + 0.06]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} transparent opacity={0.2} toneMapped={false} />
          </mesh>
        </group>
      )}

      {/* STATISTICS: oscillating vertical bars */}
      {moduleType === "statistics" && (
        <group ref={statBarsRef}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={`bar-${i}`}
              position={[(i - 3.5) * (scale[0] * 0.1), scale[1] * 0.5, 0]}
              scale={[1, 0.1, 1]}
            >
              <boxGeometry args={[scale[0] * 0.06, 1.0, scale[2] * 0.5]} />
              <meshStandardMaterial
                color="#111111" roughness={0.5} metalness={0.7}
                transparent opacity={0.9}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* OUTLIER: detection ring */}
      {moduleType === "outlier" && (
        <mesh
          ref={outlierRingRef}
          position={[0, scale[1] * 0.5 + 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[scale[0] * 0.25, scale[0] * 0.32, 48]} />
          <meshStandardMaterial
            color="#ffffff" emissive="#ffffff" emissiveIntensity={0}
            transparent opacity={0} side={THREE.DoubleSide} toneMapped={false}
          />
        </mesh>
      )}

      {/* CHART: flat panel surfaces that render progressively */}
      {moduleType === "chart" && (
        <group ref={chartPanelsRef}>
          {[0, 1, 2].map((i) => (
            <mesh
              key={`panel-${i}`}
              position={[(i - 1) * scale[0] * 0.28, scale[1] * 0.5 + 0.15 + i * 0.04, 0]}
            >
              <boxGeometry args={[scale[0] * 0.22, 0.35, scale[2] * 0.6]} />
              <meshPhysicalMaterial
                color="#000000" metalness={0.9} roughness={0.1}
                transmission={0.9} clearcoat={1.0} clearcoatRoughness={0.05}
                transparent opacity={0.5}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* DELIVERY: report stack */}
      {moduleType === "delivery" && (
        <group ref={deliveryRef}>
          <mesh position={[0, scale[1] * 0.5 + 0.15, 0]}>
            <boxGeometry args={[scale[0] * 0.6, 0.25, scale[2] * 0.7]} />
            <meshStandardMaterial
              color="#ffffff" emissive="#ffffff"
              emissiveIntensity={0} toneMapped={false}
              transparent opacity={0}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
