"use client";

interface ContactLightingProps {
  active: boolean;
}

export function ContactLighting({ active }: ContactLightingProps) {
  if (!active) return null;

  return (
    <group>
      {/* Wide rim light from behind-below — catches faceted icosahedron edges */}
      <spotLight
        position={[0, -4, -8]}
        intensity={3.0}
        angle={1.0}
        penumbra={0.5}
        color="#ffffff"
        distance={40}
        decay={1.5}
      />

      {/* Subtle overhead fill — defines collection surfaces */}
      <pointLight
        position={[0, 10, 0]}
        intensity={1.5}
        color="#ffffff"
        distance={30}
        decay={1.5}
      />

      {/* Side key — creates depth separation between near/far clusters */}
      <directionalLight
        position={[6, 3, 4]}
        intensity={1.2}
        color="#ffffff"
      />

      {/* Opposite side fill — prevents silhouette flatness */}
      <pointLight
        position={[-8, 0, -4]}
        intensity={0.8}
        color="#ffffff"
        distance={25}
        decay={1.5}
      />
    </group>
  );
}
