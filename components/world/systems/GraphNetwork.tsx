"use client";

import { Line } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";

export interface GraphNode {
  id: string;
  position: [number, number, number];
  connections: string[];
}

interface GraphNetworkProps {
  nodes: GraphNode[];
  offset: [number, number, number];
  active: boolean;
}

export function GraphNetwork({ nodes, offset, active }: GraphNetworkProps) {
  const { state, setHoverNode } = useExperienceContext();
  const hoveredId = state.hoverNodeId;

  const nodeMeshes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        worldPos: [
          node.position[0] + offset[0],
          node.position[1] + offset[1],
          node.position[2] + offset[2],
        ] as [number, number, number],
      })),
    [nodes, offset]
  );

  const edges = useMemo(() => {
    const lines: Array<{
      key: string;
      from: [number, number, number];
      to: [number, number, number];
    }> = [];
    nodes.forEach((node) => {
      const from = node.position;
      node.connections.forEach((connId) => {
        const target = nodes.find((n) => n.id === connId);
        if (target && node.id < connId) {
          lines.push({
            key: `${node.id}-${connId}`,
            from: [from[0] + offset[0], from[1] + offset[1], from[2] + offset[2]],
            to: [
              target.position[0] + offset[0],
              target.position[1] + offset[1],
              target.position[2] + offset[2],
            ],
          });
        }
      });
    });
    return lines;
  }, [nodes, offset]);

  if (!active) return null;

  const highlightedIds = new Set<string>();
  if (hoveredId) {
    highlightedIds.add(hoveredId);
    const hovered = nodes.find((n) => n.id === hoveredId);
    hovered?.connections.forEach((id) => highlightedIds.add(id));
  }

  return (
    <group>
      {edges.map((edge) => {
        const nodeA = edge.key.split("-")[0];
        const nodeB = edge.key.split("-")[1];
        const isHighlighted =
          hoveredId !== null &&
          highlightedIds.has(nodeA) &&
          highlightedIds.has(nodeB);

        return (
          <Line
            key={edge.key}
            points={[edge.from, edge.to]}
            color="#ffffff"
            transparent
            opacity={isHighlighted ? 0.8 : 0.15}
            lineWidth={1}
          />
        );
      })}

      {nodeMeshes.map((node) => {
        const isHighlighted = highlightedIds.has(node.id);
        const isHovered = hoveredId === node.id;

        return (
          <group key={node.id} position={node.worldPos}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoverNode(node.id);
              }}
              onPointerOut={() => setHoverNode(null)}
            >
              <sphereGeometry args={[isHovered ? 0.35 : 0.25, 16, 16]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={isHighlighted ? 1 : 0.4}
              />
            </mesh>

            {isHovered && (
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.5, 0.7, 32]} />
                <meshBasicMaterial
                  color="#555555"
                  transparent
                  opacity={0.6}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
