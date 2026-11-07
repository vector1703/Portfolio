"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

// Each full-screen chapter eases into view, then its content follows in sequence.
const slideVariants: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

// Use this on anything inside a <Slide> that should animate in.
export const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

type SlideProps = Omit<
  HTMLMotionProps<"section">,
  "variants" | "initial" | "animate" | "whileInView" | "custom" | "whileHover"
>;

export function Slide({ className = "", children, ...rest }: SlideProps) {
  return (
    <motion.section
      variants={slideVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.18, margin: "-8% 0px -8% 0px" }}
      style={{ scrollSnapAlign: "start" }}
      className={`slide ${className}`}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
