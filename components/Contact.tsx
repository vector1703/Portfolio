"use client";

import { useState, type FormEvent } from "react";
import { Download, Mail, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Slide, item } from "./Slide";
import { usePortfolioContent } from "./PortfolioContentProvider";

type FormStatus = "idle" | "sending" | "success" | "error";

const emptyForm = { name: "", email: "", subject: "", message: "", company: "" };

export default function Contact() {
  const { content: { profile } } = usePortfolioContent();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (status === "error") {
      setStatus("idle");
      setFeedback("");
    }
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your message could not be sent. Please try again.");

      setStatus("success");
      setFeedback("Thanks for reaching out. Your message has been sent.");
      setForm(emptyForm);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Your message could not be sent. Please try again.");
    }
  }

  return (
    <Slide id="contact" className="slide-pad contact-section">
      <div className="contact-intro">
        <motion.p variants={item} className="label">Have a project in mind?</motion.p>
        <motion.h2 variants={item} className="slide-title mt-3">LET&apos;S TALK</motion.h2>
        <motion.p variants={item} className="copy mt-5 max-w-md">
          Tell me a little about what you&apos;re working on. I&apos;ll get back to you by email.
        </motion.p>
        <motion.div variants={item} className="contact-direct-links mt-7 flex flex-col gap-3">
          <a href={`mailto:${profile.email}`} className="copy inline-flex items-center gap-2 hover:text-white">
            <Mail size={15} /> {profile.email}
          </a>
          <a href={`tel:${profile.phoneLink}`} className="copy inline-flex items-center gap-2 hover:text-white">
            <Phone size={15} /> {profile.phone}
          </a>
        </motion.div>
        <motion.div variants={item} className="mt-6">
          {profile.resumeUrl ? (
            <a href={profile.resumeUrl} download className="btn">
              Download resume <Download size={15} />
            </a>
          ) : (
            <span className="btn btn-disabled" aria-disabled="true" title="Add your resume PDF to public/resume.pdf to enable this button">
              Resume coming soon <Download size={15} />
            </span>
          )}
        </motion.div>
      </div>

      <motion.form variants={item} onSubmit={submitForm} className="contact-form">
        <div className="contact-form-row">
          <label className="contact-field">
            <span>Your name</span>
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Jane Smith"
            />
          </label>
          <label className="contact-field">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength={254}
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="jane@example.com"
            />
          </label>
        </div>
        <label className="contact-field">
          <span>Subject</span>
          <input
            name="subject"
            required
            maxLength={160}
            value={form.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            placeholder="What would you like to discuss?"
          />
        </label>
        <label className="contact-field">
          <span>Message</span>
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Share a few details..."
          />
        </label>
        <label className="contact-honeypot" aria-hidden="true">
          Leave this field empty
          <input
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={(event) => updateField("company", event.target.value)}
          />
        </label>
        <div className="contact-submit-row">
          <p className={`contact-feedback contact-feedback-${status}`} role="status" aria-live="polite">
            {feedback}
          </p>
          <button type="submit" className="btn" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send message"}
            <Send size={15} />
          </button>
        </div>
      </motion.form>
    </Slide>
  );
}
