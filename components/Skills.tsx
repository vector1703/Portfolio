"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Braces } from "lucide-react";
import { Slide, item } from "./Slide";
import { usePortfolioContent } from "./PortfolioContentProvider";

export default function Skills() {
  const { content: { skills } } = usePortfolioContent();
  return (
    <Slide id="skills" className="slide-pad skills-slide">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <motion.p variants={item} className="label">What I work with · 06 skills</motion.p>
          <motion.h2 variants={item} className="slide-title mt-3">MY TOOLKIT</motion.h2>
        </div>
        <motion.p variants={item} className="copy max-w-sm sm:text-right">
          A growing set of languages and tools I use to turn ideas into working products.
        </motion.p>
      </div>
      <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-12 md:gap-4">
        {skills.map((skill, index) => (
          <motion.article
            key={skill.name}
            variants={item}
            whileHover={{ y: -6, rotate: index % 2 === 0 ? -1 : 1 }}
            className="skill-card group"
          >
            <div className="flex items-start justify-between">
              <span className="skill-mark" aria-hidden>{skill.mark}</span>
              <ArrowUpRight size={16} className="skill-arrow" aria-hidden />
            </div>
            <div className="mt-8">
              <p className="font-display text-3xl leading-none tracking-wide sm:text-4xl">{skill.name}</p>
              <p className="label mt-2 !text-[0.58rem]">{skill.category}</p>
            </div>
          </motion.article>
        ))}
      </div>
      <motion.div variants={item} className="mt-7 flex items-center gap-2 text-xs tracking-wide text-[rgb(239_236_208/0.65)]">
        <Braces size={15} className="text-[var(--accent)]" /> Always learning, always building.
      </motion.div>
    </Slide>
  );
}
