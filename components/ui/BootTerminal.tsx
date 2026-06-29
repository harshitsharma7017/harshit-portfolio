"use client";

import { useEffect, useState } from "react";
import { BOOT_LOGS, BOOT_DURATION_MS } from "@/data/bootLogs";
import { useExperienceContext } from "@/components/providers/ExperienceProvider";

export function BootTerminal() {
  const { state, setBootComplete, setBootLogIndex } = useExperienceContext();
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [progress, setProgress] = useState(0);

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

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Progress bar calculation
  useEffect(() => {
    if (state.bootComplete) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(100, (elapsed / BOOT_DURATION_MS) * 100);
      setProgress(p);
      if (p >= 100) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [state.bootComplete]);

  if (state.bootComplete && state.scrollProgress > 0.08) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-20 pointer-events-none"
      style={{
        background: state.bootComplete ? "transparent" : "#0a0a0a",
        transition: "background 1.2s ease",
      }}
    >
      {/* Central Progress Loader */}
      {!state.bootComplete && (
        <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
          <div className="text-white/60 text-xs md:text-sm tracking-[0.3em] mb-6 uppercase">
            Initializing System
          </div>
          <div className="w-48 md:w-64 h-[2px] bg-white/10 relative overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-white transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-6 text-white/40 text-[10px] md:text-xs tracking-widest">
            {progress.toFixed(1)}%
          </div>
        </div>
      )}

      {/* Terminal Logs (Bottom Left) */}
      <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 font-mono text-[11px] md:text-[13px] leading-[1.8] text-white/40">
        {visibleLines.map((line) => (
          <div key={line}>{line}</div>
        ))}
        <div className="flex items-center gap-1 text-white/80">
          <span>{showCursor ? "▋" : " "}</span>
        </div>
      </div>
    </div>
  );
}
