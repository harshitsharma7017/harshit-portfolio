import type { ZoneConfig } from "@/types/experience";

export const ZONES: ZoneConfig[] = [
  {
    id: "boot",
    label: "00",
    caption: "Boot Sequence",
    zPosition: 0,
    scrollStart: 0,
    scrollEnd: 0,
    cameraProgress: 0,
  },
  {
    id: "backend",
    label: "01",
    caption: "Backend Engine",
    zPosition: -20,
    scrollStart: 0.08,
    scrollEnd: 0.18,
    cameraProgress: 0.13,
  },
  {
    id: "database",
    label: "02",
    caption: "Database Network",
    zPosition: -40,
    scrollStart: 0.22,
    scrollEnd: 0.34,
    cameraProgress: 0.28,
  },
  {
    id: "eqas",
    label: "03",
    caption: "EqasOnline",
    zPosition: -55,
    scrollStart: 0.38,
    scrollEnd: 0.50,
    cameraProgress: 0.44,
  },
  {
    id: "citycore",
    label: "04",
    caption: "CityCore",
    zPosition: -70,
    scrollStart: 0.54,
    scrollEnd: 0.66,
    cameraProgress: 0.60,
  },
  {
    id: "projects",
    label: "05",
    caption: "Projects",
    zPosition: -90,
    scrollStart: 0.70,
    scrollEnd: 0.80,
    cameraProgress: 0.75,
  },
  {
    id: "skills",
    label: "06",
    caption: "Skills",
    zPosition: -110,
    scrollStart: 0.83,
    scrollEnd: 0.89,
    cameraProgress: 0.86,
  },
  {
    id: "contact",
    label: "07",
    caption: "Contact",
    zPosition: -130,
    scrollStart: 0.92,
    scrollEnd: 1.0,
    cameraProgress: 0.96,
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
