"use client";

interface TerminalMeshProps {
  position: [number, number, number];
  scale?: number;
  active?: boolean;
}

export function TerminalMesh({
  position,
  scale = 1,
  active = true,
}: TerminalMeshProps) {

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 1.6, 0.08]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[2.2, 1.3, 0.01]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[2.5, 0.06, 0.1]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
    </group>
  );
}
