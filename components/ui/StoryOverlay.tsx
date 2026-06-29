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
    id: "backend",
    title: "02 / BACKEND DEVELOPMENT",
    paragraphs: [
      "I specialize in Node.js, Express, and Fastify backends using TypeScript.",
      "I design REST APIs with schema-level request validation, structured error handling, and consistent response contracts.",
      "My experience includes wiring up OAuth 2.0 and Firebase for secure authentication, and containerizing services with Docker and GitHub Actions CI/CD to automate deployments."
    ],
    metadata: "Node.js • Express • Fastify • JWT • OAuth • Docker",
    position: "bottom-left",
    animation: "slide",
    start: 0.11,
    end: 0.16,
  },
  {
    id: "database",
    title: "03 / DATA INFRASTRUCTURE",
    paragraphs: [
      "Good software depends on reliable data infrastructure.",
      "I have hands-on experience cutting response times on high-traffic endpoints by restructuring slow MongoDB and PostgreSQL aggregation pipelines.",
      "By adding targeted indexes and designing robust data ingestion pipelines, I ensure consistent integrity checks across multiple data sources."
    ],
    metadata: "MongoDB • PostgreSQL • Indexing • Performance Optimization",
    position: "bottom-left",
    animation: "fade-up",
    start: 0.25,
    end: 0.31,
  },
  {
    id: "eqas",
    title: "04 / EQASONLINE",
    subtitle: "Current Role: Full Stack Developer",
    paragraphs: [
      "I own the end-to-end backend for a laboratory proficiency testing platform used across multiple institutions.",
      "I designed the data model, API structure, and validation logic from the ground up to ensure robust operations.",
      "I also shipped a Handlebars-based report generation module that auto-produces formatted documents, eliminating previously manual reporting processes."
    ],
    metadata: "Production Platform • Automated Reports • Data Validation • Statistics Engine",
    position: "bottom-right",
    animation: "stagger",
    start: 0.41,
    end: 0.47,
  },
  {
    id: "citycore",
    title: "05 / CITYCORE",
    subtitle: "Founder & Full Stack Developer",
    paragraphs: [
      "CityCore is a Hyperlocal City Services Platform I built and shipped as the sole developer, currently serving 500+ users.",
      "The Node.js backend API runs under real daily load, handling multi-service traffic with zero-downtime releases via Vercel's edge network.",
      "I architected a modular, service-based backend allowing independent deployability for new service categories, and implemented JWT authentication with role-based access control (RBAC)."
    ],
    metadata: "Production Platform • Modular Architecture • 500+ Users • RBAC • JWT",
    position: "bottom-right",
    animation: "stagger",
    start: 0.57,
    end: 0.63,
  },
  {
    id: "projects",
    title: "06 / ENGINEERING PROJECTS",
    paragraphs: [
      "Beyond my professional work, I build products that solve practical problems.",
      { heading: "Task Management System", body: "Full-stack tracking app with JWT authentication and RBAC. I designed the schema-level data model to handle multi-user task ownership, keeping authorization logic clean and separate." },
      { heading: "AutoFunds", body: "An AI finance app using GPT-4 to parse plain-English expenses into categorized budgets. I engineered the server-side parsing logic to reliably extract structured data with robust fallback handling." }
    ],
    metadata: "OpenAI • Docker • GitHub Actions",
    position: "bottom-right",
    animation: "stagger",
    start: 0.73,
    end: 0.79,
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
    metadata: "harshit.sharma8532@gmail.com • 7017855982 • github.com/harshitsharma7017 • linkedin.com/in/harshit-sharma-462a762b5",
    position: "center",
    animation: "terminal",
    start: 0.88,
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
  let positionClasses = "absolute ";
  if (story.position === "center") {
    positionClasses += "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center items-center";
  } else if (story.position === "bottom-left") {
    positionClasses += "bottom-[env(safe-area-inset-bottom,2rem)] md:bottom-24 left-6 right-6 md:left-24 md:right-auto text-left items-start";
  } else if (story.position === "bottom-right") {
    positionClasses += "bottom-[env(safe-area-inset-bottom,2rem)] md:bottom-24 left-6 right-6 md:left-auto md:right-24 text-right items-end";
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
      <div className="text-[10px] md:text-xs tracking-[0.2em] text-white/40 uppercase mb-1 md:mb-2">
        {story.title}
      </div>
      
      {story.subtitle && (
        <div className="text-xs md:text-base font-semibold text-white/60 uppercase tracking-wide mb-1 md:mb-2">
          {story.subtitle}
        </div>
      )}

      <div className="flex flex-col gap-2 md:gap-4 text-base md:text-2xl font-medium text-white/90 leading-tight">
        {story.paragraphs?.map((p, idx) => (
          <div key={idx}>
            {typeof p === 'string' ? (
              <span className="whitespace-pre-line">{p}</span>
            ) : (
              <div className="flex flex-col gap-1 mt-1 md:mt-2">
                <span className="text-sm md:text-base font-bold text-white">{p.heading}</span>
                <span className="text-base md:text-xl text-white/80">{p.body}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-[8px] md:text-xs font-mono text-white/40 mt-2 md:mt-4">
        {story.metadata}
      </div>
      
      {story.animation === "terminal" && (
        <motion.span 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="inline-block w-4 h-6 bg-white/70 mt-2 md:mt-4 self-center"
        />
      )}
    </>
  );

  return (
    <motion.div
      className={`${positionClasses} flex flex-col gap-1 max-w-xl md:w-full bg-black/20 p-4 md:p-6 rounded-lg backdrop-blur-sm`}
      variants={variants[story.animation]}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {story.animation === "stagger" ? (
        <>
          <motion.div variants={childVariants.stagger} className="text-[10px] md:text-xs tracking-[0.2em] text-white/40 uppercase mb-1 md:mb-2">
            {story.title}
          </motion.div>
          {story.subtitle && (
            <motion.div variants={childVariants.stagger} className="text-xs md:text-base font-semibold text-white/60 uppercase tracking-wide mb-1 md:mb-2">
              {story.subtitle}
            </motion.div>
          )}
          <div className="flex flex-col gap-2 md:gap-4 text-base md:text-2xl font-medium text-white/90 leading-tight">
            {story.paragraphs?.map((p, idx) => (
              <motion.div key={idx} variants={childVariants.stagger}>
                {typeof p === 'string' ? (
                  <span className="whitespace-pre-line">{p}</span>
                ) : (
                  <div className="flex flex-col gap-1 mt-1 md:mt-2">
                    <span className="text-sm md:text-base font-bold text-white">{p.heading}</span>
                    <span className="text-base md:text-xl text-white/80">{p.body}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <motion.div variants={childVariants.stagger} className="text-[8px] md:text-xs font-mono text-white/40 mt-2 md:mt-4">
            {story.metadata}
          </motion.div>
        </>
      ) : (
        renderContent()
      )}
    </motion.div>
  );
}
