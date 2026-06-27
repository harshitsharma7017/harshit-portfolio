"use client";

import * as THREE from "three";

export function useMonochromeMaterials() {
  const white = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.5, metalness: 0.5 });
  const muted = new THREE.MeshStandardMaterial({ color: "#555555", roughness: 0.7, metalness: 0.3 });
  const ghost = new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.9, metalness: 0.1, transparent: true, opacity: 0.6 });
  const dim = new THREE.MeshStandardMaterial({ color: "#333333", roughness: 0.8, metalness: 0.2 });
  const line = new THREE.LineBasicMaterial({ color: "#555555", transparent: true, opacity: 0.5 });

  return { white, muted, ghost, dim, line };
}

export function createWhiteMaterial(opacity = 1): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.5,
    metalness: 0.5,
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
