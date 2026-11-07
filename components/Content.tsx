"use client";

import { motion } from "framer-motion";
import { Slide, item } from "./Slide";
import { usePortfolioContent } from "./PortfolioContentProvider";

export default function Content() {
  const { content: { contentIndex } } = usePortfolioContent();
  return (
    <Slide id="content" className="slide-pad flex flex-col items-center justify-center text-center">
      <motion.h2 variants={item} className="slide-title">
        CONTENT
      </motion.h2>
      <div className="mt-8 grid w-full max-w-5xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6 sm:gap-4">
        {contentIndex.map((c) => (
          <motion.a
            key={c.num}
            href={c.href}
            variants={item}
            whileHover={{ y: -6, scale: 1.06 }}
            className="group flex flex-col items-center"
          >
            <span className="font-display text-[clamp(2.4rem,7cqw,4.5rem)] leading-none transition-colors group-hover:text-[var(--accent)]">
              {c.num}
            </span>
            <span className="mt-2 text-[10px] font-semibold tracking-[0.25em] uppercase opacity-80">{c.label}</span>
          </motion.a>
        ))}
      </div>
    </Slide>
  );
}
