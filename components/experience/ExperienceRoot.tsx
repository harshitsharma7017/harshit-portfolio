"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ScrollTrack } from "./ScrollTrack";
import { BootTerminal } from "@/components/ui/BootTerminal";
import { ZoneCaption } from "@/components/ui/ZoneCaption";
import { ScrollHint } from "@/components/ui/ScrollHint";
import { ProjectTerminal } from "@/components/ui/ProjectTerminal";
import { ContactTerminal } from "@/components/ui/ContactTerminal";
import { MobileExperience } from "@/components/ui/MobileExperience";
import { useIsMobile, useReducedMotion } from "@/components/hooks/useExperienceState";

const CanvasWorld = dynamic(
  () => import("./CanvasWorld").then((mod) => mod.CanvasWorld),
  { ssr: false }
);

export function ExperienceRoot() {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  if (isMobile || reducedMotion) {
    return <MobileExperience />;
  }

  return (
    <div className="experience-root">
      <div className="canvas-layer">
        <Suspense fallback={null}>
          <CanvasWorld />
        </Suspense>
      </div>

      <div className="ui-layer">
        <BootTerminal />
        <ZoneCaption />
        <ScrollHint />
        <ProjectTerminal />
        <ContactTerminal />
      </div>

      <ScrollTrack />
    </div>
  );
}
