"use client";

import { useEffect, useState } from "react";
import { BOOT_LOGS, BOOT_DURATION_MS } from "@/data/bootLogs";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";

export function BootTerminal() {
  const { state, setBootComplete, setBootLogIndex } = useExperienceContext();
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  useEffect(() => {
    if (state.bootComplete) return;

    const timers = BOOT_LOGS.map((log, index) =>
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, log.text]);
        setBootLogIndex(index + 1);
      }, log.delay)
    );

    const completeTimer = setTimeout(() => {
      setBootComplete(true);
    }, BOOT_DURATION_MS);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [setBootComplete, setBootLogIndex, state.bootComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  if (state.bootComplete && state.scrollProgress > 0.08) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-end p-8 md:p-16 pointer-events-none"
      style={{
        background: state.bootComplete ? "transparent" : "#0a0a0a",
        transition: "background 1.2s ease",
      }}
    >
      <div className="font-mono text-[13px] leading-[1.8] text-[#555555]">
        {visibleLines.map((line) => (
          <div key={line}>{line}</div>
        ))}
        <div className="flex items-center gap-1 text-[#ffffff]">
          <span>{showCursor ? "▋" : " "}</span>
        </div>
      </div>
    </div>
  );
}
