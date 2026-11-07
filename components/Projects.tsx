"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, X } from "lucide-react";
import { Slide, item } from "./Slide";
import type { PortfolioProject } from "@/lib/data";
import { usePortfolioContent } from "./PortfolioContentProvider";

function ProjectArtwork({ project }: { project: PortfolioProject }) {
  if (project.image && project.imageSize) {
    return (
      <div className="project-artwork project-artwork-image">
        <div className="project-artwork-toolbar" aria-hidden><i /><i /><i /></div>
        <Image
          src={project.image}
          alt={`${project.name} project preview`}
          fill
          sizes="(min-width: 900px) 30vw, (min-width: 560px) 45vw, 90vw"
          className="project-thumbnail"
        />
      </div>
    );
  }

  return (
    <div className={`project-artwork project-artwork-${project.art ?? "concept"}`} aria-hidden="true">
      <div className="project-artwork-toolbar"><i /><i /><i /><span>CONCEPT / {project.name}</span></div>
      <div className="concept-cover">
        <span className="concept-monogram">{project.monogram}</span>
        <span className="concept-title">{project.artTitle}</span>
        <span className="concept-orbit concept-orbit-one" />
        <span className="concept-orbit concept-orbit-two" />
      </div>
    </div>
  );
}

export default function Projects() {
  const { content: { projects } } = usePortfolioContent();
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [projectFilter, setProjectFilter] = useState<"all" | "live" | "concept">("all");
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const filteredProjects = projects.filter((project) => {
    if (projectFilter === "all") return true;
    return projectFilter === "concept" ? project.concept : Boolean(project.link);
  });

  useEffect(() => {
    if (!selectedProject) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedProject(null);
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable.item(0);
      const last = focusable.item(focusable.length - 1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [selectedProject]);

  return (
    <>
      <Slide id="projects" className="slide-pad projects-section">
        <div className="projects-heading">
          <div>
            <motion.p variants={item} className="label">Selected work · {String(projects.length).padStart(2, "0")} projects</motion.p>
            <motion.h2 variants={item} className="slide-title mt-3">PROJECTS</motion.h2>
          </div>
          <motion.p variants={item} className="copy max-w-sm md:text-right">
            Explore the work and concepts. Select a card to see the details.
          </motion.p>
        </div>

        <div className="project-filters" role="group" aria-label="Filter projects">
          {([
            { key: "all", label: `All · ${projects.length}` },
            { key: "live", label: `Live · ${projects.filter((project) => project.link).length}` },
            { key: "concept", label: `Concepts · ${projects.filter((project) => project.concept).length}` },
          ] as const).map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={`project-filter${projectFilter === filter.key ? " project-filter-active" : ""}`}
              aria-pressed={projectFilter === filter.key}
              onClick={() => setProjectFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <motion.div className="projects-grid" layout variants={item}>
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((project) => (
              <motion.button
                key={project.name}
                type="button"
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setSelectedProject(project)}
                className="project-card"
                aria-haspopup="dialog"
                aria-label={`View details for ${project.name}`}
              >
                <ProjectArtwork project={project} />
                <span className="project-card-copy">
                  <span className="project-card-meta">
                    <span className="label">{project.category}</span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </span>
                  <span className="project-card-name">{project.name}</span>
                  <span className="project-card-type">{project.title}</span>
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </Slide>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="project-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedProject(null);
            }}
          >
            <motion.section
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-dialog-title"
              className="project-modal"
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedProject(null)}
                className="project-modal-close"
                aria-label="Close project details"
              >
                <X size={19} />
              </button>
              <ProjectArtwork project={selectedProject} />
              <div className="project-modal-content">
                <p className="label">{selectedProject.category}</p>
                <h3 id="project-dialog-title" className="font-display mt-2 text-5xl leading-none sm:text-6xl">
                  {selectedProject.name}
                </h3>
                <p className="copy mt-4">{selectedProject.text}</p>
                <div className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                  {selectedProject.tools.map((tool) => <span key={tool} className="chip">{tool}</span>)}
                </div>
                {selectedProject.concept && (
                  <p className="concept-note mt-5">Concept project · visual direction only</p>
                )}
                {selectedProject.link && (
                  <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="btn mt-7">
                    View live project <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
