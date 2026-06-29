"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { useLenis } from "@/components/providers/LenisProvider";
import { cameraDirector } from "@/components/camera/CameraDirector";
import { ZONES } from "@/data/zoneConfig";

export function SceneNavigationController() {
  const { state, setSceneIndex, setTransitioning, setScrollProgress } = useExperienceContext();
  const lenis = useLenis();
  const wheelDelta = useRef(0);
  const touchStartY = useRef(0);
  const maxScenes = ZONES.length;

  // Use refs for state to avoid re-running the effect on every frame
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!lenis) return;

    // Stop native lenis scroll
    lenis.stop();

    const SCROLL_THRESHOLD = 80;

    const navigateToScene = (nextIndex: number) => {
      const currentState = stateRef.current;
      if (currentState.isTransitioning) return;
      if (nextIndex < 0 || nextIndex >= maxScenes) return;
      if (nextIndex === currentState.currentSceneIndex) return;

      console.log(`Navigating to scene ${nextIndex}`);

      setTransitioning(true);
      setSceneIndex(nextIndex);

      const targetZone = ZONES[nextIndex];
      const targetCameraProgress = targetZone.cameraProgress;
      
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      console.log("GSAP started");
      const proxy = { progress: currentState.scrollProgress };
      gsap.to(proxy, {
        progress: targetCameraProgress,
        duration: 1.3,
        ease: "power3.inOut",
        onUpdate: () => {
          // Manually update the state and camera since lenis.stop() prevents ScrollTrigger from firing
          setScrollProgress(proxy.progress);
          cameraDirector.setProgress(proxy.progress);
          
          if (lenis) {
            lenis.scrollTo(proxy.progress * maxScroll, { immediate: true });
          }
        },
        onComplete: () => {
          setTransitioning(false);
          wheelDelta.current = 0;
        },
      });
    };



    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const currentState = stateRef.current;
      
      const newDelta = wheelDelta.current + e.deltaY;
      const targetDirection = e.deltaY > 0 ? 1 : -1;
      
      console.log("Wheel event fired", {
        deltaY: e.deltaY,
        accumulatedDelta: newDelta,
        currentSceneIndex: currentState.currentSceneIndex,
        targetSceneIndex: currentState.currentSceneIndex + targetDirection,
        isTransitioning: currentState.isTransitioning,
        scrollProgress: currentState.scrollProgress
      });

      if (currentState.isTransitioning) return;

      wheelDelta.current += e.deltaY;

      if (wheelDelta.current > SCROLL_THRESHOLD) {
        console.log("Threshold reached (down)");
        navigateToScene(currentState.currentSceneIndex + 1);
        wheelDelta.current = 0;
      } else if (wheelDelta.current < -SCROLL_THRESHOLD) {
        console.log("Threshold reached (up)");
        navigateToScene(currentState.currentSceneIndex - 1);
        wheelDelta.current = 0;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (stateRef.current.isTransitioning) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (stateRef.current.isTransitioning) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - currentY;
      
      wheelDelta.current += deltaY * 0.5;
      touchStartY.current = currentY;

      if (wheelDelta.current > SCROLL_THRESHOLD) {
        console.log("Touch Threshold reached (down)");
        navigateToScene(stateRef.current.currentSceneIndex + 1);
        wheelDelta.current = 0;
      } else if (wheelDelta.current < -SCROLL_THRESHOLD) {
        console.log("Touch Threshold reached (up)");
        navigateToScene(stateRef.current.currentSceneIndex - 1);
        wheelDelta.current = 0;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentState = stateRef.current;
      if (currentState.isTransitioning) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        navigateToScene(currentState.currentSceneIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        navigateToScene(currentState.currentSceneIndex - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      lenis.start();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lenis, maxScenes, setSceneIndex, setTransitioning, setScrollProgress]);

  return null;
}
