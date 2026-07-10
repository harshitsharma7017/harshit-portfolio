import type { CameraAnchor } from "@/types/experience";
import { ZONES } from "@/data/zoneConfig";

export const CAMERA_ANCHORS: Record<string, CameraAnchor> = {
  boot: {
    // Dedicated staging area in empty negative space far from Backend Engine
    position: [0, 2, 60],
    lookAt: [0, 0, 45],
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
    // Elevated to clearly see the ascending production line
    position: [0, 5, -46],
    lookAt: [0, 0, -55],
    fov: 44,
  },
  citycore: {
    // Wide aerial establishing shot
    position: [12, 10, -58],
    lookAt: [-2, -2, -70],
    fov: 45,
  },
  projects: {
    // Center framed, pulled back slightly to fit wide layout
    position: [0, 2, -78],
    lookAt: [0, 0, -90],
    fov: 44,
  },
  skills: {
    // Approach from low right — mirrors Database Network viewing angle
    position: [5, -2, -102],
    lookAt: [-1, 1.5, -110],
    fov: 40,
  },
  contact: {
    // Monumental symmetry at the end
    position: [0, 1.5, -122],
    lookAt: [0, 1.5, -130],
    fov: 35,
  },
};

export const MOBILE_CAMERA_ANCHORS: Record<string, CameraAnchor> = {
  boot: {
    // Closer, wider FOV
    position: [0, 2, 58],
    lookAt: [0, 0, 45],
    fov: 65,
  },
  backend: {
    // Tighter, lower angle to fit height without backing up
    position: [0, 4, -12],
    lookAt: [0, -2, -20],
    fov: 60,
  },
  database: {
    // Closer, low angle
    position: [0, -4, -32],
    lookAt: [0, 2, -40],
    fov: 65,
  },
  eqas: {
    // Closer, looking slightly down
    position: [0, 3, -48],
    lookAt: [0, -1, -55],
    fov: 65,
  },
  citycore: {
    // Instead of pulling back to -50, get closer but look down harder
    position: [0, 10, -62],
    lookAt: [0, -6, -70],
    fov: 70,
  },
  projects: {
    // Closer
    position: [0, 2, -82],
    lookAt: [0, 0, -90],
    fov: 65,
  },
  skills: {
    // Close, low angle — mirrors mobile database viewing angle
    position: [0, -4, -102],
    lookAt: [0, 2, -110],
    fov: 65,
  },
  contact: {
    // Monumental but closer
    position: [0, 2, -122],
    lookAt: [0, 1.5, -130],
    fov: 60,
  },
};

export function getCameraAnchorForProgress(progress: number, isMobile: boolean = false): CameraAnchor {
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
  
  const anchors = isMobile ? MOBILE_CAMERA_ANCHORS : CAMERA_ANCHORS;
  const fromAnchor = anchors[fromZone.id];
  const toAnchor = anchors[toZone.id];

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
  // Limit arc on mobile to prevent going out of bounds
  const arcScale = isMobile ? 0.3 : 1.0;
  const arcDirectionX = (fromIndex % 2 === 0) ? 1 : -1;
  const arcDirectionY = (fromIndex % 3 === 0) ? 1 : -1;

  return {
    position: [
      fromAnchor.position[0] + (toAnchor.position[0] - fromAnchor.position[0]) * t + (arcHeight * arcDirectionX * arcScale),
      fromAnchor.position[1] + (toAnchor.position[1] - fromAnchor.position[1]) * t + (arcHeight * arcDirectionY * 0.5 * arcScale),
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
