import type { ZoneId } from "@/types/experience";

export function onZoneEnter(zoneId: ZoneId): void {
  void zoneId;
}

export function onZoneExit(zoneId: ZoneId): void {
  void zoneId;
}

export const zoneTransitionCallbacks = {
  boot: { enter: () => onZoneEnter("boot"), exit: () => onZoneExit("boot") },
  backend: { enter: () => onZoneEnter("backend"), exit: () => onZoneExit("backend") },
  database: { enter: () => onZoneEnter("database"), exit: () => onZoneExit("database") },
  eqas: { enter: () => onZoneEnter("eqas"), exit: () => onZoneExit("eqas") },
  citycore: { enter: () => onZoneEnter("citycore"), exit: () => onZoneExit("citycore") },
  projects: { enter: () => onZoneEnter("projects"), exit: () => onZoneExit("projects") },
  contact: { enter: () => onZoneEnter("contact"), exit: () => onZoneExit("contact") },
};
