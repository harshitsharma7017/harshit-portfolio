"use client";

import { CityGraph } from "@/components/world/systems/CityGraph";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getZoneById } from "@/data/zoneConfig";

export function CityCoreZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("citycore");
  const active = state.zoneStates.citycore !== "dormant";

  return (
    <group position={[0, 0, zone.zPosition]}>
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial color="#0f0f0f" />
      </mesh>
      <CityGraph offset={[0, 0, 0]} active={active} />
    </group>
  );
}
