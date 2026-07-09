"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { CITY_NODES } from "@/data/cityNodes";

interface CityGroundGridProps {
  active: boolean;
}

export function CityGroundGrid({ active }: CityGroundGridProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Procedural city grid setup
  const gridSize = 40; // 40x40 grid for massive scale
  const cellSize = 1.2;
  const gap = 0.4;
  const totalCell = cellSize + gap;

  // We want to avoid placing background blocks where landmark nodes exist
  const landmarkPositions = useMemo(() => {
    return CITY_NODES.map((n) => new THREE.Vector2(n.position[0], n.position[2]));
  }, []);

  const blockData = useMemo(() => {
    const blocks: { position: [number, number, number]; scale: [number, number, number] }[] = [];
    
    for (let x = -gridSize / 2; x < gridSize / 2; x++) {
      for (let z = -gridSize / 2; z < gridSize / 2; z++) {
        const posX = x * totalCell;
        const posZ = z * totalCell;
        
        // Check distance to landmarks to leave space
        let tooClose = false;
        for (const lp of landmarkPositions) {
          if (Math.hypot(posX - lp.x, posZ - lp.y) < 3.0) { // Large negative space around districts
            tooClose = true;
            break;
          }
        }

        if (!tooClose) {
          // Randomize block heights to create urban landscape feel
          // Taller in clusters to form a distinct skyline
          const distFromCenter = Math.hypot(posX, posZ);
          
          let maxH = 0.2;
          if (distFromCenter > 5 && distFromCenter < 12) {
            // Mid-range skyline
            maxH = 2.0 + Math.random() * 2.0;
          } else if (distFromCenter >= 12 && distFromCenter < 25) {
            // Distant towering silhouettes
            maxH = 1.0 + Math.random() * 4.0;
            // Occasional massive towers
            if (Math.random() > 0.95) maxH += 3.0; 
          } else {
            // Outskirts
            maxH = Math.max(0.1, 1.0 - (distFromCenter - 25) * 0.1);
          }

          const h = 0.1 + Math.random() * maxH;
          blocks.push({
            position: [posX, h / 2, posZ],
            scale: [cellSize, h, cellSize],
          });
        }
      }
    }
    return blocks;
  }, [totalCell, landmarkPositions]);

  // Set instance matrices
  useMemo(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    blockData.forEach((block, i) => {
      dummy.position.set(...block.position);
      dummy.scale.set(...block.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [blockData]);


  return (
    <group visible={active}>
      {/* Base plane acting as the recessed road network */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial
          color="#060606"
          roughness={0.98}
          metalness={0.05}
        />
      </mesh>

      {/* Instanced background city blocks */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, blockData.length]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.92}
          metalness={0.12}
        />
      </instancedMesh>
    </group>
  );
}
