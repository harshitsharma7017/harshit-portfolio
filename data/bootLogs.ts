import type { BootLogLine } from "@/types/experience";

export const BOOT_LOGS: BootLogLine[] = [
  { text: "Initializing Runtime…", delay: 0 },
  { text: "Loading Modules…", delay: 600 },
  { text: "Connecting MongoDB…", delay: 1200 },
  { text: "Connected.", delay: 2000 },
  { text: "Starting Express Server…", delay: 2600 },
  { text: "Listening on :3000", delay: 3200 },
  { text: "Deploying…", delay: 3800 },
  { text: "Production Ready.", delay: 4500 },
];

export const BOOT_DURATION_MS = 5500;
