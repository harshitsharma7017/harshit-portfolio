"use client";

import { InformationParticleField } from "@/components/world/systems/InformationParticleField";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";

export function BootZone() {
  const { state } = useExperienceContext();
  const active = state.zoneStates.boot !== "dormant";

  return (
    <group position={[0, 0, 45]}>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, 5]} intensity={0.4} distance={30} color="#ffffff" />
      <InformationParticleField
        count={250} // Subtle atmospheric dust
        zoneOffset={[0, 0, 0]}
        visible={active}
      />
    </group>
  );
}
