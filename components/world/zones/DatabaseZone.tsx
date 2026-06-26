"use client";

import { GraphNetwork } from "@/components/world/systems/GraphNetwork";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getZoneById } from "@/data/zoneConfig";

const DB_NODES = [
  { id: "users", position: [-3, 0, 0] as [number, number, number], connections: ["orders", "sessions"] },
  { id: "orders", position: [0, 1, -2] as [number, number, number], connections: ["users", "reports", "products"] },
  { id: "products", position: [3, 0, 0] as [number, number, number], connections: ["orders", "inventory"] },
  { id: "inventory", position: [3, -1, -3] as [number, number, number], connections: ["products"] },
  { id: "sessions", position: [-3, -1, -3] as [number, number, number], connections: ["users"] },
  { id: "reports", position: [0, -1, 2] as [number, number, number], connections: ["orders"] },
];

export function DatabaseZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("database");
  const active = state.zoneStates.database !== "dormant";

  return (
    <group position={[0, 0, zone.zPosition]}>
      <GraphNetwork
        nodes={DB_NODES}
        offset={[0, 0, 0]}
        active={active}
      />
    </group>
  );
}
