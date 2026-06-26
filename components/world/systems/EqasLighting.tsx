"use client";

interface EqasLightingProps {
  active: boolean;
}

export function EqasLighting({ active }: EqasLightingProps) {
  if (!active) return null;

  return (
    <group>
      {/* Wide overhead spotlight — angled across the production arc */}
      <spotLight
        position={[4, 10, 2]}
        intensity={1.0}
        angle={0.7}
        penumbra={0.85}
        color="#ffffff"
        distance={28}
        decay={2}
      />

      {/* Fill from below-left — prevents total blackout under modules */}
      <pointLight
        position={[-6, -3, -2]}
        intensity={0.2}
        color="#ffffff"
        distance={18}
        decay={2}
      />

      {/* Rim light from behind — catches module edges */}
      <directionalLight
        position={[-3, 2, -8]}
        intensity={0.4}
        color="#ffffff"
      />

      {/* Subtle overhead ambient for the delivery end — makes reports brighter */}
      <pointLight
        position={[8, 3, 3]}
        intensity={0.25}
        color="#ffffff"
        distance={12}
        decay={2}
      />
    </group>
  );
}
