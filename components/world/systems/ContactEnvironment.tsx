"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { setInstanceMatrix } from "@/lib/three/instancing";

interface ContactEnvironmentProps {
  active: boolean;
}

export function ContactEnvironment({ active }: ContactEnvironmentProps) {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  
  // Create slow-drifting idle particles
  const particleCount = 40;
  
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      ),
      speed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      ),
      scale: 0.02 + Math.random() * 0.03,
    }));
  }, []);

  const geometry = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ffffff",
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: 0.2,
      }),
    []
  );

  useFrame((_, delta) => {
    if (!particlesRef.current || !active) return;
    
    particles.forEach((p, i) => {
      p.position.addScaledVector(p.speed, delta);
      
      // Wrap around
      if (p.position.x > 10) p.position.x = -10;
      if (p.position.x < -10) p.position.x = 10;
      if (p.position.y > 8) p.position.y = -8;
      if (p.position.y < -8) p.position.y = 8;
      
      setInstanceMatrix(
        particlesRef.current!, 
        i, 
        p.position, 
        new THREE.Vector3(p.scale, p.scale, p.scale)
      );
    });
  });


  return (
    <group>
      {/* Intense, dramatic rim light from behind to frame the terminal */}
      <spotLight
        position={[0, 5, -8]}
        intensity={2.0}
        angle={0.9}
        penumbra={1}
        color="#ffffff"
        distance={25}
        decay={2}
      />
      
      {/* Extremely subtle fill to prevent complete blackness on the terminal face */}
      <directionalLight
        position={[0, 0, 10]}
        intensity={0.03}
        color="#ffffff"
      />

      {/* Ambient idle particles */}
      <instancedMesh
        ref={particlesRef}
        args={[geometry, material, particleCount]}
        frustumCulled={false}
      />
    </group>
  );
}
