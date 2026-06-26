"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { cameraDirector } from "./CameraDirector";

export function CameraRig() {
  const { state } = useExperienceContext();

  useEffect(() => {
    cameraDirector.setProgress(state.scrollProgress);
  }, [state.scrollProgress]);

  useFrame((_, delta) => {
    cameraDirector.update(_.camera as THREE.PerspectiveCamera, delta);
  });

  return null;
}
