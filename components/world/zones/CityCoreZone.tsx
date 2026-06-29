"use client";

import { CityGroundGrid } from "@/components/world/systems/CityGroundGrid";
import { CityArchitecture } from "@/components/world/systems/CityArchitecture";
import { CityLogisticsFlow } from "@/components/world/systems/CityLogisticsFlow";
import { CityLighting } from "@/components/world/systems/CityLighting";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getZoneById } from "@/data/zoneConfig";

import { useIsMobile } from "@/components/hooks/useIsMobile";

export function CityCoreZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("citycore");
  const active = state.zoneStates.citycore !== "dormant";
  const isMobile = useIsMobile();
  const scale = isMobile ? 0.7 : 1;

  return (
    <group position={[0, 0, zone.zPosition]} scale={[scale, scale, scale]}>
      <CityLighting active={active} />
      <CityGroundGrid active={active} />
      <CityArchitecture active={active} />
      <CityLogisticsFlow active={active} />
    </group>
  );
}
