"use client";

import { ZONES } from "@/data/zoneConfig";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";

export function ZoneCaption() {
  const { state } = useExperienceContext();
  const zone = ZONES.find((z) => z.id === state.activeZone);
  if (!zone || zone.id === "boot") return null;

  return (
    <div className="fixed top-[env(safe-area-inset-top,6rem)] pt-6 md:pt-0 md:top-24 left-6 md:left-16 z-20 pointer-events-none">
      <p className="text-[11px] uppercase tracking-[6px] text-[#444444] mb-3">
        {zone.label}
      </p>
      <h2
        className="text-white font-semibold leading-[1.1]"
        style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
      >
        {zone.caption}
      </h2>
    </div>
  );
}
