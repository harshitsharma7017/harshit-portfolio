"use client";

import { useCallback, useRef } from "react";
import { CollectionCluster } from "@/components/world/systems/CollectionCluster";
import { RelationshipBridges, type BridgeEdge } from "@/components/world/systems/RelationshipBridges";
import { DatabaseQueryFlow, type CollectionTarget } from "@/components/world/systems/DatabaseQueryFlow";
import { DatabaseLighting } from "@/components/world/systems/DatabaseLighting";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getZoneById } from "@/data/zoneConfig";

// --- Collection Topology ---
// Dramatic scale differences. Positions spread across a wide volume with depth.
const COLLECTIONS: CollectionTarget[] = [
  {
    id: "users",
    position: [-5, 1, -2],
    radius: 2.0,
    connections: ["orders", "sessions"],
  },
  {
    id: "orders",
    position: [2, -0.5, -5],
    radius: 2.5,
    connections: ["users", "reports", "products"],
  },
  {
    id: "products",
    position: [7, 2, -3],
    radius: 1.5,
    connections: ["orders", "inventory"],
  },
  {
    id: "inventory",
    position: [8, -1, -10],
    radius: 1.2,
    connections: ["products"],
  },
  {
    id: "sessions",
    position: [-4, -2, 1],
    radius: 0.8,
    connections: ["users"],
  },
  {
    id: "reports",
    position: [0, 3, -9],
    radius: 1.8,
    connections: ["orders"],
  },
];

// Activity levels (0–1) based on collection importance
const ACTIVITY: Record<string, number> = {
  users: 0.7,
  orders: 0.9,
  products: 0.5,
  inventory: 0.2,
  sessions: 0.6,
  reports: 0.4,
};

// Build bridge edges from collection topology
function buildEdges(collections: CollectionTarget[]): BridgeEdge[] {
  const edges: BridgeEdge[] = [];
  const seen = new Set<string>();
  collections.forEach((col) => {
    col.connections.forEach((connId) => {
      const edgeKey = [col.id, connId].sort().join("-");
      if (seen.has(edgeKey)) return;
      seen.add(edgeKey);

      const target = collections.find((c) => c.id === connId);
      if (!target) return;

      // Frequency proportional to combined activity
      const freq =
        0.3 +
        ((ACTIVITY[col.id] || 0.5) + (ACTIVITY[connId] || 0.5)) * 0.4;

      edges.push({
        key: edgeKey,
        from: col.position,
        to: target.position,
        frequency: freq,
      });
    });
  });
  return edges;
}

const EDGES = buildEdges(COLLECTIONS);

export function DatabaseZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("database");
  const active = state.zoneStates.database !== "dormant";

  // Shared index ring trigger registry
  const indexRingTriggers = useRef<Map<string, () => void>>(new Map());

  const handleRegisterTrigger = useCallback(
    (id: string, trigger: () => void) => {
      indexRingTriggers.current.set(id, trigger);
    },
    []
  );

  return (
    <group position={[0, 0, zone.zPosition]}>
      <DatabaseLighting active={active} />

      {/* Collection Clusters */}
      {COLLECTIONS.map((col) => (
        <CollectionCluster
          key={col.id}
          id={col.id}
          position={col.position}
          radius={col.radius}
          activityLevel={ACTIVITY[col.id] || 0.5}
          onRegisterTrigger={handleRegisterTrigger}
        />
      ))}

      {/* Relationship Bridges */}
      <RelationshipBridges edges={EDGES} active={active} />

      {/* Query Flow — packets, fan-out, responses */}
      <DatabaseQueryFlow
        collections={COLLECTIONS}
        active={active}
        indexRingTriggers={indexRingTriggers}
      />
    </group>
  );
}
