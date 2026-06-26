"use client";

import { ServerCore } from "@/components/world/systems/ServerCore";
import { BackendPacketFlow } from "@/components/world/systems/BackendPacketFlow";
import { BackendLighting } from "@/components/world/systems/BackendLighting";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { useHoverThroughput } from "@/components/hooks/useHoverThroughput";
import { getZoneById } from "@/data/zoneConfig";

export function BackendZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("backend");
  const active = state.zoneStates.backend !== "dormant";
  const isActive = state.zoneStates.backend === "active";

  useHoverThroughput(isActive);

  return (
    <group position={[0, 0, zone.zPosition]}>
      <BackendLighting active={active} />
      <ServerCore
        active={active}
        throughputMultiplier={state.throughputMultiplier}
      />
      <BackendPacketFlow
        active={active}
        throughputMultiplier={state.throughputMultiplier}
      />
    </group>
  );
}
