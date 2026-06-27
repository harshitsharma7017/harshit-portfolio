"use client";

import { BootZone } from "./zones/BootZone";
import { BackendZone } from "./zones/BackendZone";
import { DatabaseZone } from "./zones/DatabaseZone";
import { EqasOnlineZone } from "./zones/EqasOnlineZone";
import { CityCoreZone } from "./zones/CityCoreZone";
import { ProjectsZone } from "./zones/ProjectsZone";
import { ContactZone } from "./zones/ContactZone";
import { WorldLighting } from "./lighting/WorldLighting";

export function World() {
  return (
    <>
      <WorldLighting />
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 25, 60]} />
      <BootZone />
      <BackendZone />
      <DatabaseZone />
      <EqasOnlineZone />
      <CityCoreZone />
      <ProjectsZone />
      <ContactZone />
    </>
  );
}
