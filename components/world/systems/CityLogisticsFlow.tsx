"use client";

import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CITY_NODES } from "@/data/cityNodes";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { setInstanceMatrix } from "@/lib/three/instancing";

interface CityLogisticsFlowProps {
  active: boolean;
}

interface AutonomousPacket {
  progress: number;
  speed: number;
  start: THREE.Vector3;
  mid: THREE.Vector3; // Taxicab corner
  end: THREE.Vector3;
}

export function CityLogisticsFlow({ active }: CityLogisticsFlowProps) {
  const { state } = useExperienceContext();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const packets = useRef<AutonomousPacket[]>([]);

  // Prepare geometry and materials for autonomous traffic
  const geometry = useMemo(() => new THREE.BoxGeometry(0.15, 0.15, 0.3), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000",
        emissive: "#ffffff",
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
      }),
    []
  );

  // Initialize autonomous traffic
  useEffect(() => {
    const pool: AutonomousPacket[] = [];
    const count = 100; // 100 concurrent packets

    for (let i = 0; i < count; i++) {
      // Pick random start and end nodes
      const n1 = CITY_NODES[Math.floor(Math.random() * CITY_NODES.length)];
      let n2 = CITY_NODES[Math.floor(Math.random() * CITY_NODES.length)];
      while (n1.id === n2.id) {
        n2 = CITY_NODES[Math.floor(Math.random() * CITY_NODES.length)];
      }

      const start = new THREE.Vector3(...n1.position);
      const end = new THREE.Vector3(...n2.position);
      
      // Taxicab corner: either X first or Z first
      const mid = Math.random() > 0.5 
        ? new THREE.Vector3(end.x, 0, start.z)
        : new THREE.Vector3(start.x, 0, end.z);

      pool.push({
        progress: Math.random(),
        speed: 0.2 + Math.random() * 0.3,
        start,
        mid,
        end,
      });
    }
    packets.current = pool;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || !active) return;

    const hoveredId = state.hoverNodeId;
    // Fade out autonomous traffic when hovered
    const targetIntensity = hoveredId ? 0.05 : 0.8;
    material.emissiveIntensity += (targetIntensity - material.emissiveIntensity) * 0.1;
    material.opacity += ((hoveredId ? 0.1 : 0.9) - material.opacity) * 0.1;

    const pos = new THREE.Vector3();
    const dummy = new THREE.Object3D();

    packets.current.forEach((pkt, i) => {
      pkt.progress += pkt.speed * delta;
      
      if (pkt.progress >= 1.0) {
        pkt.progress = 0;
        // Assign new random path
        const n1 = CITY_NODES[Math.floor(Math.random() * CITY_NODES.length)];
        let n2 = CITY_NODES[Math.floor(Math.random() * CITY_NODES.length)];
        while (n1.id === n2.id) n2 = CITY_NODES[Math.floor(Math.random() * CITY_NODES.length)];
        pkt.start.set(...n1.position);
        pkt.end.set(...n2.position);
        pkt.mid.set(Math.random() > 0.5 ? pkt.end.x : pkt.start.x, 0, Math.random() > 0.5 ? pkt.start.z : pkt.end.z);
      }

      // Interpolate along taxicab path
      let lookTarget = new THREE.Vector3();
      if (pkt.progress < 0.5) {
        const localP = pkt.progress * 2;
        pos.lerpVectors(pkt.start, pkt.mid, localP);
        lookTarget.copy(pkt.mid);
      } else {
        const localP = (pkt.progress - 0.5) * 2;
        pos.lerpVectors(pkt.mid, pkt.end, localP);
        lookTarget.copy(pkt.end);
      }

      // Slightly above the recessed roads
      pos.y = -0.05;

      dummy.position.copy(pos);
      if (pos.distanceTo(lookTarget) > 0.01) {
        dummy.lookAt(lookTarget);
      }
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Calculate taxicab routes for hover dependencies
  const hoverRoutes = useMemo(() => {
    if (!state.hoverNodeId) return [];
    const sourceNode = CITY_NODES.find((n) => n.id === state.hoverNodeId);
    if (!sourceNode) return [];

    const routes: THREE.Vector3[][] = [];
    
    // Outbound connections
    sourceNode.connections.forEach((connId) => {
      const target = CITY_NODES.find((n) => n.id === connId);
      if (target) {
        routes.push([
          new THREE.Vector3(...sourceNode.position),
          new THREE.Vector3(target.position[0], 0, sourceNode.position[2]), // Midpoint
          new THREE.Vector3(...target.position)
        ]);
      }
    });

    // Inbound connections
    CITY_NODES.forEach((n) => {
      if (n.connections.includes(sourceNode.id)) {
        routes.push([
          new THREE.Vector3(...n.position),
          new THREE.Vector3(sourceNode.position[0], 0, n.position[2]), // Midpoint
          new THREE.Vector3(...sourceNode.position)
        ]);
      }
    });

    return routes;
  }, [state.hoverNodeId]);


  return (
    <group>
      {/* Autonomous traffic */}
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, 100]}
        frustumCulled={false}
      />

      {/* Hover dependency routes */}
      {hoverRoutes.map((routePts, idx) => (
        <Line
          key={`route-${idx}`}
          points={routePts.map(p => [p.x, -0.02, p.z])}
          color="#ffffff"
          transparent
          opacity={0.9}
          lineWidth={2.5}
        />
      ))}
    </group>
  );
}
