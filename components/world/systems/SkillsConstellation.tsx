"use client";

import { useCallback, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { CollectionCluster } from "@/components/world/systems/CollectionCluster";
import { RelationshipBridges, type BridgeEdge } from "@/components/world/systems/RelationshipBridges";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";

// ---------------------------------------------------------------------------
// Skill data
// ---------------------------------------------------------------------------
interface SkillCategory {
  id: string;
  label: string;
  center: [number, number, number];
  radius: number;
  activityLevel: number;
  connections: string[];
  skills: string[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "languages",
    label: "Languages",
    center: [0, 1.5, -2],
    radius: 2.2,
    activityLevel: 0.85,
    connections: ["backend", "frontend"],
    skills: ["JavaScript (ES6+)", "TypeScript", "Python", "Java"],
  },
  {
    id: "backend",
    label: "Backend",
    center: [-5.5, 0.5, -4],
    radius: 2.0,
    activityLevel: 0.9,
    connections: ["languages", "databases", "devops"],
    skills: ["Node.js", "Express.js", "Fastify", "REST API Design"],
  },
  {
    id: "frontend",
    label: "Frontend",
    center: [5.5, 1, -3],
    radius: 1.6,
    activityLevel: 0.7,
    connections: ["languages", "auth"],
    skills: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    id: "databases",
    label: "Databases",
    center: [-4, -1.5, -7],
    radius: 1.5,
    activityLevel: 0.75,
    connections: ["backend", "devops"],
    skills: ["MongoDB", "PostgreSQL", "MySQL"],
  },
  {
    id: "devops",
    label: "DevOps & Cloud",
    center: [4, -0.5, -10],
    radius: 1.3,
    activityLevel: 0.6,
    connections: ["backend", "databases", "auth"],
    skills: ["Docker", "GitHub Actions", "Vercel", "Firebase", "AWS"],
  },
  {
    id: "auth",
    label: "Auth & Security",
    center: [7.5, 2, -5],
    radius: 1.0,
    activityLevel: 0.65,
    connections: ["backend", "frontend", "devops"],
    skills: ["JWT", "OAuth 2.0", "RBAC"],
  },
  {
    id: "tools",
    label: "Tools",
    center: [-1, -2, -1],
    radius: 0.8,
    activityLevel: 0.4,
    connections: ["languages", "backend"],
    skills: ["Git", "GitHub", "Postman"],
  },
];

const CATEGORY_INDEX: Record<string, number> = {};
SKILL_CATEGORIES.forEach((c, i) => { CATEGORY_INDEX[c.id] = i; });

// ---------------------------------------------------------------------------
// Bridge edges
// ---------------------------------------------------------------------------
function buildEdges(categories: SkillCategory[]): BridgeEdge[] {
  const edges: BridgeEdge[] = [];
  const seen = new Set<string>();
  categories.forEach((cat) => {
    cat.connections.forEach((connId) => {
      const key = [cat.id, connId].sort().join("-");
      if (seen.has(key)) return;
      seen.add(key);
      const target = categories.find((c) => c.id === connId);
      if (!target) return;
      edges.push({
        key,
        from: cat.center,
        to: target.center,
        frequency: 0.3 + (cat.activityLevel + target.activityLevel) * 0.35,
      });
    });
  });
  return edges;
}
const EDGES = buildEdges(SKILL_CATEGORIES);

// ---------------------------------------------------------------------------
// Scroll → highlighted category (skills story spans 0.83 → 0.89)
// ---------------------------------------------------------------------------
const SKILLS_START = 0.83;
const SKILLS_END   = 0.89;

function getHighlightedCategory(scrollProgress: number): string | null {
  if (scrollProgress < SKILLS_START || scrollProgress > SKILLS_END) return null;
  const t = (scrollProgress - SKILLS_START) / (SKILLS_END - SKILLS_START);
  const idx = Math.min(SKILL_CATEGORIES.length - 1, Math.floor(t * SKILL_CATEGORIES.length));
  return SKILL_CATEGORIES[idx].id;
}

// ---------------------------------------------------------------------------
// Fibonacci sphere — even distribution of n points on a unit sphere of radius r
// ---------------------------------------------------------------------------
function fibonacciSphere(count: number, r: number): THREE.Vector3[] {
  if (count === 1) return [new THREE.Vector3(0, 0, 0)];
  const phi = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const rr = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    return new THREE.Vector3(Math.cos(theta) * rr * r, y * r, Math.sin(theta) * rr * r);
  });
}

// ---------------------------------------------------------------------------
// Flat list of all skill spheres built at module scope (stable)
// ---------------------------------------------------------------------------
interface SkillSphereData {
  name: string;
  categoryIdx: number;
  categoryId: string;
  restPos: THREE.Vector3;   // world-space cluster center + fibonacci offset
  size: number;
  phase: number;
  orbitSpeed: number;
}

const ALL_SKILL_SPHERES: SkillSphereData[] = [];

SKILL_CATEGORIES.forEach((cat, catIdx) => {
  const shellRadius = cat.radius * 0.62;
  const offsets = fibonacciSphere(cat.skills.length, shellRadius);
  const center = new THREE.Vector3(...cat.center);

  cat.skills.forEach((name, i) => {
    ALL_SKILL_SPHERES.push({
      name,
      categoryIdx: catIdx,
      categoryId: cat.id,
      restPos: center.clone().add(offsets[i]),
      size: 0.065 + (i % 3) * 0.018 + (catIdx % 2) * 0.01,
      phase: (catIdx * 2.1 + i * 1.7) % (Math.PI * 2),
      orbitSpeed: 0.18 + (i % 4) * 0.055,
    });
  });
});

// ---------------------------------------------------------------------------
// Single sphere + label — animated by parent's useFrame via groupRef
// ---------------------------------------------------------------------------
interface SkillSphereItemProps {
  data: SkillSphereData;
  groupRefCb: (el: THREE.Group | null) => void;
  matRefCb: (el: THREE.MeshStandardMaterial | null) => void;
}

function SkillSphereItem({ data, groupRefCb, matRefCb }: SkillSphereItemProps) {
  return (
    <group ref={groupRefCb}>
      <mesh>
        <sphereGeometry args={[data.size, 8, 8]} />
        <meshStandardMaterial
          ref={matRefCb}
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.2}
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>
      {/* Label sits above the sphere; troika Text billboards to camera by default */}
      <Text
        position={[0, data.size + 0.12, 0]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
        fillOpacity={0.75}
        maxWidth={1.5}
        textAlign="center"
      >
        {data.name}
      </Text>
    </group>
  );
}

// ---------------------------------------------------------------------------
// SkillsSphereField — orchestrates all 24 sphere+label objects
// ---------------------------------------------------------------------------
function SkillsSphereField({ active, highlightedCatId }: {
  active: boolean;
  highlightedCatId: string | null;
}) {
  const timeRef = useRef(0);

  // One ref per sphere: group (position) + material (emissive)
  const groupRefs = useRef<(THREE.Group | null)[]>(
    ALL_SKILL_SPHERES.map(() => null)
  );
  const matRefs = useRef<(THREE.MeshStandardMaterial | null)[]>(
    ALL_SKILL_SPHERES.map(() => null)
  );

  const setGroupRef = useMemo(
    () => ALL_SKILL_SPHERES.map((_, i) => (el: THREE.Group | null) => {
      groupRefs.current[i] = el;
    }),
    []
  );
  const setMatRef = useMemo(
    () => ALL_SKILL_SPHERES.map((_, i) => (el: THREE.MeshStandardMaterial | null) => {
      matRefs.current[i] = el;
    }),
    []
  );

  const highlightedIdx =
    highlightedCatId !== null ? (CATEGORY_INDEX[highlightedCatId] ?? -1) : -1;

  useFrame((_, delta) => {
    if (!active) return;
    timeRef.current += delta;
    const t = timeRef.current;

    ALL_SKILL_SPHERES.forEach((sphere, i) => {
      const group = groupRefs.current[i];
      const mat = matRefs.current[i];
      if (!group) return;

      // Gentle float drift — 3-axis sinusoidal
      const driftX = Math.sin(t * sphere.orbitSpeed + sphere.phase) * 0.22;
      const driftY = Math.cos(t * sphere.orbitSpeed * 0.7 + sphere.phase + 1.0) * 0.16;
      const driftZ = Math.sin(t * sphere.orbitSpeed * 0.5 + sphere.phase + 2.3) * 0.10;

      group.position.set(
        sphere.restPos.x + driftX,
        sphere.restPos.y + driftY,
        sphere.restPos.z + driftZ
      );

      if (!mat) return;
      const isHighlighted = highlightedIdx !== -1 && sphere.categoryIdx === highlightedIdx;
      const basePulse = 0.5 + 0.5 * Math.sin(t * 0.9 + sphere.phase);
      mat.emissiveIntensity = isHighlighted
        ? 2.4 + basePulse * 0.8
        : highlightedIdx === -1
          ? 1.0 + basePulse * 0.35
          : 0.25 + basePulse * 0.12;
    });
  });

  if (!active) return null;

  return (
    <group>
      {ALL_SKILL_SPHERES.map((sphere, i) => (
        <SkillSphereItem
          key={`${sphere.categoryId}-${sphere.name}`}
          data={sphere}
          groupRefCb={setGroupRef[i]}
          matRefCb={setMatRef[i]}
        />
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// SkillsConstellation — exported root component
// ---------------------------------------------------------------------------
interface SkillsConstellationProps {
  active: boolean;
}

export function SkillsConstellation({ active }: SkillsConstellationProps) {
  const { state } = useExperienceContext();
  const indexRingTriggers = useRef<Map<string, () => void>>(new Map());

  const handleRegisterTrigger = useCallback(
    (id: string, trigger: () => void) => {
      indexRingTriggers.current.set(id, trigger);
    },
    []
  );

  const highlightedCatId = getHighlightedCategory(state.scrollProgress);

  return (
    <group>
      {SKILL_CATEGORIES.map((cat) => (
        <CollectionCluster
          key={cat.id}
          id={cat.id}
          position={cat.center}
          radius={cat.radius}
          activityLevel={cat.activityLevel}
          onRegisterTrigger={handleRegisterTrigger}
        />
      ))}
      <RelationshipBridges edges={EDGES} active={active} />
      <SkillsSphereField active={active} highlightedCatId={highlightedCatId} />
    </group>
  );
}
