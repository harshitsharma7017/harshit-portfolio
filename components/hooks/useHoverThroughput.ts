"use client";

import { useEffect } from "react";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { mapRange } from "@/lib/math/lerp";

export function useHoverThroughput(active: boolean) {
  const { setThroughput } = useExperienceContext();

  useEffect(() => {
    if (!active) {
      setThroughput(1);
      return;
    }

    const handleMove = (event: MouseEvent) => {
      const normalizedX = event.clientX / window.innerWidth;
      const multiplier = mapRange(normalizedX, 0, 1, 0.4, 2.2);
      setThroughput(multiplier);
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      setThroughput(1);
    };
  }, [active, setThroughput]);
}
