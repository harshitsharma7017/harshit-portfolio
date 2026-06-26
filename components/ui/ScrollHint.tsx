"use client";

import { useExperienceContext } from "@/components/providers/ExperienceProvider";

export function ScrollHint() {
  const { state } = useExperienceContext();

  if (state.scrollProgress > 0.05 || !state.bootComplete) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none">
      <span className="text-[11px] uppercase tracking-[4px] text-[#555555]">
        Scroll
      </span>
      <div className="w-px h-10 bg-[#333333] animate-pulse" />
    </div>
  );
}
