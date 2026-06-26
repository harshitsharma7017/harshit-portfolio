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
      const isDormant = hoveredId !== null && !isHighlighted;

      // Pulse emissive parts
      group.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.userData?.isEmissive) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          let targetIntensity = 0.2; // Base autonomous pulse
          
          if (isHovered) targetIntensity = 1.5;
          else if (isHighlighted) targetIntensity = 0.8;
          else if (isDormant) targetIntensity = 0.05;
          else {
            // Autonomous pulse
            targetIntensity = 0.2 + Math.sin(timeRef.current * 2 + node.position[0]) * 0.15;
          }

          mat.emissiveIntensity += (targetIntensity - mat.emissiveIntensity) * 0.1;
        }
      });
    });
  });

  if (!active) return null;

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
                {/* Brutalist base */}
                <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.6, 2.0, 1.6]} />
                  <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
                </mesh>
                {/* Emissive architectural reveal */}
                <mesh position={[0, 2.05, 0]} userData={{ isEmissive: true }}>
                  <boxGeometry args={[1.65, 0.1, 1.65]} />
                  <meshStandardMaterial color="#000000" emissive="#ffffff" />
                </mesh>
                {/* Top block */}
                <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.2, 0.4, 1.2]} />
                  <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
                </mesh>
              </group>
            )}

            {node.type === "shop" && (
              <group>
                {/* Tiered commercial base */}
                <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
                  <boxGeometry args={[2.0, 0.8, 2.0]} />
                  <meshStandardMaterial color="#222222" roughness={0.7} />
                </mesh>
                {/* Emissive storefront band */}
                <mesh position={[0, 0.85, 0]} userData={{ isEmissive: true }}>
                  <boxGeometry args={[1.8, 0.1, 1.8]} />
                  <meshStandardMaterial color="#000000" emissive="#ffffff" />
                </mesh>
                {/* Second tier */}
                <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.6, 0.5, 1.6]} />
                  <meshStandardMaterial color="#222222" roughness={0.7} />
                </mesh>
              </group>
            )}

            {node.type === "service" && (
              <group>
                {/* Sleek tower */}
                <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.0, 3.0, 1.0]} />
                  <meshStandardMaterial color="#151515" roughness={0.5} metalness={0.5} />
                </mesh>
                {/* Vertical emissive slits */}
                <mesh position={[0, 1.5, 0.51]} userData={{ isEmissive: true }}>
                  <boxGeometry args={[0.1, 2.8, 0.05]} />
                  <meshStandardMaterial color="#000000" emissive="#ffffff" />
                </mesh>
                <mesh position={[0, 1.5, -0.51]} userData={{ isEmissive: true }}>
                  <boxGeometry args={[0.1, 2.8, 0.05]} />
                  <meshStandardMaterial color="#000000" emissive="#ffffff" />
                </mesh>
              </group>
            )}

            {/* Drivers and Users are represented as logistics nodes / interaction plinths */}
            {(node.type === "driver" || node.type === "user") && (
              <group>
                <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.4, 0.5, 0.2, 16]} />
                  <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.2, 0]} userData={{ isEmissive: true }}>
                  <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
                  <meshStandardMaterial color="#000000" emissive="#ffffff" />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
