import type { ZoneConfig } from "@/types/experience";

export const ZONES: ZoneConfig[] = [
  {
    id: "boot",
    label: "00",
    caption: "Boot Sequence",
    zPosition: 0,
    scrollStart: 0,
    scrollEnd: 0.1,
  },
  {
    id: "backend",
    label: "01",
    caption: "Backend Engine",
    zPosition: -20,
    scrollStart: 0.1,
    scrollEnd: 0.25,
  },
  {
    id: "database",
    label: "02",
    caption: "Database Network",
    zPosition: -40,
    scrollStart: 0.25,
    scrollEnd: 0.4,
  },
  {
    id: "eqas",
    label: "03",
    caption: "EqasOnline",
    zPosition: -55,
    scrollStart: 0.4,
    scrollEnd: 0.55,
  },
  {
    id: "citycore",
    label: "04",
    caption: "CityCore",
    zPosition: -70,
    scrollStart: 0.55,
    scrollEnd: 0.7,
  },
  {
    id: "projects",
    label: "05",
    caption: "Projects",
    zPosition: -90,
    scrollStart: 0.7,
    scrollEnd: 0.85,
  },
  {
    id: "contact",
    label: "06",
    caption: "Contact",
    zPosition: -110,
    scrollStart: 0.85,
    scrollEnd: 1,
  },
];

export function getZoneById(id: ZoneConfig["id"]): ZoneConfig {
  const zone = ZONES.find((z) => z.id === id);
  if (!zone) throw new Error(`Zone not found: ${id}`);
  return zone;
}

export function getActiveZone(progress: number): ZoneConfig {
  const clamped = Math.min(1, Math.max(0, progress));
  for (let i = ZONES.length - 1; i >= 0; i--) {
    if (clamped >= ZONES[i].scrollStart) {
      return ZONES[i];
    }
  }
  return ZONES[0];
}

export function getZoneState(
  zone: ZoneConfig,
  progress: number
): "dormant" | "near" | "active" {
  const mid = (zone.scrollStart + zone.scrollEnd) / 2;
  const range = zone.scrollEnd - zone.scrollStart;
  const nearBuffer = range * 0.3;

  if (progress >= zone.scrollStart && progress <= zone.scrollEnd) {
    return "active";
  }
  if (
    progress >= zone.scrollStart - nearBuffer &&
    progress <= zone.scrollEnd + nearBuffer
  ) {
    return "near";
  }
  return "dormant";
}
