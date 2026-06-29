"use client";

import { InformationParticleField } from "@/components/world/systems/InformationParticleField";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";

export function BootZone() {
  return (
    <group position={[0, 0, 45]}>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, 5]} intensity={0.4} distance={30} color="#ffffff" />
    </group>
  );
}
