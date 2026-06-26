"use client";

import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/constants";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { useTerminalTyping } from "@/components/hooks/useTerminalTyping";

export function ContactTerminal() {
  const { state, setContactRevealed } = useExperienceContext();
  const isActive = state.activeZone === "contact";

  const { input, matched } = useTerminalTyping({
    target: "hire harshit",
    onComplete: () => setContactRevealed(true),
  });

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center px-8">
      <div
        className="w-full max-w-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-8 md:p-12 font-mono transition-opacity duration-1000"
        style={{ opacity: state.contactRevealed ? 0.4 : 1 }}
      >
        <p className="text-[#444444] mb-6 uppercase tracking-[3px] text-[11px]">
          Contact Terminal
        </p>

        {!matched ? (
          <>
            <p className="text-[#555555] mb-6 text-[14px]">
              Type to connect:
            </p>
            <div className="flex items-center gap-2 text-white text-[18px]">
              <span>$</span>
              <span>{input}</span>
              <span className="animate-pulse">▋</span>
            </div>
          </>
        ) : (
          <div className="text-center">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-white text-[20px] md:text-[28px] hover:underline transition-all duration-300"
            >
              {CONTACT_EMAIL}
            </a>
            <div className="mt-10 flex items-center justify-center gap-10">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#555555] text-[14px] uppercase tracking-[3px] hover:text-white transition-colors duration-300"
              >
                GitHub
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#555555] text-[14px] uppercase tracking-[3px] hover:text-white transition-colors duration-300"
              >
                LinkedIn
              </a>
            </div>
            <div className="mt-12 flex items-center justify-center gap-1 text-[#333333] text-[14px]">
              <span className="animate-pulse">▋</span>
            </div>
          </div>
        )}
      </div>

      <p className="fixed bottom-6 text-[#333333] text-[12px]">
        © 2026 Harshit Sharma
      </p>
    </div>
  );
}
