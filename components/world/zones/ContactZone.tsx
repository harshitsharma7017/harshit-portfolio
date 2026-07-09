"use client";

import { useMemo, useCallback, useRef } from "react";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getZoneById } from "@/data/zoneConfig";
import { CollectionCluster } from "@/components/world/systems/CollectionCluster";
import { RelationshipBridges, type BridgeEdge } from "@/components/world/systems/RelationshipBridges";
import { ContactLighting } from "@/components/world/systems/ContactLighting";
import { useIsMobile } from "@/components/hooks/useExperienceState";

// Generate a dense cluster for the right half of the viewport
function generateContactCluster() {
  const collections: { id: string; position: [number, number, number]; radius: number; activityLevel: number }[] = [];
  const count = 35; // 35 clusters = lots of density
  
  for (let i = 0; i < count; i++) {
    // Position on the right side (x: 2 to 7, y: -4 to 6, z: -8 to 2)
    const x = 2 + Math.random() * 5;
    const y = -4 + Math.random() * 10;
    const z = -6 + Math.random() * 8;
    
    // Mix of small and medium nodes
    const radius = 0.2 + Math.random() * 0.4;
    
    collections.push({
      id: `contact_node_${i}`,
      position: [x, y, z] as [number, number, number],
      radius,
      activityLevel: Math.random(),
    });
  }

  const edges: BridgeEdge[] = [];
  // Connect each node to 2-3 closest neighbors to form a dense web
  collections.forEach((col, i) => {
    // Simple distance-based connection
    const distances = collections
      .map((other, j) => {
        if (i === j) return { j, dist: Infinity };
        const dx = col.position[0] - other.position[0];
        const dy = col.position[1] - other.position[1];
        const dz = col.position[2] - other.position[2];
        return { j, dist: Math.sqrt(dx*dx + dy*dy + dz*dz) };
      })
      .sort((a, b) => a.dist - b.dist);
      
    // Connect to 2 nearest
    for (let k = 0; k < 2; k++) {
      const target = collections[distances[k].j];
      const edgeKey = [col.id, target.id].sort().join("-");
      // Check if edge already exists
      if (!edges.some(e => e.key === edgeKey)) {
        edges.push({
          key: edgeKey,
          from: col.position,
          to: target.position,
          frequency: 0.2 + Math.random() * 0.6,
        });
      }
    }
  });

  return { collections, edges };
}

export function ContactZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("contact");
  const active = state.zoneStates.contact !== "dormant";
  const isMobile = useIsMobile();
  const scale = isMobile ? 0.7 : 1;

  // Memoize the cluster so it doesn't regenerate on every render
  const cluster = useMemo(() => generateContactCluster(), []);
  
  const indexRingTriggers = useRef<Map<string, () => void>>(new Map());

  const handleRegisterTrigger = useCallback(
    (id: string, trigger: () => void) => {
      indexRingTriggers.current.set(id, trigger);
    },
    []
  );

  if (!active) return null;

  return (
    <group position={[0, 0, zone.zPosition]} scale={[scale, scale, scale]}>
      <ContactLighting active={active} />

      {/* Collection Clusters */}
      {cluster.collections.map((col) => (
        <CollectionCluster
          key={col.id}
          id={col.id}
          position={col.position}
          radius={col.radius}
          activityLevel={col.activityLevel}
          onRegisterTrigger={handleRegisterTrigger}
        />
      ))}

      {/* Relationship Bridges */}
      <RelationshipBridges edges={cluster.edges} active={active} />
    </group>
  );
}
