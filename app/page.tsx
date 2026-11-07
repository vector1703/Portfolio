import Shell from "@/components/Shell";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Content from "@/components/Content";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Learning from "@/components/Learning";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import PortfolioContentProvider from "@/components/PortfolioContentProvider";

export default function Home() {
  return (
    <PortfolioContentProvider>
      <Shell>
        <main className="page-sections relative z-10 flex flex-col">
          <Hero />
          <Intro />
          <Content />
          <Skills />
          <Learning />
          <Experience />
          <Projects />
          <Contact />
        </main>
        <footer className="page-footer relative z-10 text-center text-xs tracking-[0.3em] uppercase opacity-60">
          © Prahaspathi
        </footer>
      </Shell>
    </PortfolioContentProvider>
  );
}
