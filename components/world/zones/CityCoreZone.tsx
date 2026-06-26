"use client";

import { CityGroundGrid } from "@/components/world/systems/CityGroundGrid";
import { CityArchitecture } from "@/components/world/systems/CityArchitecture";
import { CityLogisticsFlow } from "@/components/world/systems/CityLogisticsFlow";
import { CityLighting } from "@/components/world/systems/CityLighting";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getZoneById } from "@/data/zoneConfig";

export function CityCoreZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("citycore");
  const active = state.zoneStates.citycore !== "dormant";

  return (
    <group position={[0, 0, zone.zPosition]}>
      <CityLighting active={active} />
      <CityGroundGrid active={active} />
      <CityArchitecture active={active} />
      <CityLogisticsFlow active={active} />
    </group>
  );
}
