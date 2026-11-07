"use client";

import { useEffect, useState } from "react";
import { MotionConfig, motion, useMotionValue, useScroll, useSpring } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

const links = [
  { label: "Intro", href: "#intro" },
  { label: "Skills", href: "#skills" },
  { label: "Learn", href: "#learning" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function Nav() {
  const [dark, setDark] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const sections = [document.querySelector<HTMLElement>("#top"), ...links
      .map((link) => document.querySelector<HTMLElement>(link.href))
    ].filter((section): section is HTMLElement => section !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveSection(visible[0].target.id === "top" ? "intro" : visible[0].target.id);
        }
      },
      { rootMargin: "-120px 0px -120px 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* saving the choice is optional */
    }
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      className="nav-pill fixed left-1/2 top-4 z-50 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 items-center gap-1 rounded-full px-3 py-2 sm:gap-2 sm:px-4"
      aria-label="Main navigation"
    >
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          aria-current={activeSection === l.href.slice(1) ? "location" : undefined}
          className={`nav-link rounded-full px-2 py-1 text-[11px] font-medium tracking-wider uppercase transition hover:bg-white/15 sm:px-3 sm:text-xs${activeSection === l.href.slice(1) ? " nav-link-active" : ""}`}
        >
          {l.label}
        </a>
      ))}
      <button
        onClick={toggle}
        aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
        className="ml-1 rounded-full bg-white/15 p-2 transition hover:scale-110 hover:bg-white/25"
      >
        {dark ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </motion.nav>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="scroll-progress fixed inset-x-0 top-0 z-[60] h-1 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

function PointerAmbient() {
  const pointerX = useMotionValue(-600);
  const pointerY = useMotionValue(-600);
  const visible = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 55, damping: 24, mass: 0.7 });
  const y = useSpring(pointerY, { stiffness: 55, damping: 24, mass: 0.7 });
  const opacity = useSpring(visible, { stiffness: 45, damping: 24 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      visible.set(1);
    };
    const onPointerLeave = () => visible.set(0);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [pointerX, pointerY, visible]);

  return (
    <motion.div aria-hidden="true" className="pointer-ambient" style={{ x, y, opacity }}>
      <div className="pointer-ambient-core" />
    </motion.div>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LoadingScreen />
      <PointerAmbient />
      <ScrollProgress />
      <Nav />
      {children}
    </MotionConfig>
  );
}
