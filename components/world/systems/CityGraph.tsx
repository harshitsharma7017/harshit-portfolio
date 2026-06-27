"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { CITY_NODES } from "@/data/cityNodes";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";

interface CityGraphProps {
  offset: [number, number, number];
  active: boolean;
}

const TYPE_HEIGHT: Record<string, number> = {
  shop: 1.2,
  hospital: 2.0,
  driver: 0.6,
  user: 0.8,
  service: 1.5,
};

export function CityGraph({ offset, active }: CityGraphProps) {
  const { state, setHoverNode } = useExperienceContext();
  const routesRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  const nodes = useMemo(
    () =>
      CITY_NODES.map((node) => ({
        ...node,
        worldPos: [
          node.position[0] + offset[0],
          node.position[1] + offset[1],
          node.position[2] + offset[2],
        ] as [number, number, number],
      })),
    [offset]
  );

  useFrame((_, delta) => {
    if (!routesRef.current || !active) return;
    timeRef.current += delta;
    routesRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(timeRef.current * 2 + i) * 0.05;
    });
  });

  if (!active) return null;

  const hoveredId = state.hoverNodeId;
  const highlighted = new Set<string>();
  if (hoveredId) {
    highlighted.add(hoveredId);
    const node = CITY_NODES.find((n) => n.id === hoveredId);
    node?.connections.forEach((id) => highlighted.add(id));
  }

  return (
    <group>
      <group ref={routesRef}>
        {CITY_NODES.flatMap((node) =>
          node.connections.map((connId) => {
            if (node.id > connId) return null;
            const target = CITY_NODES.find((n) => n.id === connId);
            if (!target) return null;
            const isActive = highlighted.has(node.id) && highlighted.has(connId);
            const fromArr: [number, number, number] = [
              node.position[0] + offset[0],
              0.1 + offset[1],
              node.position[2] + offset[2],
            ];
            const toArr: [number, number, number] = [
              target.position[0] + offset[0],
              0.1 + offset[1],
              target.position[2] + offset[2],
            ];
            return (
              <Line
                key={`${node.id}-${connId}`}
                points={[fromArr, toArr]}
                color="#ffffff"
                transparent
                opacity={isActive ? 0.9 : 0.12}
                lineWidth={1}
              />
            );
          })
        )}
      </group>

      {nodes.map((node) => {
        const height = TYPE_HEIGHT[node.type] ?? 1;
        const isHovered = hoveredId === node.id;
        const isHighlighted = highlighted.has(node.id);

        return (
          <mesh
            key={node.id}
            position={[node.worldPos[0], height / 2 + node.worldPos[1], node.worldPos[2]]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoverNode(node.id);
            }}
            onPointerOut={() => setHoverNode(null)}
          >
            <boxGeometry args={[isHovered ? 1.1 : 0.9, height, isHovered ? 1.1 : 0.9]} />
            <meshPhysicalMaterial
              color="#000000" metalness={0.85} roughness={0.1}
              transmission={0.9} clearcoat={1.0} clearcoatRoughness={0.05}
              transparent
              opacity={isHighlighted ? 0.95 : 0.35}
            />
          </mesh>
        );
      })}
    </group>
  );
}
