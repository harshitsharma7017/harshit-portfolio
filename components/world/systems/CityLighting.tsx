"use client";

interface CityLightingProps {
  active: boolean;
}

export function CityLighting({ active }: CityLightingProps) {
  if (!active) return null;

  return (
    <group>
      {/* Primary key light - casts sharp architectural shadows */}
      <directionalLight
        position={[15, 20, 10]}
        intensity={0.9}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      {/* Fill light to soften harsh shadows on matte materials */}
      <directionalLight
        position={[-10, 5, -5]}
        intensity={0.3}
        color="#ffffff"
      />

      {/* Rim light from behind to catch building edges */}
      <directionalLight
        position={[0, 8, -20]}
        intensity={0.5}
        color="#ffffff"
      />

      {/* Subtle ambient base */}
      <ambientLight intensity={0.15} color="#ffffff" />
    </group>
  );
}
