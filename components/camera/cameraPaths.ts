import type { CameraAnchor } from "@/types/experience";
import { ZONES } from "@/data/zoneConfig";

export const CAMERA_ANCHORS: Record<string, CameraAnchor> = {
  boot: {
    position: [0, 2, 8],
    lookAt: [0, 0, 0],
    fov: 50,
  },
  backend: {
    // Reveal from high left
    position: [-6, 6, -14],
    lookAt: [2, 0, -20],
    fov: 42,
  },
  database: {
    // Approach from low right
    position: [5, -2, -32],
    lookAt: [-1, 2, -40],
    fov: 40,
  },
  eqas: {
    // Dead on but low, industrial scale
    position: [0, 0.5, -48],
    lookAt: [0, 2, -55],
    fov: 44,
  },
  citycore: {
    // Wide aerial establishing shot
    position: [12, 10, -58],
    lookAt: [-2, -2, -70],
    fov: 45,
  },
  projects: {
    // Close intimate angle
    position: [-3, 2, -82],
    lookAt: [1, 0, -90],
    fov: 44,
  },
  contact: {
    // Monumental symmetry at the end
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
  
  // Cinematic easeInOutCubic for very smooth starts and stops
  const t = localT < 0.5 
    ? 4 * localT * localT * localT 
    : 1 - Math.pow(-2 * localT + 2, 3) / 2;

  // Spatial arc: sweep outward dynamically during transit to feel like travelling
  const arcHeight = Math.sin(t * Math.PI) * 2.5; 
  const arcDirectionX = (fromIndex % 2 === 0) ? 1 : -1;
  const arcDirectionY = (fromIndex % 3 === 0) ? 1 : -1;

  return {
    position: [
      fromAnchor.position[0] + (toAnchor.position[0] - fromAnchor.position[0]) * t + (arcHeight * arcDirectionX),
      fromAnchor.position[1] + (toAnchor.position[1] - fromAnchor.position[1]) * t + (arcHeight * arcDirectionY * 0.5),
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
