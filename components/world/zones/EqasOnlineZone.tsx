"use client";

import { useCallback, useRef } from "react";
import { ProcessingModule, type ModuleType } from "@/components/world/systems/ProcessingModule";
import { FactoryStream, type ModuleNode } from "@/components/world/systems/FactoryStream";
import { EqasLighting } from "@/components/world/systems/EqasLighting";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { getZoneById } from "@/data/zoneConfig";

// --- Module Layout ---
// Descending arc from upper-left to lower-right: data enters high, reports exit low.
interface ModuleConfig {
  type: ModuleType;
  position: [number, number, number];
  scale: [number, number, number]; // width, height, depth
}

const MODULES: ModuleConfig[] = [
  { type: "intake",     position: [-6,  3.0, -2],  scale: [3.5, 0.3, 2.0] },
  { type: "validation", position: [-3,  2.2, -1],  scale: [3.0, 0.4, 2.0] },
  { type: "statistics", position: [ 0,  1.4,  0],  scale: [3.5, 0.5, 2.5] },
  { type: "outlier",    position: [ 3,  0.6,  1],  scale: [2.5, 0.3, 2.0] },
  { type: "chart",      position: [ 5.5, -0.2, 2], scale: [3.0, 0.4, 2.0] },
  { type: "delivery",   position: [ 7.5, -1.0, 3], scale: [2.0, 0.3, 1.5] },
];

// Extract positions/scales for FactoryStream
const MODULE_NODES: ModuleNode[] = MODULES.map((m) => ({
  position: m.position,
  scale: m.scale,
}));

export function EqasOnlineZone() {
  const { state } = useExperienceContext();
  const zone = getZoneById("eqas");
  const active = state.zoneStates.eqas !== "dormant";

  // Intake surface pulse trigger
  const intakeTriggerRef = useRef<(() => void) | null>(null);

  const handleRegisterIntakePulse = useCallback((trigger: () => void) => {
    intakeTriggerRef.current = trigger;
  }, []);

  const handleIntakeArrive = useCallback(() => {
    if (intakeTriggerRef.current) intakeTriggerRef.current();
  }, []);

  return (
    <group position={[0, 0, zone.zPosition]}>
      <EqasLighting active={active} />

      {/* Processing Modules */}
      {MODULES.map((mod) => (
        <ProcessingModule
          key={mod.type}
          position={mod.position}
          scale={mod.scale}
          moduleType={mod.type}
          active={active}
          onRegisterIntakePulse={
            mod.type === "intake" ? handleRegisterIntakePulse : undefined
          }
        />
      ))}

      {/* Factory Data Stream */}
      <FactoryStream
        modules={MODULE_NODES}
        active={active}
        onIntakeArrive={handleIntakeArrive}
      />
    </group>
  );
}
