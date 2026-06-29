"use client";

import { useExperienceContext } from "@/components/providers/ExperienceProvider";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";

type Paragraph = string | { heading: string; body: string };

interface StoryContent {
  id: string;
  title: string;
  subtitle?: string;
  paragraphs: Paragraph[];
  metadata: string;
  position: "center" | "bottom-left" | "bottom-right";
  animation: "fade" | "slide" | "fade-up" | "stagger" | "terminal";
  start: number;
  end: number;
}

const STORY_DATA: StoryContent[] = [
  {
    id: "intro",
    title: "HARSHIT SHARMA",
    subtitle: "Full Stack Engineer",
    paragraphs: [
      "I specialize in building backend systems that power production applications.",
      "Over the past year I've designed APIs, optimized databases, automated business workflows, and built products used by real users."
    ],
    metadata: "Node.js • TypeScript • React • MongoDB • PostgreSQL",
    position: "center",
    animation: "fade",
    start: 0.08,
    end: 0.11,
  },
  {
    id: "backend",
    title: "02 / BACKEND DEVELOPMENT",
    paragraphs: [
      "This is where I create the most value.",
      "I design backend architectures that are secure, scalable, and maintainable—from authentication and validation to APIs, background jobs, and deployment.",
      "Every visual element in this scene represents the invisible systems that keep modern applications running."
    ],
    metadata: "Node.js • Express • Fastify • JWT • OAuth • Docker",
    position: "bottom-left",
    animation: "slide",
    start: 0.15,
    end: 0.20,
  },
  {
    id: "database",
    title: "03 / DATA INFRASTRUCTURE",
    paragraphs: [
      "Good software depends on good data.",
      "I design schemas, optimize aggregation pipelines, improve query performance, and build validation layers that keep production systems reliable under load."
    ],
    metadata: "MongoDB • PostgreSQL • Indexing • Performance Optimization",
    position: "bottom-left",
    animation: "fade-up",
    start: 0.29,
    end: 0.35,
  },
  {
    id: "eqas",
    title: "04 / EQASONLINE",
    subtitle: "Current Role",
    paragraphs: [
      "As a Full Stack Developer, I own the backend of a laboratory proficiency testing platform used across multiple institutions.",
      "I built automated report generation, data validation pipelines, production APIs, and statistical processing workflows that replaced manual operations."
    ],
    metadata: "Production Platform • Automated Reports • Data Validation • Statistics Engine",
    position: "bottom-right",
    animation: "stagger",
    start: 0.45,
    end: 0.51,
  },
  {
    id: "citycore",
    title: "05 / CITYCORE",
    subtitle: "Founder & Full Stack Developer",
    paragraphs: [
      "CityCore is my largest engineering project.",
      "I designed the architecture, developed the complete platform, and deployed it independently.",
      "Today it connects shops, hospitals, drivers, restaurants, and local services through one modular backend serving 500+ users."
    ],
    metadata: "Production Platform • Modular Architecture • 500+ Users • RBAC • JWT",
    position: "bottom-left",
    animation: "stagger",
    start: 0.61,
    end: 0.67,
  },
  {
    id: "projects",
    title: "06 / ENGINEERING PROJECTS",
    paragraphs: [
      "Beyond my professional work, I enjoy building products that solve practical problems.",
      { heading: "Task Manager", body: "Multi-user task management with JWT authentication, role-based access control, and real-time collaboration." },
      { heading: "AutoFunds", body: "An AI-powered finance assistant that converts natural language into structured financial insights using GPT." }
    ],
    metadata: "OpenAI • Docker • GitHub Actions",
    position: "bottom-right",
    animation: "stagger",
    start: 0.77,
    end: 0.83,
  },
  {
    id: "contact",
    title: "07 / LET'S BUILD",
    paragraphs: [
      "Everything you've seen represents how I approach engineering:",
      "Build reliable systems.\nSolve real problems.\nShip production software.",
      "If you're looking for a backend-focused full stack engineer who enjoys building products from the ground up, I'd love to talk."
    ],
    subtitle: "Harshit Sharma — Full Stack Engineer",
    metadata: "harshit.sharma8532@gmail.com • 7017855982",
    position: "center",
    animation: "terminal",
    start: 0.92,
    end: 1.00,
  }
];

export function StoryOverlay() {
  const { state } = useExperienceContext();
  const [activeStory, setActiveStory] = useState<StoryContent | null>(null);

  useEffect(() => {
    const p = state.scrollProgress;
    const current = STORY_DATA.find(story => p >= story.start && p <= story.end);
    setActiveStory(current || null);
  }, [state.scrollProgress]);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex h-full w-full">
      <AnimatePresence mode="wait">
        {activeStory && (
          <StoryBlock key={activeStory.id} story={activeStory} />
        )}
      </AnimatePresence>
    </div>
  );
}

function StoryBlock({ story }: { story: StoryContent }) {
  // Positioning classes
  let positionClasses = "absolute ";
  if (story.position === "center") {
    positionClasses += "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center items-center";
  } else if (story.position === "bottom-left") {
    positionClasses += "bottom-24 left-12 md:left-24 text-left items-start";
  } else if (story.position === "bottom-right") {
    positionClasses += "bottom-24 right-12 md:right-24 text-right items-end";
  }

  // Animation variants
  const variants: Record<string, Variants> = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 1, ease: "easeOut" } },
      exit: { opacity: 0, transition: { duration: 0.8, ease: "easeIn" } }
    },
    slide: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0, transition: { duration: 1.2, ease: "easeOut" } },
      exit: { opacity: 0, x: -20, transition: { duration: 0.8, ease: "easeIn" } }
    },
    "fade-up": {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
      exit: { opacity: 0, y: 20, transition: { duration: 0.8, ease: "easeIn" } }
    },
    stagger: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { staggerChildren: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.5 } }
    },
    terminal: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } },
      exit: { opacity: 0, transition: { duration: 1.0 } }
    }
  };

  const childVariants: Record<string, Variants> = {
    stagger: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
      exit: { opacity: 0 }
    }
  };

  const renderContent = () => (
    <>
      <div className="text-xs tracking-[0.2em] text-white/40 uppercase mb-2">
        {story.title}
      </div>
      
      {story.subtitle && (
        <div className="text-sm md:text-base font-semibold text-white/60 uppercase tracking-wide mb-2">
          {story.subtitle}
        </div>
      )}

      <div className="flex flex-col gap-4 text-xl md:text-2xl font-medium text-white/90 leading-tight">
        {story.paragraphs?.map((p, idx) => (
          <div key={idx}>
            {typeof p === 'string' ? (
              <span className="whitespace-pre-line">{p}</span>
            ) : (
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-base font-bold text-white">{p.heading}</span>
                <span className="text-lg md:text-xl text-white/80">{p.body}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-[10px] md:text-xs font-mono text-white/40 mt-4">
        {story.metadata}
      </div>
      
      {story.animation === "terminal" && (
        <motion.span 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="inline-block w-4 h-6 bg-white/70 mt-4 self-center"
        />
      )}
    </>
  );

  return (
    <motion.div
      className={`${positionClasses} flex flex-col gap-1 max-w-xl w-full bg-black/20 p-6 rounded-lg backdrop-blur-sm`}
      variants={variants[story.animation]}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {story.animation === "stagger" ? (
        <>
          <motion.div variants={childVariants.stagger} className="text-xs tracking-[0.2em] text-white/40 uppercase mb-2">
            {story.title}
          </motion.div>
          {story.subtitle && (
            <motion.div variants={childVariants.stagger} className="text-sm md:text-base font-semibold text-white/60 uppercase tracking-wide mb-2">
              {story.subtitle}
            </motion.div>
          )}
          <div className="flex flex-col gap-4 text-xl md:text-2xl font-medium text-white/90 leading-tight">
            {story.paragraphs?.map((p, idx) => (
              <motion.div key={idx} variants={childVariants.stagger}>
                {typeof p === 'string' ? (
                  <span className="whitespace-pre-line">{p}</span>
                ) : (
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-base font-bold text-white">{p.heading}</span>
                    <span className="text-lg md:text-xl text-white/80">{p.body}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <motion.div variants={childVariants.stagger} className="text-[10px] md:text-xs font-mono text-white/40 mt-4">
            {story.metadata}
          </motion.div>
        </>
      ) : (
        renderContent()
      )}
    </motion.div>
  );
}
