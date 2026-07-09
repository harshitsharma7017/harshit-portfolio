export type ZoneId =
  | "boot"
  | "backend"
  | "database"
  | "eqas"
  | "citycore"
  | "projects"
  | "skills"
  | "contact";

export type ZoneState = "dormant" | "near" | "active";

export type ProjectId = "citycore" | "autofunds" | "taskmanager";

export interface ZoneConfig {
  id: ZoneId;
  label: string;
  caption: string;
  zPosition: number;
  scrollStart: number;
  scrollEnd: number;
  cameraProgress: number;
}

export interface BootLogLine {
  text: string;
  delay: number;
}

export interface ProjectDefinition {
  id: ProjectId;
  command: string;
  name: string;
  stack: string;
  description: string;
  envColor: string;
  imageUrl: string;
}

export interface CityNode {
  id: string;
  label: string;
  type: "shop" | "hospital" | "driver" | "user" | "service";
  position: [number, number, number];
  connections: string[];
}

export interface ExperienceState {
  scrollProgress: number;
  activeZone: ZoneId;
  zoneStates: Record<ZoneId, ZoneState>;
  bootComplete: boolean;
  bootLogIndex: number;
  selectedProject: ProjectId | null;
  hoverNodeId: string | null;
  throughputMultiplier: number;
  contactRevealed: boolean;
  reducedMotion: boolean;
  currentSceneIndex: number;
  isTransitioning: boolean;
}

export type ExperienceAction =
  | { type: "SET_SCROLL_PROGRESS"; progress: number }
  | { type: "SET_ACTIVE_ZONE"; zone: ZoneId }
  | { type: "SET_ZONE_STATE"; zone: ZoneId; state: ZoneState }
  | { type: "SET_BOOT_COMPLETE"; complete: boolean }
  | { type: "SET_BOOT_LOG_INDEX"; index: number }
  | { type: "SET_SELECTED_PROJECT"; project: ProjectId | null }
  | { type: "SET_HOVER_NODE"; nodeId: string | null }
  | { type: "SET_THROUGHPUT"; multiplier: number }
  | { type: "SET_CONTACT_REVEALED"; revealed: boolean }
  | { type: "SET_REDUCED_MOTION"; reduced: boolean }
  | { type: "SET_SCENE_INDEX"; index: number }
  | { type: "SET_TRANSITIONING"; transitioning: boolean };

export interface CameraAnchor {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}
