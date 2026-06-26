"use client";

import { useCallback, useEffect, useState } from "react";
import { PROJECTS, getProjectByCommand } from "@/data/projects";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";

export function ProjectTerminal() {
  const { state, setSelectedProject } = useExperienceContext();
  const [input, setInput] = useState("");
  const isActive = state.activeZone === "projects";

  const submitCommand = useCallback(
    (command: string) => {
      const project = getProjectByCommand(command);
      if (project) {
        setSelectedProject(project.id);
        setInput("");
      }
    },
    [setSelectedProject]
  );

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        submitCommand(input);
        return;
      }
      if (event.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
        return;
      }
      if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
        setInput((prev) => prev + event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, isActive, submitCommand]);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-16 left-8 right-8 md:left-16 md:right-auto md:w-[480px] z-30">
      <div className="border border-[#1a1a1a] bg-[#0a0a0a] p-6 font-mono text-[13px]">
        <p className="text-[#444444] mb-4 uppercase tracking-[3px] text-[11px]">
          Projects Terminal
        </p>
        <p className="text-[#555555] mb-3">
          Type a command to open a project environment:
        </p>
        {PROJECTS.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => submitCommand(project.command)}
            className="block w-full text-left py-2 text-[#666666] hover:text-white transition-colors duration-300"
          >
            $ {project.command}
            <span className="text-[#333333] ml-3">— {project.name}</span>
          </button>
        ))}
        {state.selectedProject && (
          <div className="mt-4 pt-4 border-t border-[#1a1a1a] text-[#888888]">
            {PROJECTS.find((p) => p.id === state.selectedProject)?.description}
          </div>
        )}
        <div className="mt-4 flex items-center gap-1 text-white">
          <span>$</span>
          <span>{input}</span>
          <span className="animate-pulse">▋</span>
        </div>
      </div>
    </div>
  );
}
