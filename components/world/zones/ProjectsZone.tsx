"use client";

import { TerminalMesh } from "@/components/world/systems/TerminalMesh";
import { ProjectsLighting } from "@/components/world/systems/ProjectsLighting";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getProjectById } from "@/data/projects";
import { getZoneById } from "@/data/zoneConfig";

import { useIsMobile } from "@/components/hooks/useExperienceState";

export function ProjectsZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("projects");
  const active = state.zoneStates.projects !== "dormant";
  const selected = state.selectedProject;
  const isMobile = useIsMobile();
  const scale = isMobile ? 0.7 : 1;

  return (
    <group position={[0, 0, zone.zPosition]} scale={[scale, scale, scale]}>
      <ProjectsLighting active={active} />
      <TerminalMesh position={[-3, 1, 0]} scale={0.9} active={active} />
      <TerminalMesh position={[0, 1.2, -1]} scale={1} active={active} />
      <TerminalMesh position={[3, 0.8, 0.5]} scale={0.85} active={active} />

      {selected && (
        <group>
          <mesh position={[0, 0, -3]}>
            <boxGeometry args={[6, 0.05, 6]} />
            <meshStandardMaterial color="#080808" roughness={0.9} metalness={0.15} />
          </mesh>
          <mesh position={[0, 2, -3]}>
            <boxGeometry args={[4, 3, 0.1]} />
            <meshPhysicalMaterial
              color={getProjectById(selected).envColor}
              transparent
              opacity={0.3}
              roughness={0.8}
              transmission={0.5}
              thickness={0.5}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
