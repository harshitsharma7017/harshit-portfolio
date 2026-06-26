import type { ProjectDefinition } from "@/types/experience";

export const PROJECTS: ProjectDefinition[] = [
  {
    id: "citycore",
    command: "open citycore",
    name: "CityCore",
    stack: "Node.js · React · MongoDB · Vercel",
    description: "Hyperlocal city services — 500+ active users",
    envColor: "#ffffff",
  },
  {
    id: "autofunds",
    command: "open autofunds",
    name: "AutoFunds",
    stack: "React · Node.js · GPT-4",
    description: "AI finance — plain English to categorized budget",
    envColor: "#888888",
  },
  {
    id: "taskmanager",
    command: "open tasks",
    name: "Task Manager",
    stack: "Node.js · React · MongoDB · Express",
    description: "Multi-user tracking with JWT auth and RBAC",
    envColor: "#555555",
  },
];

export function getProjectByCommand(input: string): ProjectDefinition | null {
  const normalized = input.trim().toLowerCase();
  return PROJECTS.find((p) => p.command === normalized) ?? null;
}

export function getProjectById(id: ProjectDefinition["id"]): ProjectDefinition {
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) throw new Error(`Project not found: ${id}`);
  return project;
}
