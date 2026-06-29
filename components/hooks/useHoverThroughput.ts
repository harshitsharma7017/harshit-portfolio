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

    const handleMove = (clientX: number) => {
      const normalizedX = clientX / window.innerWidth;
      const multiplier = mapRange(normalizedX, 0, 1, 0.4, 2.2);
      setThroughput(multiplier);
    };

    const onMouseMove = (event: MouseEvent) => handleMove(event.clientX);
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        handleMove(event.touches[0].clientX);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      setThroughput(1);
    };
  }, [active, setThroughput]);
}
