"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { World } from "@/components/world/World";
import { CameraRig } from "@/components/camera/CameraRig";
import { useIsMobile } from "@/components/hooks/useExperienceState";

export function CanvasWorld() {
  const isMobile = useIsMobile();

  return (
    <Canvas
      shadows={!isMobile} // Disable shadows on mobile for performance
      camera={{ position: [0, 2, 60], fov: 50, near: 0.1, far: 200 }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.CineonToneMapping, toneMappingExposure: 1.1 }}
    >
      <fog attach="fog" args={["#0a0a0a", 5, isMobile ? 60 : 150]} />
      <CameraRig />
      <World />
    </Canvas>
  );
}
