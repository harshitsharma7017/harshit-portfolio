"use client";

interface ProjectsLightingProps {
  active: boolean;
}

export function ProjectsLighting({ active }: ProjectsLightingProps) {
  return (
    <group visible={active}>
      {/* Subtle fill light from below to catch the metallic edges of terminals */}
      <spotLight
        position={[0, -5, 5]}
        intensity={1.2}
        angle={0.6}
        penumbra={1}
        color="#ffffff"
        distance={20}
        decay={2}
      />

      {/* Gentle ambient glow specifically for the projects area */}
      <pointLight 
        position={[0, 2, -2]} 
        intensity={0.4} 
        color="#ffffff" 
        distance={15} 
      />

      {/* Top rim light to separate terminals from background */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#ffffff"
      />
    </group>
  );
}
