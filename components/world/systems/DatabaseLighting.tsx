"use client";

interface DatabaseLightingProps {
  active: boolean;
}

export function DatabaseLighting({ active }: DatabaseLightingProps) {
  if (!active) return null;

  return (
    <group>
      {/* Wide rim light from behind-below — catches faceted icosahedron edges */}
      <spotLight
        position={[0, -4, -8]}
        intensity={1.5}
        angle={0.8}
        penumbra={0.9}
        color="#ffffff"
        distance={30}
        decay={2}
      />

      {/* Subtle overhead fill — defines collection surfaces */}
      <pointLight
        position={[0, 10, 0]}
        intensity={0.5}
        color="#ffffff"
        distance={20}
        decay={2}
      />

      {/* Side key — creates depth separation between near/far clusters */}
      <directionalLight
        position={[6, 3, 4]}
        intensity={0.5}
        color="#ffffff"
      />

      {/* Opposite side fill — prevents silhouette flatness */}
      <pointLight
        position={[-8, 0, -4]}
        intensity={0.2}
        color="#ffffff"
        distance={18}
        decay={2}
      />
    </group>
  );
}
