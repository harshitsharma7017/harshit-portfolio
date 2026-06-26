"use client";

import { InstancedPacketStream } from "@/components/world/systems/InstancedPacketStream";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { useHoverThroughput } from "@/components/hooks/useHoverThroughput";
import { getZoneById } from "@/data/zoneConfig";

export function BackendZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("backend");
  const active = state.zoneStates.backend !== "dormant";
  const isActive = state.zoneStates.backend === "active";

  useHoverThroughput(isActive);

  return (
    <group position={[0, 0, zone.zPosition]}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[3, 4, 3]} />
        <meshBasicMaterial color="#111111" wireframe transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 3, 2]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.15} />
      </mesh>
      <InstancedPacketStream
        origin={[0, 0, 8]}
        target={[0, 1, 0]}
        active={active}
      />
    </group>
  );
}
