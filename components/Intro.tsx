"use client";

import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Slide, item } from "./Slide";
import { usePortfolioContent } from "./PortfolioContentProvider";

export default function Intro() {
  const { content: { profile } } = usePortfolioContent();
  return (
    <Slide id="intro" className="slide-pad">
      <div className="grid items-start gap-8 md:grid-cols-[minmax(220px,300px)_1fr] md:gap-12">
        {/* Photo */}
        <motion.div variants={item}>
          <div className="relative aspect-square overflow-hidden rounded-xl border border-[rgb(239_236_208/0.35)] shadow-xl">
            <Image
              src="/images/profile.png"
              alt={`Portrait of ${profile.name}`}
              fill
              sizes="(min-width: 768px) 300px, 80vw"
              className="object-cover object-top transition duration-700 hover:scale-105"
            />
          </div>
          <p className="font-display mt-4 text-3xl tracking-wide">{profile.name.toUpperCase()}</p>
          <p className="label mt-1">{profile.titleLines.join(" ")}</p>
        </motion.div>

        {/* Details */}
        <div>
          <motion.h2 variants={item} className="slide-title md:text-right">
            INTRODUCTION
          </motion.h2>

          <motion.div variants={item} className="mt-6 space-y-3">
            {profile.about.map((p) => (
              <p key={p} className="copy">
                {p}
              </p>
            ))}
          </motion.div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <motion.div variants={item}>
              <p className="label">Contact</p>
              <a href={`mailto:${profile.email}`} className="copy mt-2 flex items-center gap-2 hover:text-white">
                <Mail size={14} /> {profile.email}
              </a>
              <a href={`tel:${profile.phoneLink}`} className="copy flex items-center gap-2 hover:text-white">
                <Phone size={14} /> {profile.phone}
              </a>
            </motion.div>

            <motion.div variants={item}>
              <p className="label">Education &amp; Experience</p>
              <p className="copy mt-2">{profile.education}</p>
              <p className="copy">{profile.experienceYears} of experience</p>
            </motion.div>

            <motion.div variants={item}>
              <p className="label">Focus</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.focus.map((f) => (
                  <span key={f} className="chip">
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item}>
              <p className="label">Tools</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.tools.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Slide>
  );
}
