"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { Slide, item } from "./Slide";
import { usePortfolioContent } from "./PortfolioContentProvider";

const word: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
};
const letter: Variants = {
  hidden: { y: "70%", opacity: 0, rotate: 4 },
  show: { y: 0, opacity: 1, rotate: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// Big title: every letter rises in one by one.
function Word({ text }: { text: string }) {
  return (
    <motion.span variants={word} className="hero-word" aria-hidden>
      {text.split("").map((c, i) => (
        <motion.span key={i} variants={letter} className="inline-block">
          {c}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Small caption whose letters are spread evenly across the width of the big word above it.
function Caption({ text }: { text: string }) {
  return (
    <motion.p variants={item} className="hero-sub">
      {text.split("").map((c, i) => (
        <span key={i}>{c === " " ? " " : c}</span>
      ))}
    </motion.p>
  );
}

export default function Hero() {
  const { content: { profile } } = usePortfolioContent();
  // Mouse position (-1 … 1) drives a gentle parallax between title and cartoon.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 16 });
  const sy = useSpring(my, { stiffness: 60, damping: 16 });
  const cartoonX = useTransform(sx, [-1, 1], [-14, 14]);
  const cartoonY = useTransform(sy, [-1, 1], [-8, 8]);
  const titleX = useTransform(sx, [-1, 1], [8, -8]);

  function onMove(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <Slide id="top" className="hero" onMouseMove={onMove} onMouseLeave={onLeave} aria-label="Portfolio">
      <h1 className="sr-only">
        {profile.name} – Portfolio – {profile.titleLines.join(" ")}
      </h1>
      <div className="hero-glow" aria-hidden />

      {/* PORT */}
      <div className="hero-side hero-left" aria-hidden>
        <motion.div style={{ x: titleX }}>
          <Word text="PORT" />
          <Caption text={profile.titleLines[0]} />
        </motion.div>
      </div>

      {/* FOLIO */}
      <div className="hero-side hero-right" aria-hidden>
        <motion.div style={{ x: titleX }}>
          <Word text="FOLIO" />
          <Caption text={profile.titleLines[1]} />
        </motion.div>
      </div>

      {/* Cartoon: rises in, then floats gently */}
      <div className="hero-cartoon">
        <motion.div style={{ x: cartoonX, y: cartoonY }}>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 90, scale: 0.9 },
              show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
            >
              <Image
                src="/images/cartoon.png"
                alt="Cartoon illustration of Prahaspathi"
                width={882}
                height={1659}
                priority
                sizes="(min-width: 1180px) 340px, 30vw"
                className="h-auto w-full"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div variants={item} className="hero-foot" aria-hidden>
        <span>{profile.name.toUpperCase()}</span>
        <span>NEXT.JS · REACT · SUPABASE</span>
      </motion.div>
    </Slide>
  );
}
