import type { CameraAnchor } from "@/types/experience";
import { ZONES } from "@/data/zoneConfig";

export const CAMERA_ANCHORS: Record<string, CameraAnchor> = {
  boot: {
    position: [0, 2, 8],
    lookAt: [0, 0, 0],
    fov: 50,
  },
  backend: {
    position: [3, 4, -15],
    lookAt: [0, 2, -20],
    fov: 42,
  },
  database: {
    position: [3, 2.5, -34],
    lookAt: [0, 1, -40],
    fov: 40,
  },
  eqas: {
    position: [2, 3.5, -49],
    lookAt: [-1, 0.5, -55],
    fov: 44,
  },
  citycore: {
    position: [12, 10, -50],
    lookAt: [0, 0, -62],
    fov: 45,
  },
  projects: {
    position: [0, 2, -82],
    lookAt: [0, 0, -90],
    fov: 44,
  },
  contact: {
    position: [0, 1.5, -102],
    lookAt: [0, 1.5, -110],
    fov: 35,
  },
};

export function getCameraAnchorForProgress(progress: number): CameraAnchor {
  const clamped = Math.min(1, Math.max(0, progress));

  let fromIndex = 0;
  for (let i = ZONES.length - 1; i >= 0; i--) {
    if (clamped >= ZONES[i].scrollStart) {
      fromIndex = i;
      break;
    }
  }

  const fromZone = ZONES[fromIndex];
  const toZone = ZONES[Math.min(fromIndex + 1, ZONES.length - 1)];
  const fromAnchor = CAMERA_ANCHORS[fromZone.id];
  const toAnchor = CAMERA_ANCHORS[toZone.id];

  const range = toZone.scrollStart - fromZone.scrollStart || 1;
  const localT = Math.min(
    1,
    Math.max(0, (clamped - fromZone.scrollStart) / range)
  );
  const t = localT * localT * (3 - 2 * localT);

  return {
    position: [
      fromAnchor.position[0] + (toAnchor.position[0] - fromAnchor.position[0]) * t,
      fromAnchor.position[1] + (toAnchor.position[1] - fromAnchor.position[1]) * t,
      fromAnchor.position[2] + (toAnchor.position[2] - fromAnchor.position[2]) * t,
    ],
    lookAt: [
      fromAnchor.lookAt[0] + (toAnchor.lookAt[0] - fromAnchor.lookAt[0]) * t,
      fromAnchor.lookAt[1] + (toAnchor.lookAt[1] - fromAnchor.lookAt[1]) * t,
      fromAnchor.lookAt[2] + (toAnchor.lookAt[2] - fromAnchor.lookAt[2]) * t,
    ],
    fov: fromAnchor.fov + (toAnchor.fov - fromAnchor.fov) * t,
  };
}
