"use client";

import { Suspense } from "react";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getZoneById } from "@/data/zoneConfig";
import { ContactTerminal } from "@/components/world/systems/ContactTerminal";
import { ContactEnvironment } from "@/components/world/systems/ContactEnvironment";
import { useIsMobile } from "@/components/hooks/useExperienceState";

export function ContactZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("contact");
  const active = state.zoneStates.contact !== "dormant";
  const isMobile = useIsMobile();
  const scale = isMobile ? 0.7 : 1;

  if (!active) return null;

  return (
    <group position={[0, 0, zone.zPosition]} scale={[scale, scale, scale]}>
      <ContactEnvironment active={active} />
      <ContactTerminal active={active} />
    </group>
  );
}
