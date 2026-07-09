"use client";

import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getZoneById } from "@/data/zoneConfig";
import { useIsMobile } from "@/components/hooks/useIsMobile";
import { SkillsLighting } from "@/components/world/systems/SkillsLighting";
import { SkillsConstellation } from "@/components/world/systems/SkillsConstellation";

export function SkillsZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("skills");
  const active = state.zoneStates.skills !== "dormant";
  const isMobile = useIsMobile();
  const scale = isMobile ? 0.7 : 1;

  return (
    <group position={[0, 0, zone.zPosition]} scale={[scale, scale, scale]}>
      <SkillsLighting active={active} />
      <SkillsConstellation active={active} />
    </group>
  );
}
