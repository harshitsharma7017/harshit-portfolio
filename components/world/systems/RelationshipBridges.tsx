"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export interface BridgeEdge {
  key: string;
  from: [number, number, number];
  to: [number, number, number];
  frequency: number; // pulses per second (e.g., 0.5 = one pulse every 2s)
}

interface RelationshipBridgesProps {
  edges: BridgeEdge[];
  active: boolean;
}

// Pulse state per bridge
interface BridgePulse {
  progress: number; // 0→1 along the bridge
  speed: number;
}

interface BridgeState {
  pulses: BridgePulse[];
  timeSinceSpawn: number;
}

export function RelationshipBridges({ edges, active }: RelationshipBridgesProps) {
  const bridgeStates = useRef<Map<string, BridgeState>>(new Map());
  const pulseMeshRefs = useRef<Map<string, THREE.Mesh[]>>(new Map());
  const tubeMeshRefs = useRef<Map<string, THREE.Mesh>>(new Map());
  const timeRef = useRef(0);

  // Initialize bridge states
  useMemo(() => {
    edges.forEach((edge) => {
      if (!bridgeStates.current.has(edge.key)) {
        bridgeStates.current.set(edge.key, {
          pulses: [],
          timeSinceSpawn: Math.random() * 2, // stagger initial spawns
        });
      }
    });
  }, [edges]);

  // Pre-compute tube geometry orientations
  const tubeData = useMemo(() => {
    return edges.map((edge) => {
      const from = new THREE.Vector3(...edge.from);
      const to = new THREE.Vector3(...edge.to);
      const mid = from.clone().add(to).multiplyScalar(0.5);
      const dir = to.clone().sub(from);
      const length = dir.length();
      dir.normalize();

      // Quaternion to rotate cylinder (Y-axis aligned) to bridge direction
      const quat = new THREE.Quaternion();
      quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

      return { from, to, mid, length, quat, dir };
    });
  }, [edges]);

  // Max concurrent pulses per bridge
  const MAX_PULSES = 3;

  useFrame((_, delta) => {
    if (!active) return;
    timeRef.current += delta;

    edges.forEach((edge, edgeIdx) => {
      const state = bridgeStates.current.get(edge.key);
      if (!state) return;

      const td = tubeData[edgeIdx];

      // Spawn new pulses based on frequency
      state.timeSinceSpawn += delta;
      const interval = 1.0 / Math.max(0.1, edge.frequency);
      if (state.timeSinceSpawn >= interval && state.pulses.length < MAX_PULSES) {
        state.pulses.push({
          progress: 0,
          speed: 0.3 + Math.random() * 0.2,
        });
        state.timeSinceSpawn = 0;
      }

      // Update pulse positions
      const pulseMeshes = pulseMeshRefs.current.get(edge.key);
      state.pulses.forEach((pulse, pIdx) => {
        pulse.progress += pulse.speed * delta;
      });

      // Remove completed pulses
      state.pulses = state.pulses.filter((p) => p.progress < 1.0);

      // Update pulse mesh positions and visibility
      if (pulseMeshes) {
        for (let p = 0; p < MAX_PULSES; p++) {
          const mesh = pulseMeshes[p];
          if (!mesh) continue;

          if (p < state.pulses.length) {
            const pulse = state.pulses[p];
            // Interpolate position along bridge
            const pos = td.from
              .clone()
              .lerp(td.to, pulse.progress);
            mesh.position.copy(pos);

            // Brightness: bright at endpoints, slightly dimmer at midpoint
            const distFromCenter = Math.abs(pulse.progress - 0.5) * 2; // 1 at ends, 0 at mid
            const brightness = 0.5 + distFromCenter * 0.5;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.emissiveIntensity = brightness;
            mat.opacity = 0.6 + brightness * 0.4;
            mesh.visible = true;
          } else {
            mesh.visible = false;
          }
        }
      }

      // Subtle tube brightness based on activity
      const tubeMesh = tubeMeshRefs.current.get(edge.key);
      if (tubeMesh) {
        const mat = tubeMesh.material as THREE.MeshStandardMaterial;
        const hasActivePulse = state.pulses.length > 0;
        const targetIntensity = hasActivePulse ? 0.25 : 0.08;
        mat.emissiveIntensity += (targetIntensity - mat.emissiveIntensity) * 0.05;
      }
    });
  });

  if (!active) return null;

  return (
    <group>
      {edges.map((edge, edgeIdx) => {
        const td = tubeData[edgeIdx];
        return (
          <group key={edge.key}>
            {/* Bridge tube */}
            <mesh
              position={[td.mid.x, td.mid.y, td.mid.z]}
              quaternion={td.quat}
              ref={(el) => {
                if (el) tubeMeshRefs.current.set(edge.key, el);
              }}
            >
              <cylinderGeometry
                args={[0.015, 0.015, td.length, 6, 1]}
              />
              <meshStandardMaterial
                color="#000000"
                emissive="#ffffff"
                emissiveIntensity={0.08}
                transparent
                opacity={0.2}
                roughness={0.5}
                metalness={0.3}
              />
            </mesh>

            {/* Pulse spheres (pre-allocated, toggled via visibility) */}
            {Array.from({ length: MAX_PULSES }).map((_, pIdx) => (
              <mesh
                key={`pulse-${edge.key}-${pIdx}`}
                visible={false}
                ref={(el) => {
                  if (el) {
                    if (!pulseMeshRefs.current.has(edge.key)) {
                      pulseMeshRefs.current.set(edge.key, []);
                    }
                    const arr = pulseMeshRefs.current.get(edge.key)!;
                    arr[pIdx] = el;
                  }
                }}
              >
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshStandardMaterial
                  color="#000000"
                  emissive="#ffffff"
                  emissiveIntensity={0.7}
                  transparent
                  opacity={0.8}
                  roughness={0.3}
                  metalness={0.5}
                />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}
