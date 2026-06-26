"use client";

import { PipelineStage } from "@/components/world/systems/PipelineStage";
import { ReportAssembler } from "@/components/world/systems/ReportAssembler";
import { ChartGrowth } from "@/components/world/systems/ChartGrowth";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getZoneById } from "@/data/zoneConfig";
import { mapRange } from "@/lib/math/lerp";

export function EqasOnlineZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("eqas");
  const active = state.zoneStates.eqas !== "dormant";
  const localProgress = mapRange(
    state.scrollProgress,
    zone.scrollStart,
    zone.scrollEnd,
    0,
    1
  );

  return (
    <group position={[0, 0, zone.zPosition]}>
      <PipelineStage offset={[0, 2, 0]} active={active} progress={localProgress} />
      <ReportAssembler offset={[-1, 0, 1]} active={active} progress={localProgress} />
      <ChartGrowth offset={[2, 0, -1]} active={active} progress={localProgress} />
    </group>
  );
}
