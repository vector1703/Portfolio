// ✏️ EDIT YOUR DETAILS HERE — the whole website reads from this one file.

export const profile = {
  name: "Prahaspathi",
  titleLines: ["FULL STACK", "DEVELOPER"],
  email: "prahaspathi82@gmail.com",
  phone: "+91 95977 58455",
  phoneLink: "+919597758455",
  // Set after uploading the PDF from the allowlisted dashboard account.
  resumeUrl: "",
  education: "Diploma Student",
  experienceYears: "2 Years",
  about: [
    "I'm a passionate Diploma student with a strong interest in software development, web technologies, and cybersecurity. I enjoy exploring new technologies, building real-world projects, and transforming creative ideas into functional digital solutions.",
    "My journey involves learning programming, frontend development, backend technologies, database management, and web security. I'm constantly improving my technical skills through hands-on projects and practical learning.",
  ],
  focus: ["Frontend Development", "Backend Technologies", "Database Management", "Web Security"],
  tools: ["Next.js", "React", "Supabase", "Tailwind CSS"],
};

export const contentIndex = [
  { num: "01", label: "Introduction", href: "#intro" },
  { num: "02", label: "Skills", href: "#skills" },
  { num: "03", label: "Learning", href: "#learning" },
  { num: "04", label: "Experience", href: "#experience" },
  { num: "05", label: "Projects", href: "#projects" },
  { num: "06", label: "Contact", href: "#contact" },
];

export const skills = [
  { name: "C", category: "Programming", mark: "C" },
  { name: "Java", category: "Programming", mark: "J" },
  { name: "C++", category: "Programming", mark: "C+" },
  { name: "SQL", category: "Database", mark: "DB" },
  { name: "React", category: "Frontend", mark: "R" },
  { name: "Node.js", category: "Backend", mark: "N" },
];

// Edit this list in lib/data.ts whenever your learning focus changes.
export const currentlyLearning = [
  { name: "React", note: "Building interactive interfaces", mark: "01" },
  { name: "Node.js", note: "Learning backend development", mark: "02" },
  { name: "SQL", note: "Working with data and databases", mark: "03" },
];

export const experience = [
  {
    company: "LBXSuite",
    role: "Frontend Developer Intern",
    period: "Internship · 2 months",
    text: "Hands-on frontend development experience in a start-up environment, working on real product screens.",
    link: "https://lbxsuite.com/",
  },
  {
    company: "Growth Nest Tech Solutions",
    role: "Junior Developer · Non-Tech Roles",
    period: "Present",
    text: "Growing as a junior developer in the tech team while also supporting the company in non-technical work.",
    link: "https://www.growthnesttechsolution.in/",
  },
];

export type PortfolioProject = {
  title: string;
  name: string;
  category: string;
  text: string;
  tools: string[];
  link?: string;
  image?: string;
  imageSize?: [number, number];
  art?: string;
  monogram?: string;
  artTitle?: string;
  concept?: boolean;
};

export const projects: PortfolioProject[] = [
  {
    title: "E-COMMERCE WEBSITE",
    name: "Inoovexaa",
    category: "Live project",
    text: "A fashion e-commerce storefront for a women's dress brand, with category and occasion browsing, search, wishlist and cart, powered by a Supabase backend.",
    tools: ["Next.js", "Supabase"],
    link: "https://inoovexaa-project2.vercel.app",
    image: "/images/inoovexaa.png",
    imageSize: [1901, 981] as [number, number],
  },
  {
    title: "PERSONAL PORTFOLIO",
    name: "Prahaspathi",
    category: "Live project",
    text: "This portfolio, designed as a wall of presentation slides, with scroll animations, a cartoon hero and a light and dark theme.",
    tools: ["Next.js", "React", "Framer Motion", "Tailwind CSS"],
    link: "https://my-portfolio-ten-lemon-31.vercel.app/",
    image: "/images/project2.png",
    imageSize: [1148, 646] as [number, number],
  },
  {
    title: "HABIT TRACKER",
    name: "Orbit",
    category: "Concept project",
    text: "A calm habit-tracking dashboard concept with weekly streaks, small daily goals, and a visual progress calendar.",
    tools: ["React", "Node.js", "SQL"],
    art: "orbit",
    monogram: "O",
    artTitle: "Small steps.\nBig orbit.",
    concept: true,
  },
  {
    title: "LOCAL FOOD FINDER",
    name: "BiteMap",
    category: "Concept project",
    text: "A neighborhood food discovery concept for saving local favorites, browsing by craving, and finding a new place nearby.",
    tools: ["React", "Node.js", "SQL"],
    art: "bitemap",
    monogram: "B",
    artTitle: "Good food,\nclose by.",
    concept: true,
  },
  {
    title: "STUDY PLANNER",
    name: "StudySprint",
    category: "Concept project",
    text: "A student study-planner concept with focused study sessions, subject tracking, and a simple overview of upcoming revision.",
    tools: ["React", "Node.js", "SQL"],
    art: "studysprint",
    monogram: "S",
    artTitle: "Focus on\nwhat matters.",
    concept: true,
  },
];

export type PortfolioContent = {
  profile: typeof profile;
  contentIndex: typeof contentIndex;
  skills: typeof skills;
  currentlyLearning: typeof currentlyLearning;
  experience: typeof experience;
  projects: PortfolioProject[];
};

export const defaultPortfolioContent: PortfolioContent = {
  profile,
  contentIndex,
  skills,
  currentlyLearning,
  experience,
  projects,
};
