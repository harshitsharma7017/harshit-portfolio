"use client";

import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export function HeroIntroduction() {
  const { state } = useExperienceContext();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle Parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // max 20px shift
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    
    if (state.bootComplete && state.scrollProgress === 0) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [state.bootComplete, state.scrollProgress]);

  // If we've scrolled past the introduction zone, unmount.
  if (state.scrollProgress > 0.08) return null;

  // Calculate dissolve opacity on scroll
  const scrollDissolveOpacity = Math.max(0, 1 - state.scrollProgress / 0.08);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      },
    },
  };

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const fadeVariant = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 1 } },
  };

  const portraitVariant: Variants = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 1.2, ease: "easeOut" } },
  };

  const facts = [
    "1.5+ Years Experience",
    "Backend Specialist",
    "Production Systems",
    "2 Startup Experiences"
  ];

  const techStack = [
    "Node.js", "TypeScript", "React", "MongoDB", "PostgreSQL", "Docker", "AWS"
  ];

  return (
    <AnimatePresence>
      {state.bootComplete && (
        <motion.div
          className="fixed inset-0 z-10 flex flex-col md:flex-row w-full h-full pointer-events-none"
          style={{ opacity: scrollDissolveOpacity }}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          {/* Content (100% on mobile, 55% on desktop) */}
          <motion.div 
            className="w-full md:w-[55%] lg:w-[50%] h-1/2 md:h-full flex flex-col justify-center pr-6 pt-12 md:pr-12 md:pt-0 z-20"
            style={{ paddingLeft: "clamp(1rem, 4vw, 4rem)" }}
            variants={containerVariants}
          >
            <motion.h1 
              variants={fadeVariant}
              className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.15em] md:tracking-[0.2em] text-white uppercase mb-2 md:mb-4 break-words"
            >
              Harshit Sharma
            </motion.h1>
            
            <motion.h2 
              variants={fadeVariant}
              className="text-sm md:text-lg text-white/60 font-semibold uppercase tracking-widest mb-4 md:mb-6"
            >
              Full Stack Engineer
            </motion.h2>
            
            <motion.p 
              variants={fadeVariant}
              className="text-sm md:text-base text-white/80 max-w-2xl leading-relaxed mb-6 md:mb-10"
            >
              Backend-focused developer passionate about building scalable systems, production APIs, and modern web applications.
            </motion.p>
            
            <div className="flex flex-col gap-2 md:gap-3 mb-6 md:mb-10">
              {facts.map((fact, index) => (
                <motion.div key={index} variants={fadeUpVariant} className="flex items-center gap-3 md:gap-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="text-white/80 text-xs md:text-sm">{fact}</span>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeVariant} className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-16">
              {techStack.map((tech, i) => (
                <span key={i} className="text-[9px] md:text-xs font-mono text-white/40 px-2 py-1 md:px-3 md:py-1 border border-white/10 rounded">
                  {tech}
                </span>
              ))}
            </motion.div>
            
            <motion.div 
              variants={fadeVariant}
              className="mt-auto mb-8 md:mb-16 hidden md:block"
            >
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-xs font-mono tracking-widest text-white/40 uppercase"
              >
                ↓ Explore My Engineering Journey
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Portrait (100% on mobile, 45% on desktop) */}
          <motion.div 
            className="w-full md:w-[45%] h-1/2 md:h-full relative flex items-end md:items-center justify-center overflow-hidden pointer-events-none"
            variants={portraitVariant}
          >
            {/* Parallax Wrapper */}
            <motion.div
              className="relative w-full h-[80%] max-w-3xl"
              animate={{
                x: -mousePosition.x,
                y: -mousePosition.y,
              }}
              transition={{ type: "spring", damping: 30, stiffness: 100 }}
            >
              {/* Subtle floating animation on the image itself */}
              <motion.div
                className="w-full h-full relative"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <Image 
                  src="/harshit_portrait.png" 
                  alt="Harshit Sharma Portrait"
                  fill
                  priority
                  className="object-contain mix-blend-lighten"
                  style={{
                    filter: "drop-shadow(0 0 40px rgba(255,255,255,0.05))"
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
