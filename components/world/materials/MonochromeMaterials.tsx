"use client";

import * as THREE from "three";

export function useMonochromeMaterials() {
  const white = new THREE.MeshBasicMaterial({ color: "#ffffff" });
  const muted = new THREE.MeshBasicMaterial({ color: "#555555" });
  const ghost = new THREE.MeshBasicMaterial({ color: "#111111", transparent: true, opacity: 0.6 });
  const dim = new THREE.MeshBasicMaterial({ color: "#333333" });
  const line = new THREE.LineBasicMaterial({ color: "#555555", transparent: true, opacity: 0.5 });

  return { white, muted, ghost, dim, line };
}

export function createWhiteMaterial(opacity = 1): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: "#ffffff",
    transparent: opacity < 1,
    opacity,
  });
}

export function createLineMaterial(opacity = 0.5): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: "#555555",
    transparent: true,
    opacity,
  });
}
