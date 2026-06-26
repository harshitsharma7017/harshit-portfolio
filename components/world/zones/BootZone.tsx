"use client";

import { InformationParticleField } from "@/components/world/systems/InformationParticleField";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";

export function BootZone() {
  const { state } = useExperienceContext();
  const active = state.zoneStates.boot !== "dormant";

  return (
    <group position={[0, 0, 0]}>
      <InformationParticleField
        count={400}
        zoneOffset={[0, 0, 0]}
        visible={active}
      />
    </group>
  );
}
