"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { useLenis } from "@/components/providers/LenisProvider";
import { SCROLL_HEIGHT_VH } from "@/lib/constants";
import { cameraDirector } from "@/components/camera/CameraDirector";

export function ScrollTrack() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { setScrollProgress } = useExperienceContext();
  const lenis = useLenis();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        cameraDirector.setProgress(self.progress);
      },
    });

    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis, setScrollProgress]);

  return (
    <div
      ref={trackRef}
      className="scroll-track"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
      aria-hidden="true"
    />
  );
}
