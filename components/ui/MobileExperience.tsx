"use client";

import { ZONES } from "@/data/zoneConfig";
import { BOOT_LOGS } from "@/data/bootLogs";
import { PROJECTS } from "@/data/projects";
import { CONTACT_EMAIL } from "@/lib/constants";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { useTerminalTyping } from "@/components/hooks/useTerminalTyping";

export function MobileExperience() {
  const { setContactRevealed } = useExperienceContext();
  const { input, matched } = useTerminalTyping({
    target: "hire harshit",
    onComplete: () => setContactRevealed(true),
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-16">
      <p className="text-[11px] uppercase tracking-[6px] text-[#444444] mb-8">
        Harshit Sharma
      </p>

      <section className="mb-20">
        <p className="text-[11px] uppercase tracking-[6px] text-[#444444] mb-4">
          Boot
        </p>
        <div className="font-mono text-[13px] text-[#555555] space-y-1">
          {BOOT_LOGS.map((log) => (
            <p key={log.text}>{log.text}</p>
          ))}
        </div>
      </section>

      {ZONES.filter((z) => z.id !== "boot" && z.id !== "contact").map((zone) => (
        <section key={zone.id} className="mb-16 pb-16 border-b border-[#1a1a1a]">
          <p className="text-[80px] font-extrabold text-[#111111] leading-none mb-4 select-none">
            {zone.label}
          </p>
          <p className="text-[11px] uppercase tracking-[6px] text-[#444444] mb-3">
            {zone.caption}
          </p>
          {zone.id === "projects" && (
            <div className="mt-6 space-y-4">
              {PROJECTS.map((project) => (
                <div key={project.id}>
                  <p className="text-white text-[20px] font-semibold">{project.name}</p>
                  <p className="text-[#555555] text-[13px] mt-1">{project.stack}</p>
                  <p className="text-[#888888] text-[15px] mt-2">{project.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      <section>
        <p className="text-[80px] font-extrabold text-[#111111] leading-none mb-4 select-none">
          06
        </p>
        <p
          className="text-white font-extrabold leading-[1.1] mb-8"
          style={{ fontSize: "clamp(40px, 10vw, 72px)" }}
        >
          Let&apos;s work together.
        </p>
        {!matched ? (
          <div className="font-mono text-[#555555]">
            <p className="mb-4">Type: hire harshit</p>
            <p className="text-white">
              $ {input}
              <span className="animate-pulse">▋</span>
            </p>
          </div>
        ) : (
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-white text-[18px] underline">
            {CONTACT_EMAIL}
          </a>
        )}
      </section>
    </div>
  );
}
