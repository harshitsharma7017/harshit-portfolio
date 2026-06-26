"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTerminalTypingOptions {
  target: string;
  onComplete?: () => void;
  charDelay?: number;
}

export function useTerminalTyping({
  target,
  onComplete,
  charDelay = 80,
}: UseTerminalTypingOptions) {
  const [input, setInput] = useState("");
  const [matched, setMatched] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (matched) return;

      if (event.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
        return;
      }

      if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
        const next = input + event.key;
        setInput(next);

        if (next.toLowerCase() === target.toLowerCase()) {
          setMatched(true);
          onCompleteRef.current?.();
        }
      }
    },
    [input, matched, target]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { input, matched, charDelay };
}
