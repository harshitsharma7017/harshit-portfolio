"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";

interface ContactTerminalProps {
  active: boolean;
}

export function ContactTerminal({ active }: ContactTerminalProps) {
  const [phase, setPhase] = useState<number>(0);
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  
  const fullText = [
    "$ hire harshit",
    "",
    "Connecting...",
    "",
    "Production experience detected ✓",
    "Backend systems ✓",
    "Problem solving ✓",
    "Deployment ready ✓",
    "",
    "Connection established.",
  ].join("\n");

  const timeRef = useRef(0);
  const textIndexRef = useRef(0);
  const typeTimerRef = useRef(0);

  // Phases:
  // 0: Initial wait (3s)
  // 1: Typing main sequence
  // 2: Revealing contact info (fades)
  // 3: Final message

  useEffect(() => {
    if (!active) {
      setPhase(0);
      setTypedText("");
      textIndexRef.current = 0;
      timeRef.current = 0;
      return;
    }
  }, [active]);

  useFrame((_, delta) => {
    if (!active) return;
    timeRef.current += delta;

    // Blinking cursor
    if (Math.floor(timeRef.current * 2) % 2 === 0) {
      setCursorVisible(true);
    } else {
      setCursorVisible(false);
    }

    if (phase === 0) {
      if (timeRef.current > 3.0) {
        setPhase(1);
        typeTimerRef.current = timeRef.current;
      }
    } else if (phase === 1) {
      const elapsed = timeRef.current - typeTimerRef.current;
      // Typewriter speed: roughly 20 chars per second, but we can do it based on elapsed
      const targetLength = Math.floor(elapsed * 25);
      
      if (textIndexRef.current < targetLength) {
        textIndexRef.current = targetLength;
        if (textIndexRef.current >= fullText.length) {
          setTypedText(fullText);
          setPhase(2);
          typeTimerRef.current = timeRef.current;
        } else {
          setTypedText(fullText.substring(0, textIndexRef.current));
        }
      }
    } else if (phase === 2) {
      // Fade in contact links over 4 seconds
      if (timeRef.current - typeTimerRef.current > 4.5) {
        setPhase(3);
        typeTimerRef.current = timeRef.current;
      }
    }
  });

  // Fade calculation for contact info
  const linkFade = (delay: number) => {
    if (phase < 2) return 0;
    const t = timeRef.current - typeTimerRef.current - delay;
    return Math.max(0, Math.min(1, t));
  };


  return (
    <group position={[0, 0, 0]} visible={active}>
      {/* Monumental glass terminal screen */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[10, 6]} />
        <meshPhysicalMaterial
          color="#050505"
          metalness={0.9}
          roughness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Screen Bezel */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[10.2, 6.2, 0.05]} />
        <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Console Text Container */}
      <group position={[-4.5, 2.2, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="left"
          anchorY="top"
          font="https://fonts.gstatic.com/s/robotomono/v22/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vrtSM1J-gEPOU_is15wU2k.woff" // Roboto Mono
          maxWidth={9}
          lineHeight={1.4}
        >
          {typedText}
          {phase < 3 ? (cursorVisible ? "█" : "") : ""}
        </Text>
      </group>

      {/* Contact Links (Fade in sequentially during phase 2) */}
      <group position={[-4.5, -0.2, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.22} color="#ffffff" anchorX="left" anchorY="top" fillOpacity={linkFade(0)}>
          Email: harshit@example.com
        </Text>
        <Text position={[0, -0.4, 0]} fontSize={0.22} color="#ffffff" anchorX="left" anchorY="top" fillOpacity={linkFade(0.8)}>
          GitHub: github.com/harshit
        </Text>
        <Text position={[0, -0.8, 0]} fontSize={0.22} color="#ffffff" anchorX="left" anchorY="top" fillOpacity={linkFade(1.6)}>
          LinkedIn: linkedin.com/in/harshit
        </Text>
        <Text position={[0, -1.2, 0]} fontSize={0.22} color="#ffffff" anchorX="left" anchorY="top" fillOpacity={linkFade(2.4)}>
          Resume: View PDF
        </Text>
      </group>

      {/* Final Message */}
      <group position={[-4.5, -2.2, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="left"
          anchorY="top"
          fillOpacity={phase === 3 ? 1 : 0}
          font="https://fonts.gstatic.com/s/robotomono/v22/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vrtSM1J-gEPOU_is15wU2k.woff"
        >
          {phase === 3 ? `Thank you for visiting.\n${cursorVisible ? "█" : ""}` : ""}
        </Text>
      </group>
    </group>
  );
}
