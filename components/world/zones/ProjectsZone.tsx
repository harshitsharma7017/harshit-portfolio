"use client";

import { TerminalMesh } from "@/components/world/systems/TerminalMesh";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getProjectById } from "@/data/projects";
import { getZoneById } from "@/data/zoneConfig";

export function ProjectsZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("projects");
  const active = state.zoneStates.projects !== "dormant";
  const selected = state.selectedProject;

  return (
    <group position={[0, 0, zone.zPosition]}>
      <TerminalMesh position={[-3, 1, 0]} scale={0.9} active={active} />
      <TerminalMesh position={[0, 1.2, -1]} scale={1} active={active} />
      <TerminalMesh position={[3, 0.8, 0.5]} scale={0.85} active={active} />

      {selected && (
        <group>
          <mesh position={[0, 0, -3]}>
            <boxGeometry args={[6, 0.05, 6]} />
            <meshBasicMaterial color="#0f0f0f" />
          </mesh>
          <mesh position={[0, 2, -3]}>
            <boxGeometry args={[4, 3, 0.1]} />
            <meshBasicMaterial
              color={getProjectById(selected).envColor}
              transparent
              opacity={0.08}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
