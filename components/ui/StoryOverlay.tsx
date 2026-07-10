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
    title: "01 / BACKEND DEVELOPMENT",
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
    title: "02 / DATA INFRASTRUCTURE",
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
    title: "03 / EQASONLINE",
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
    title: "04 / CITYCORE",
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
    title: "05 / ENGINEERING PROJECTS",
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
    id: "skills",
    title: "06 / SKILLS",
    paragraphs: [
      { heading: "Languages", body: "JavaScript (ES6+) • TypeScript • Python • Java" },
      { heading: "Backend", body: "Node.js • Express.js • Fastify • REST API Design" },
      { heading: "Frontend", body: "React • Next.js • Tailwind CSS" },
      { heading: "Databases", body: "MongoDB • PostgreSQL • MySQL" },
      { heading: "DevOps & Cloud", body: "Docker • GitHub Actions (CI/CD) • Vercel • Firebase • AWS" },
      { heading: "Auth & Security", body: "JWT • OAuth 2.0 • Role-Based Access Control (RBAC)" },
      { heading: "Tools", body: "Git • GitHub • Postman" },
    ],
    metadata: "Full Stack • Production Systems • Cloud-Native",
    position: "bottom-left",
    animation: "stagger",
    start: 0.84,
    end: 0.88,
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
    position: "bottom-left",
    animation: "terminal",
    start: 0.93,
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
  const { state } = useExperienceContext();
  
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

  if (story.id === "contact") {
    return (
      <motion.div
        className="fixed inset-0 w-full h-full pointer-events-none"
        variants={variants[story.animation]}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <ContactTerminalUI />
      </motion.div>
    );
  }

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
          <div className="flex flex-col gap-2 md:gap-3 text-base md:text-2xl font-medium text-white/90 leading-tight">
            {story.paragraphs?.map((p, idx) => (
              <motion.div key={idx} variants={childVariants.stagger}>
                {typeof p === 'string' ? (
                  <span className="whitespace-pre-line">{p}</span>
                ) : story.id === 'skills' ? (
                  // Skills-specific chip layout
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-[10px] md:text-xs font-semibold text-white/50 uppercase tracking-[0.15em]">{p.heading}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {p.body.split('•').map((chip, cIdx) => (
                        <motion.span
                          key={cIdx}
                          variants={childVariants.stagger}
                          className="inline-block text-[11px] md:text-sm font-medium text-white/80 bg-white/8 border border-white/15 rounded-md px-2 py-0.5 leading-normal"
                        >
                          {chip.trim()}
                        </motion.span>
                      ))}
                    </div>
                  </div>
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

function ContactTerminalUI() {
  const { state, setTerminalCommand } = useExperienceContext();
  const [inputValue, setInputValue] = useState("");

  const commands = [
    { cmd: "email", desc: "Get my email address" },
    { cmd: "linkedin", desc: "View my LinkedIn profile" },
    { cmd: "github", desc: "View my GitHub profile" },
    { cmd: "resume", desc: "Download my resume" },
  ];

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputValue.trim().toLowerCase();
    if (commands.find((c) => c.cmd === cmd)) {
      if (cmd === "linkedin") window.open("https://www.linkedin.com/in/harshit-sharma-backend-developer", "_blank");
      if (cmd === "github") window.open("https://github.com/harshitsharma7017", "_blank");
      if (cmd === "resume") window.open("/resume.pdf", "_blank");
      if (cmd === "email") window.location.href = "mailto:harshit.sharma8532@gmail.com";
      
      setTerminalCommand(cmd);
      setInputValue("");
    } else {
      setInputValue("");
    }
  };

  return (
    <div className="w-full h-full relative pointer-events-none">
      {/* Commands List - Bottom Left */}
      <div className="absolute bottom-[env(safe-area-inset-bottom,2rem)] md:bottom-24 left-6 md:left-12 flex flex-col gap-4 text-white p-6 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 w-[90%] max-w-xs md:max-w-sm pointer-events-auto">
        <div className="text-xs tracking-widest text-white/40 uppercase mb-2">Terminal Access</div>
        <div className="flex flex-col gap-2 font-mono text-sm md:text-base text-white/80">
          {commands.map((c) => (
            <div key={c.cmd} className="flex flex-col xl:flex-row xl:gap-4">
              <span className="text-green-400 w-32 shrink-0 whitespace-nowrap">{">"} {c.cmd}</span>
              <span className="text-white/50">{c.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Input / Output - Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 text-white p-6 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 w-[90%] max-w-lg pointer-events-auto">
        {state.terminalCommand ? (
          <>
            <div className="text-xs tracking-widest text-white/40 uppercase">Output: {state.terminalCommand}</div>
            
            {state.terminalCommand === "email" && (
              <div className="text-lg md:text-xl font-mono">
                <a href="mailto:harshit.sharma8532@gmail.com" className="hover:text-blue-400 transition-colors">harshit.sharma8532@gmail.com</a>
              </div>
            )}
            {state.terminalCommand === "linkedin" && (
              <div className="text-lg md:text-xl font-mono truncate">
                <a href="https://linkedin.com/in/harshit-sharma-462a762b5" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">linkedin.com/in/harshit-sharma-462a762b5</a>
              </div>
            )}
            {state.terminalCommand === "github" && (
              <div className="text-lg md:text-xl font-mono truncate">
                <a href="https://github.com/harshitsharma7017" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">github.com/harshitsharma7017</a>
              </div>
            )}
            {state.terminalCommand === "resume" && (
              <div className="text-lg md:text-xl font-mono">
                <a href="/resume.pdf" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">View Resume PDF</a>
              </div>
            )}

            <button 
              type="button"
              onClick={() => setTerminalCommand(null)}
              className="mt-4 self-start px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-xs font-mono uppercase tracking-widest text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>←</span> Return to Terminal
            </button>
          </>
        ) : (
          <form onSubmit={handleCommand} className="flex items-center gap-3 font-mono text-base md:text-lg">
            <span className="text-green-400">$</span>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a command..."
              className="bg-transparent border-none outline-none flex-1 text-white placeholder-white/30"
              autoFocus
            />
            <button type="submit" className="hidden">Enter</button>
          </form>
        )}
      </div>
    </div>
  );
}
