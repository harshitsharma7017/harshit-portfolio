"use client";

interface BackendLightingProps {
  active: boolean;
}

export function BackendLighting({ active }: BackendLightingProps) {
  if (!active) return null;

  return (
    <group>
      {/* Rim light — from behind and above, creates silhouette edges on tier platforms */}
      <spotLight
        position={[0, 8, -6]}
        target-position={[0, 2, 0]}
        intensity={1.2}
        angle={0.6}
        penumbra={0.8}
        color="#ffffff"
        distance={25}
        decay={2}
      />

      {/* Subtle uplight — from below, illuminates the gaps between tiers */}
      <pointLight
        position={[0, -2, 0]}
        intensity={0.4}
        color="#ffffff"
        distance={12}
        decay={2}
      />

      {/* Side fill — very subtle, prevents total blackout on the far side */}
      <pointLight
        position={[-5, 3, 2]}
        intensity={0.15}
        color="#ffffff"
        distance={15}
        decay={2}
      />

      {/* Top key light — defines the surface of the tier slabs */}
      <directionalLight
        position={[2, 10, 3]}
        intensity={0.5}
        color="#ffffff"
      />
    </group>
  );
}
