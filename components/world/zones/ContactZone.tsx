"use client";

import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getZoneById } from "@/data/zoneConfig";
import { ContactTerminal } from "@/components/world/systems/ContactTerminal";
import { ContactEnvironment } from "@/components/world/systems/ContactEnvironment";

export function ContactZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("contact");
  const active = state.zoneStates.contact !== "dormant";

  if (!active) return null;

  return (
    <group position={[0, 0, zone.zPosition]}>
      <ContactEnvironment active={active} />
      <ContactTerminal active={active} />
    </group>
  );
}
