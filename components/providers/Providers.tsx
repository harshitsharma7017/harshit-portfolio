"use client";

import { ExperienceProvider } from "./ExperienceProvider";
import { GSAPProvider } from "./GSAPProvider";
import { LenisProvider } from "./LenisProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ExperienceProvider>
      <LenisProvider>
        <GSAPProvider>{children}</GSAPProvider>
      </LenisProvider>
    </ExperienceProvider>
  );
}
