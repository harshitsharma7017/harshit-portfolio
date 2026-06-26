"use client";

import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getZoneById } from "@/data/zoneConfig";

export function ContactZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("contact");
  const active = state.zoneStates.contact !== "dormant";
  const fade = state.contactRevealed ? 0.3 : 1;

  if (!active) return null;

  return (
    <group position={[0, 0, zone.zPosition]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 5, 0.1]} />
        <meshBasicMaterial color="#111111" transparent opacity={fade} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[7.4, 4.4, 0.01]} />
        <meshBasicMaterial color="#0a0a0a" transparent opacity={fade} />
      </mesh>
    </group>
  );
}
