"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { CITY_NODES } from "@/data/cityNodes";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";

interface CityArchitectureProps {
  active: boolean;
}

export function CityArchitecture({ active }: CityArchitectureProps) {
  const { state, setHoverNode } = useExperienceContext();
  const timeRef = useRef(0);
  const buildingRefs = useRef<Record<string, THREE.Group | null>>({});

  useFrame((_, delta) => {
    if (!active) return;
    timeRef.current += delta;
    
    // Animate building pulse if hovered or highlighted
    const hoveredId = state.hoverNodeId;
    const highlighted = new Set<string>();
    if (hoveredId) {
      highlighted.add(hoveredId);
      const node = CITY_NODES.find((n) => n.id === hoveredId);
      node?.connections.forEach((id) => highlighted.add(id));
      
      // Also highlight incoming connections
      CITY_NODES.forEach((n) => {
        if (n.connections.includes(hoveredId)) {
          highlighted.add(n.id);
        }
      });
    }

    CITY_NODES.forEach((node) => {
      const group = buildingRefs.current[node.id];
      if (!group) return;

      const isHovered = hoveredId === node.id;
      const isHighlighted = highlighted.has(node.id);
      
      // Ecosystem Activity State System:
      // Nodes breathe and cascade activity across the city based on their spatial position
      const spatialPhase = (node.position[0] + node.position[2]) * 0.4;
      const isActiveCycle = Math.sin(timeRef.current * 1.5 + spatialPhase) > 0.6; // High threshold = short active bursts

      // Scale pulse on the Y axis during active cycle
      const targetScaleY = isActiveCycle && !hoveredId ? 1.05 : 1.0;
      group.scale.y += (targetScaleY - group.scale.y) * 0.1;

      // Pulse emissive parts
      group.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.userData?.isEmissive) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          
          let targetIntensity = 0.05; // Default dormant
          
          if (isHovered) {
            targetIntensity = 2.0;
          } else if (isHighlighted) {
            targetIntensity = 1.0;
          } else if (!hoveredId && isActiveCycle) {
            // Breathing ecosystem pulse
            targetIntensity = 0.8 + Math.random() * 0.4; 
          }

          mat.emissiveIntensity += (targetIntensity - mat.emissiveIntensity) * 0.1;
        }

        // Animate floating architectural elements (like rings)
        if (mesh.userData?.isFloatingRing) {
          mesh.rotation.y += delta * 0.5;
          mesh.position.y += Math.sin(timeRef.current * 2 + spatialPhase) * 0.002;
        }
      });
    });
  });


  return (
    <group>
      {CITY_NODES.map((node) => {
        // Build architectural geometry based on type
        return (
          <group
            key={node.id}
            position={node.position as [number, number, number]}
            ref={(el) => { buildingRefs.current[node.id] = el; }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoverNode(node.id);
            }}
            onPointerOut={() => setHoverNode(null)}
          >
            {node.type === "hospital" && (
              <group>
                {/* Brutalist base (Preserved) */}
                <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.6, 2.0, 1.6]} />
                  <meshStandardMaterial color="#080808" roughness={0.92} metalness={0.15} />
                </mesh>
                {/* Emissive architectural reveal (Preserved) */}
                <mesh position={[0, 2.05, 0]} userData={{ isEmissive: true }}>
                  <boxGeometry args={[1.65, 0.1, 1.65]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} toneMapped={false} />
                </mesh>
                {/* Top block (Preserved) */}
                <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.2, 0.4, 1.2]} />
                  <meshStandardMaterial color="#080808" roughness={0.92} metalness={0.15} />
                </mesh>
                
                {/* EVOLUTION: Hospital Helipad / Drone Port */}
                <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.5, 0.2, 0.2, 32]} />
                  <meshStandardMaterial color="#0a0a0a" roughness={0.8} metalness={0.4} />
                </mesh>
                <mesh position={[0, 2.75, 0]} userData={{ isEmissive: true }}>
                  <ringGeometry args={[0.3, 0.4, 32]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} side={THREE.DoubleSide} toneMapped={false} />
                </mesh>
                <mesh position={[0.7, 1.5, 0.9]} castShadow>
                  <boxGeometry args={[0.2, 0.6, 0.2]} />
                  <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.8} />
                </mesh>
              </group>
            )}

            {node.type === "shop" && (
              <group>
                {/* Tiered commercial base (Preserved) */}
                <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
                  <boxGeometry args={[2.0, 0.8, 2.0]} />
                  <meshStandardMaterial color="#0a0a0a" roughness={0.88} metalness={0.2} />
                </mesh>
                {/* Emissive storefront band (Preserved) */}
                <mesh position={[0, 0.85, 0]} userData={{ isEmissive: true }}>
                  <boxGeometry args={[1.8, 0.1, 1.8]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} toneMapped={false} />
                </mesh>
                {/* Second tier (Preserved) */}
                <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.6, 0.5, 1.6]} />
                  <meshStandardMaterial color="#0a0a0a" roughness={0.88} metalness={0.2} />
                </mesh>
                
                {/* EVOLUTION: Elevated commercial displays & walkways */}
                <mesh position={[0, 1.45, 0]} userData={{ isEmissive: true }}>
                  <boxGeometry args={[1.4, 0.1, 1.4]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.0} toneMapped={false} />
                </mesh>
                <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.2, 0.4, 1.2]} />
                  <meshStandardMaterial color="#0a0a0a" roughness={0.88} metalness={0.2} />
                </mesh>
                {/* Holographic sign rail */}
                <mesh position={[1.0, 1.0, 0]} userData={{ isEmissive: true }}>
                  <boxGeometry args={[0.05, 1.2, 0.6]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} transparent opacity={0.6} toneMapped={false} />
                </mesh>
              </group>
            )}

            {node.type === "service" && (
              <group>
                {/* Sleek tower (Preserved) */}
                <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.0, 3.0, 1.0]} />
                  <meshStandardMaterial color="#111111" roughness={0.35} metalness={0.88} />
                </mesh>
                {/* Vertical emissive slits (Preserved) */}
                <mesh position={[0, 1.5, 0.51]} userData={{ isEmissive: true }}>
                  <boxGeometry args={[0.1, 2.8, 0.05]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} toneMapped={false} />
                </mesh>
                <mesh position={[0, 1.5, -0.51]} userData={{ isEmissive: true }}>
                  <boxGeometry args={[0.1, 2.8, 0.05]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} toneMapped={false} />
                </mesh>

                {/* EVOLUTION: Communications Hub & Floating Satellite Rings */}
                <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.1, 0.3, 0.4, 8]} />
                  <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.8} />
                </mesh>
                <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
                  <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.8} />
                </mesh>
                {/* Orbiting data ring */}
                <mesh position={[0, 2.5, 0]} rotation={[0.2, 0, 0.2]} userData={{ isFloatingRing: true }}>
                  <torusGeometry args={[0.8, 0.02, 16, 64]} />
                  <meshStandardMaterial color="#111111" roughness={0.2} metalness={1.0} />
                </mesh>
                <mesh position={[0, 2.5, 0]} rotation={[0.2, 0, 0.2]} userData={{ isFloatingRing: true, isEmissive: true }}>
                  <torusGeometry args={[0.8, 0.01, 16, 64]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.0} toneMapped={false} />
                </mesh>
              </group>
            )}

            {/* Drivers and Users are represented as logistics nodes / interaction plinths */}
            {(node.type === "driver" || node.type === "user") && (
              <group>
                {/* Base plinth (Preserved) */}
                <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.4, 0.5, 0.2, 16]} />
                  <meshStandardMaterial color="#111111" roughness={0.5} metalness={0.75} />
                </mesh>
                <mesh position={[0, 0.2, 0]} userData={{ isEmissive: true }}>
                  <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} toneMapped={false} />
                </mesh>

                {/* EVOLUTION: Suspended transit rails & node antennas */}
                <mesh position={[0, 0.4, 0]} castShadow>
                  <boxGeometry args={[0.1, 0.4, 0.1]} />
                  <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.9} />
                </mesh>
                <mesh position={[0, 0.6, 0]} userData={{ isEmissive: true }}>
                  <sphereGeometry args={[0.08, 16, 16]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} toneMapped={false} />
                </mesh>
                <mesh position={[0, 0.2, 0.5]} castShadow>
                  <boxGeometry args={[0.05, 0.05, 1.0]} />
                  <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.9} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
