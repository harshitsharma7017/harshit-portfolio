"use client";

import { useEffect, useState } from "react";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import type { ZoneId, ZoneState } from "@/types/experience";

export function useExperienceState() {
  return useExperienceContext();
}

export function useZoneLifecycle(zoneId: ZoneId): ZoneState {
  const { state } = useExperienceContext();
  return state.zoneStates[zoneId];
}

export function useReducedMotion(): boolean {
  const { state, setReducedMotion } = useExperienceContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [setReducedMotion]);

  return mounted ? state.reducedMotion : false;
}

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(media.matches);

    const handler = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}
