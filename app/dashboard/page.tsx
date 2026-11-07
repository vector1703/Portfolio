"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowLeft, BriefcaseBusiness, Check, Code2, ExternalLink, FolderKanban, GraduationCap, LoaderCircle, LogOut, Plus, Save, UserRound, X } from "lucide-react";
import { defaultPortfolioContent, type PortfolioContent } from "@/lib/data";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

type TabId = "profile" | "skills" | "learning" | "experience" | "projects";
const tabs: { id: TabId; label: string; icon: typeof UserRound }[] = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "learning", label: "Learning", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "projects", label: "Projects", icon: FolderKanban },
];

function mergeContent(value: unknown): PortfolioContent {
  if (!value || typeof value !== "object") return defaultPortfolioContent;
  const saved = value as Partial<PortfolioContent>;
  return {
    ...defaultPortfolioContent,
    ...saved,
    profile: { ...defaultPortfolioContent.profile, ...saved.profile },
  };
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
  hint?: string;
}) {
  return (
    <label className="cms-field">
      <span>{label}</span>
      {multiline ? (
        <textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function EditorPanel({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="cms-panel">
      <div className="cms-panel-heading">
        <div>
          <p className="cms-eyebrow">Portfolio content</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function DashboardPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [access, setAccess] = useState<"checking" | "allowed" | "denied" | "error">("checking");
  const [draft, setDraft] = useState<PortfolioContent>(defaultPortfolioContent);
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<"success" | "error">("success");
  const [saving, setSaving] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");
  const [resumeMessageKind, setResumeMessageKind] = useState<"success" | "error">("success");
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthLoading(false);
      return;
    }

    const client = createSupabaseBrowserClient();
    setSupabase(client);
    let active = true;

    void client.auth.getUser().then(({ data }) => {
      if (active) {
        setUser(data.user);
        setAuthLoading(false);
      }
    }).catch(() => {
      if (active) setAuthLoading(false);
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAccess("checking");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const client = supabase;
    const authenticatedUser = user;
    if (!client || !authenticatedUser) return;
    let active = true;

    async function loadDashboard(
      client: NonNullable<typeof supabase>,
      authenticatedUser: User,
    ) {
      setAccess("checking");
      const { data: admin, error: adminError } = await client
        .from("portfolio_admins")
        .select("user_id")
        .eq("user_id", authenticatedUser.id)
        .maybeSingle();

      if (!active) return;
      if (adminError) {
        setAccess("error");
        setMessage("Dashboard tables are not ready. Follow the Supabase setup guide.");
        setMessageKind("error");
        return;
      }
      if (!admin) {
        setAccess("denied");
        return;
      }

      const { data, error } = await client
        .from("portfolio_content")
        .select("data, updated_at")
        .eq("id", "site")
        .maybeSingle();
      if (!active) return;
      if (error) {
        setAccess("error");
        setMessage("Could not load your portfolio content. Check the Supabase setup and try again.");
        setMessageKind("error");
        return;
      }

      setDraft(mergeContent(data?.data));
      setUpdatedAt(data?.updated_at ?? null);
      setAccess("allowed");
      setMessage("");
    }

    void loadDashboard(client, authenticatedUser);
    return () => { active = false; };
  }, [supabase, user]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("Sign-in failed. Check your email and password, then try again.");
      setMessageKind("error");
    }
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setAccess("checking");
  }

  async function publishChanges() {
    if (!supabase) return;
    setSaving(true);
    setMessage("");
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("portfolio_content")
      .upsert({ id: "site", data: draft, updated_at: now }, { onConflict: "id" });
    setSaving(false);
    if (error) {
      setMessage("Could not publish. Your account may not have editor access yet.");
      setMessageKind("error");
      return;
    }
    setUpdatedAt(now);
    setMessage("Changes published. They’ll appear on the portfolio when it’s next loaded.");
    setMessageKind("success");
  }

  async function uploadResume(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !resumeFile) return;
    setResumeMessage("");

    if (resumeFile.size > 8 * 1024 * 1024) {
      setResumeMessage("Choose a PDF smaller than 8 MB.");
      setResumeMessageKind("error");
      return;
    }
    if (resumeFile.type && resumeFile.type !== "application/pdf") {
      setResumeMessage("Only PDF files are accepted.");
      setResumeMessageKind("error");
      return;
    }
    const header = new TextDecoder().decode(await resumeFile.slice(0, 1024).arrayBuffer());
    if (!header.includes("%PDF-")) {
      setResumeMessage("This file doesn’t look like a valid PDF.");
      setResumeMessageKind("error");
      return;
    }

    setResumeUploading(true);
    try {
      const { error } = await supabase.storage
        .from("portfolio-resumes")
        .upload("resume.pdf", resumeFile, {
          upsert: true,
          contentType: "application/pdf",
          cacheControl: "3600",
        });
      if (error) throw error;

      const { data } = supabase.storage.from("portfolio-resumes").getPublicUrl("resume.pdf", {
        download: true,
        cacheNonce: String(Date.now()),
      });
      updateProfile("resumeUrl", data.publicUrl);
      setResumeMessage("PDF uploaded. Publish changes below to show the download link on your portfolio.");
      setResumeMessageKind("success");
      setResumeFile(null);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    } catch {
      setResumeMessage("Upload failed. Check that the resume Storage setup has been run.");
      setResumeMessageKind("error");
    } finally {
      setResumeUploading(false);
    }
  }

  function updateProfile<K extends keyof PortfolioContent["profile"]>(key: K, value: PortfolioContent["profile"][K]) {
    setDraft((current) => ({ ...current, profile: { ...current.profile, [key]: value } }));
  }

  function updateSkill(index: number, key: "name" | "category" | "mark", value: string) {
    setDraft((current) => ({ ...current, skills: current.skills.map((skill, i) => i === index ? { ...skill, [key]: value } : skill) }));
  }

  function updateLearning(index: number, key: "name" | "note" | "mark", value: string) {
    setDraft((current) => ({ ...current, currentlyLearning: current.currentlyLearning.map((topic, i) => i === index ? { ...topic, [key]: value } : topic) }));
  }

  function updateExperience(index: number, key: "company" | "role" | "period" | "text" | "link", value: string) {
    setDraft((current) => ({ ...current, experience: current.experience.map((entry, i) => i === index ? { ...entry, [key]: value } : entry) }));
  }

  function updateProject(index: number, key: "name" | "title" | "category" | "text" | "link" | "art" | "monogram" | "artTitle", value: string) {
    setDraft((current) => ({ ...current, projects: current.projects.map((project, i) => i === index ? { ...project, [key]: value } : project) }));
  }

  function updateProjectTools(index: number, value: string) {
    setDraft((current) => ({ ...current, projects: current.projects.map((project, i) => i === index ? { ...project, tools: value.split(",").map((tool) => tool.trim()).filter(Boolean) } : project) }));
  }

  function updateProjectImage(index: number, value: string) {
    setDraft((current) => ({
      ...current,
      projects: current.projects.map((project, i) => i === index
        ? { ...project, image: value.trim() || undefined, imageSize: value.trim() ? project.imageSize ?? [1600, 900] : undefined }
        : project),
    }));
  }

  function updateProjectConcept(index: number, isConcept: boolean) {
    setDraft((current) => ({
      ...current,
      projects: current.projects.map((project, i) => i === index
        ? { ...project, concept: isConcept, category: isConcept ? "Concept project" : "Live project" }
        : project),
    }));
  }

  function renderEditor() {
    if (activeTab === "profile") {
      const about = draft.profile.about.join("\n\n");
      return (
        <EditorPanel title="Profile & introduction" description="Update your name, headline, contact details, and introduction copy.">
          <div className="cms-form-grid">
            <Field label="Name" value={draft.profile.name} onChange={(value) => updateProfile("name", value)} />
            <Field label="Headline, two lines" value={draft.profile.titleLines.join("\n")} multiline hint="Put each headline line on its own row." onChange={(value) => updateProfile("titleLines", value.split("\n").map((line) => line.trim()).filter(Boolean))} />
            <Field label="Email" type="email" value={draft.profile.email} onChange={(value) => updateProfile("email", value)} />
            <Field label="Phone" value={draft.profile.phone} onChange={(value) => updateProfile("phone", value)} />
            <Field label="Phone link" value={draft.profile.phoneLink} hint="Include country code, without spaces." onChange={(value) => updateProfile("phoneLink", value)} />
            <Field label="Education" value={draft.profile.education} onChange={(value) => updateProfile("education", value)} />
            <Field label="Experience summary" value={draft.profile.experienceYears} onChange={(value) => updateProfile("experienceYears", value)} />
            <Field label="About paragraphs" value={about} multiline hint="Separate paragraphs with a blank line." onChange={(value) => updateProfile("about", value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean))} />
            <Field label="Focus areas" value={draft.profile.focus.join("\n")} multiline hint="One item per line." onChange={(value) => updateProfile("focus", value.split("\n").map((line) => line.trim()).filter(Boolean))} />
            <Field label="Tools" value={draft.profile.tools.join("\n")} multiline hint="One item per line." onChange={(value) => updateProfile("tools", value.split("\n").map((line) => line.trim()).filter(Boolean))} />
          </div>
          <form className="cms-resume-uploader" onSubmit={uploadResume}>
            <div>
              <p className="cms-eyebrow">Private file upload</p>
              <h3>Resume PDF</h3>
              <p>Upload a PDF up to 8 MB. Storage permissions allow only your admin account to add or replace this file.</p>
              {draft.profile.resumeUrl && <a className="cms-view-link" href={draft.profile.resumeUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /> View current resume</a>}
            </div>
            <div className="cms-resume-upload-controls">
              <input ref={resumeInputRef} type="file" accept="application/pdf,.pdf" onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)} />
              <button type="submit" className="cms-add-button" disabled={!resumeFile || resumeUploading}>
                {resumeUploading ? <><LoaderCircle size={15} className="cms-spin" /> Uploading…</> : <><Plus size={15} /> Upload PDF</>}
              </button>
              <p className={`cms-message cms-message-${resumeMessageKind}`} role="status" aria-live="polite">{resumeMessage}</p>
            </div>
          </form>
        </EditorPanel>
      );
    }

    if (activeTab === "skills") {
      return (
        <EditorPanel title="Skills" description="Manage the technology cards shown in your skills section.">
          <div className="cms-entry-list">
            {draft.skills.map((skill, index) => (
              <div className="cms-entry-card" key={`${skill.name}-${index}`}>
                <div className="cms-entry-heading"><strong>{skill.name || "New skill"}</strong><button type="button" className="cms-icon-button" aria-label={`Remove ${skill.name}`} onClick={() => setDraft((current) => ({ ...current, skills: current.skills.filter((_, i) => i !== index) }))}><X size={16} /></button></div>
                <div className="cms-form-grid cms-form-grid-3">
                  <Field label="Name" value={skill.name} onChange={(value) => updateSkill(index, "name", value)} />
                  <Field label="Category" value={skill.category} onChange={(value) => updateSkill(index, "category", value)} />
                  <Field label="Card mark" value={skill.mark} onChange={(value) => updateSkill(index, "mark", value)} />
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="cms-add-button" onClick={() => setDraft((current) => ({ ...current, skills: [...current.skills, { name: "New skill", category: "Programming", mark: "+" }] }))}><Plus size={16} /> Add skill</button>
        </EditorPanel>
      );
    }

    if (activeTab === "learning") {
      return (
        <EditorPanel title="Currently learning" description="Keep this list current with the topics you are actively exploring.">
          <div className="cms-entry-list">
            {draft.currentlyLearning.map((topic, index) => (
              <div className="cms-entry-card" key={`${topic.name}-${index}`}>
                <div className="cms-entry-heading"><strong>{topic.name || "New topic"}</strong><button type="button" className="cms-icon-button" aria-label={`Remove ${topic.name}`} onClick={() => setDraft((current) => ({ ...current, currentlyLearning: current.currentlyLearning.filter((_, i) => i !== index) }))}><X size={16} /></button></div>
                <div className="cms-form-grid cms-form-grid-3">
                  <Field label="Topic" value={topic.name} onChange={(value) => updateLearning(index, "name", value)} />
                  <Field label="Short note" value={topic.note} onChange={(value) => updateLearning(index, "note", value)} />
                  <Field label="Number" value={topic.mark} onChange={(value) => updateLearning(index, "mark", value)} />
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="cms-add-button" onClick={() => setDraft((current) => ({ ...current, currentlyLearning: [...current.currentlyLearning, { name: "New topic", note: "Add a short description", mark: String(current.currentlyLearning.length + 1).padStart(2, "0") }] }))}><Plus size={16} /> Add topic</button>
        </EditorPanel>
      );
    }

    if (activeTab === "experience") {
      return (
        <EditorPanel title="Experience" description="Update internships and roles, or add another entry.">
          <div className="cms-entry-list">
            {draft.experience.map((entry, index) => (
              <div className="cms-entry-card" key={`${entry.company}-${index}`}>
                <div className="cms-entry-heading"><strong>{entry.company || "New role"}</strong><button type="button" className="cms-icon-button" aria-label={`Remove ${entry.company}`} onClick={() => setDraft((current) => ({ ...current, experience: current.experience.filter((_, i) => i !== index) }))}><X size={16} /></button></div>
                <div className="cms-form-grid">
                  <Field label="Company" value={entry.company} onChange={(value) => updateExperience(index, "company", value)} />
                  <Field label="Role" value={entry.role} onChange={(value) => updateExperience(index, "role", value)} />
                  <Field label="Period" value={entry.period} onChange={(value) => updateExperience(index, "period", value)} />
                  <Field label="Website" value={entry.link} onChange={(value) => updateExperience(index, "link", value)} />
                  <Field label="Description" value={entry.text} multiline onChange={(value) => updateExperience(index, "text", value)} />
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="cms-add-button" onClick={() => setDraft((current) => ({ ...current, experience: [...current.experience, { company: "Company name", role: "Your role", period: "Year · Present", text: "Describe your work and impact.", link: "https://" }] }))}><Plus size={16} /> Add experience</button>
        </EditorPanel>
      );
    }

    return (
      <EditorPanel title="Projects" description="Edit project details, links, stacks, or add a new concept. Image paths point to files in public/.">
        <div className="cms-entry-list">
          {draft.projects.map((project, index) => (
            <div className="cms-entry-card" key={`${project.name}-${index}`}>
              <div className="cms-entry-heading"><strong>{project.name || "New project"}</strong><button type="button" className="cms-icon-button" aria-label={`Remove ${project.name}`} onClick={() => setDraft((current) => ({ ...current, projects: current.projects.filter((_, i) => i !== index) }))}><X size={16} /></button></div>
              <div className="cms-form-grid">
                <Field label="Name" value={project.name} onChange={(value) => updateProject(index, "name", value)} />
                <Field label="Project type" value={project.title} onChange={(value) => updateProject(index, "title", value)} />
                <Field label="Label" value={project.category} hint="For example, Live project or Concept project." onChange={(value) => updateProject(index, "category", value)} />
                <label className="cms-checkbox"><input type="checkbox" checked={Boolean(project.concept)} onChange={(event) => updateProjectConcept(index, event.target.checked)} /><span>Mark as a concept project</span></label>
                <Field label="Live URL (optional)" value={project.link ?? ""} onChange={(value) => updateProject(index, "link", value)} />
                <Field label="Description" value={project.text} multiline onChange={(value) => updateProject(index, "text", value)} />
                <Field label="Tools, comma separated" value={project.tools.join(", ")} onChange={(value) => updateProjectTools(index, value)} />
                <Field label="Preview image path (optional)" value={project.image ?? ""} hint="Add the image under public/images, then enter /images/filename.png." onChange={(value) => updateProjectImage(index, value)} />
                <Field label="Concept artwork theme" value={project.art ?? "orbit"} hint="Use orbit, bitemap, or studysprint for the built-in artwork colors." onChange={(value) => updateProject(index, "art", value)} />
                <Field label="Artwork title" value={project.artTitle ?? ""} multiline onChange={(value) => updateProject(index, "artTitle", value)} />
                <Field label="Monogram" value={project.monogram ?? ""} onChange={(value) => updateProject(index, "monogram", value)} />
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="cms-add-button" onClick={() => setDraft((current) => ({ ...current, projects: [...current.projects, { name: "New concept", title: "PROJECT CONCEPT", category: "Concept project", text: "Describe the idea and what it would help people do.", tools: ["React"], art: "orbit", monogram: "N", artTitle: "A new\nidea.", concept: true }] }))}><Plus size={16} /> Add project</button>
      </EditorPanel>
    );
  }

  if (!isSupabaseConfigured()) {
    return <DashboardMessage title="Connect Supabase to open your dashboard" text="Add the project URL and publishable key from your Supabase project to .env.local, then run the setup steps in SUPABASE_DASHBOARD_SETUP.md." />;
  }

  if (authLoading || (user && access === "checking")) {
    return <DashboardMessage title="Opening your dashboard" text="Checking your private editor access…" loading />;
  }

  if (!user) {
    return (
      <main className="cms-login-page">
        <a href="/" className="cms-back-link"><ArrowLeft size={15} /> Back to portfolio</a>
        <form className="cms-login-card" onSubmit={signIn}>
          <p className="cms-eyebrow">Private portfolio editor</p>
          <h1>Welcome back.</h1>
          <p>Sign in with the admin account you created in Supabase.</p>
          <Field label="Email address" type="email" value={email} onChange={setEmail} />
          <Field label="Password" type="password" value={password} onChange={setPassword} />
          {message && <p className="cms-message cms-message-error" role="alert">{message}</p>}
          <button type="submit" className="cms-primary-button" disabled={!supabase}>Sign in</button>
          <small>Public sign-up is disabled. Create your admin user in Supabase Auth.</small>
        </form>
      </main>
    );
  }

  if (access === "denied" || access === "error") {
    return (
      <DashboardMessage
        title={access === "denied" ? "This account is not an editor" : "Dashboard setup needs attention"}
        text={access === "denied" ? "Sign in with the account whose user ID is in portfolio_admins." : message}
        onSignOut={signOut}
      />
    );
  }

  return (
    <main className="cms-dashboard">
      <header className="cms-topbar">
        <a href="/" className="cms-brand"><span>P</span><div><strong>Portfolio CMS</strong><small>Prahaspathi · Admin</small></div></a>
        <div className="cms-topbar-actions">
          <a href="/" className="cms-view-link"><ExternalLink size={15} /> View site</a>
          <button type="button" className="cms-signout-button" onClick={signOut}><LogOut size={15} /> Sign out</button>
        </div>
      </header>
      <div className="cms-layout">
        <aside className="cms-sidebar">
          <p className="cms-eyebrow">Manage site</p>
          <nav aria-label="Dashboard sections">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return <button key={tab.id} type="button" aria-current={activeTab === tab.id ? "page" : undefined} className={`cms-tab${activeTab === tab.id ? " cms-tab-active" : ""}`} onClick={() => setActiveTab(tab.id)}><Icon size={17} /> {tab.label}</button>;
            })}
          </nav>
          <div className="cms-sidebar-note"><span className="cms-live-dot" /> Changes publish to the live portfolio.</div>
        </aside>
        <section className="cms-workspace">
          <div className="cms-workspace-heading">
            <div><p className="cms-eyebrow">Content dashboard</p><h1>Keep your story current.</h1></div>
            {updatedAt && <p className="cms-updated">Last published {new Date(updatedAt).toLocaleString()}</p>}
          </div>
          {renderEditor()}
          <div className="cms-savebar">
            <p className={`cms-message cms-message-${messageKind}`} role="status" aria-live="polite">{message}</p>
            <button type="button" className="cms-primary-button" onClick={publishChanges} disabled={saving}>
              {saving ? <><LoaderCircle size={16} className="cms-spin" /> Publishing…</> : <><Save size={16} /> Publish changes</>}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardMessage({ title, text, loading = false, onSignOut }: { title: string; text: string; loading?: boolean; onSignOut?: () => void }) {
  return (
    <main className="cms-login-page">
      <a href="/" className="cms-back-link"><ArrowLeft size={15} /> Back to portfolio</a>
      <section className="cms-login-card cms-message-card">
        {loading && <LoaderCircle size={22} className="cms-spin cms-loading-icon" />}
        <p className="cms-eyebrow">Private portfolio editor</p>
        <h1>{title}</h1>
        <p>{text}</p>
        {onSignOut && <button type="button" className="cms-primary-button" onClick={onSignOut}>Sign out</button>}
        <a href="/" className="cms-view-link"><Check size={15} /> Return to the portfolio</a>
      </section>
    </main>
  );
}
