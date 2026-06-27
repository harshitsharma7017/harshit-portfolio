"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { World } from "@/components/world/World";
import { CameraRig } from "@/components/camera/CameraRig";

export function CanvasWorld() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 8], fov: 50, near: 0.1, far: 200 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.CineonToneMapping, toneMappingExposure: 1.1 }}
    >
      <CameraRig />
      <World />
    </Canvas>
  );
}
