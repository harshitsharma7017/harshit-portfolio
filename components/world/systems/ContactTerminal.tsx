"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";

interface ContactTerminalProps {
  active: boolean;
}

export function ContactTerminal({ active }: ContactTerminalProps) {
  const { state } = useExperienceContext();
  
  // Refs for the 4 nodes
  const emailRef = useRef<THREE.Mesh>(null);
  const linkedinRef = useRef<THREE.Mesh>(null);
  const githubRef = useRef<THREE.Mesh>(null);
  const resumeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!active) return;
    const time = _.clock.getElapsedTime();

    // Slow organic rotation and floating
    if (emailRef.current) {
      emailRef.current.rotation.x += delta * 0.2;
      emailRef.current.rotation.y += delta * 0.3;
      emailRef.current.position.y = 2 + Math.sin(time * 0.5) * 0.2;
    }
    if (linkedinRef.current) {
      linkedinRef.current.rotation.x += delta * 0.3;
      linkedinRef.current.rotation.y -= delta * 0.2;
      linkedinRef.current.position.y = 0.5 + Math.sin(time * 0.6 + 1) * 0.2;
    }
    if (githubRef.current) {
      githubRef.current.rotation.x -= delta * 0.2;
      githubRef.current.rotation.y += delta * 0.4;
      githubRef.current.position.y = -1 + Math.sin(time * 0.4 + 2) * 0.2;
    }
    if (resumeRef.current) {
      resumeRef.current.rotation.x += delta * 0.4;
      resumeRef.current.rotation.z += delta * 0.2;
      resumeRef.current.position.y = 3.5 + Math.sin(time * 0.7 + 3) * 0.2;
    }
  });

  if (!active) return null;

  const isActiveCmd = (cmd: string) => state.terminalCommand === cmd;

  const baseMetalness = 0.8;
  const baseRoughness = 0.2;
  const inactiveColor = "#222222";
  const activeColor = "#4ade80"; // Tailwind green-400
  const inactiveEmissive = "#000000";
  
  return (
    <group position={[4, 0, 0]}>
      {/* Node 1: Resume (Torus) */}
      <mesh ref={resumeRef} position={[0, 3.5, 0]}>
        <torusGeometry args={[0.5, 0.15, 16, 32]} />
        <meshStandardMaterial
          color={isActiveCmd("resume") ? activeColor : inactiveColor}
          emissive={isActiveCmd("resume") ? activeColor : inactiveEmissive}
          emissiveIntensity={isActiveCmd("resume") ? 0.8 : 0}
          metalness={baseMetalness}
          roughness={baseRoughness}
          wireframe={!isActiveCmd("resume")}
        />
      </mesh>

      {/* Node 2: Email (Octahedron) */}
      <mesh ref={emailRef} position={[0, 2, 0]}>
        <octahedronGeometry args={[0.6]} />
        <meshStandardMaterial
          color={isActiveCmd("email") ? activeColor : inactiveColor}
          emissive={isActiveCmd("email") ? activeColor : inactiveEmissive}
          emissiveIntensity={isActiveCmd("email") ? 0.8 : 0}
          metalness={baseMetalness}
          roughness={baseRoughness}
          wireframe={!isActiveCmd("email")}
        />
      </mesh>

      {/* Node 3: LinkedIn (Box) */}
      <mesh ref={linkedinRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color={isActiveCmd("linkedin") ? activeColor : inactiveColor}
          emissive={isActiveCmd("linkedin") ? activeColor : inactiveEmissive}
          emissiveIntensity={isActiveCmd("linkedin") ? 0.8 : 0}
          metalness={baseMetalness}
          roughness={baseRoughness}
          wireframe={!isActiveCmd("linkedin")}
        />
      </mesh>

      {/* Node 4: GitHub (Sphere) */}
      <mesh ref={githubRef} position={[0, -1, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={isActiveCmd("github") ? activeColor : inactiveColor}
          emissive={isActiveCmd("github") ? activeColor : inactiveEmissive}
          emissiveIntensity={isActiveCmd("github") ? 0.8 : 0}
          metalness={baseMetalness}
          roughness={baseRoughness}
          wireframe={!isActiveCmd("github")}
        />
      </mesh>
      
      {/* Connecting central beam when a command is active */}
      {state.terminalCommand && (
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 6, 8]} />
          <meshBasicMaterial color={activeColor} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
