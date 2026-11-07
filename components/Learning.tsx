"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Slide, item } from "./Slide";
import { usePortfolioContent } from "./PortfolioContentProvider";

export default function Learning() {
  const { content: { currentlyLearning } } = usePortfolioContent();
  return (
    <Slide id="learning" className="slide-pad learning-section">
      <div className="learning-heading">
        <div>
          <motion.p variants={item} className="label">Curiosity in progress</motion.p>
          <motion.h2 variants={item} className="slide-title mt-3">CURRENTLY LEARNING</motion.h2>
        </div>
        <motion.p variants={item} className="copy max-w-sm md:text-right">
          The topics I&apos;m spending time on right now, one step at a time.
        </motion.p>
      </div>
      <div className="learning-list">
        {currentlyLearning.map((topic) => (
          <motion.article key={topic.name} variants={item} className="learning-item">
            <span className="learning-number">{topic.mark}</span>
            <div className="learning-topic-copy">
              <p className="font-display text-3xl leading-none sm:text-4xl">{topic.name}</p>
              <p className="copy mt-2">{topic.note}</p>
            </div>
            <ArrowUpRight size={18} className="learning-arrow" aria-hidden="true" />
          </motion.article>
        ))}
      </div>
      <motion.p variants={item} className="learning-footnote">
        <BookOpen size={15} aria-hidden="true" /> Updated as I keep exploring.
      </motion.p>
    </Slide>
  );
}
