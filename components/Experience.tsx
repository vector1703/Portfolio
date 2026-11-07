"use client";

import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Slide, item } from "./Slide";
import { usePortfolioContent } from "./PortfolioContentProvider";

export default function Experience() {
  const { content: { experience } } = usePortfolioContent();
  return (
    <Slide id="experience" className="slide-pad">
      <motion.h2 variants={item} className="slide-title">
        INTERNSHIP &amp; EXPERIENCE
      </motion.h2>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {experience.map((job, i) => (
          <motion.article key={job.company} variants={item} whileHover={{ y: -6 }} className="card flex flex-col">
            <p className="label">{String(i + 1).padStart(2, "0")} · {job.period}</p>
            <h3 className="font-display mt-3 text-4xl leading-none tracking-wide">{job.company.toUpperCase()}</h3>
            <p className="mt-2 text-sm font-semibold text-[var(--accent)]">{job.role}</p>
            <p className="copy mt-3 flex-1">{job.text}</p>
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold hover:text-[var(--accent)]"
            >
              Visit website <ExternalLink size={14} />
            </a>
          </motion.article>
        ))}
      </div>
    </Slide>
  );
}
