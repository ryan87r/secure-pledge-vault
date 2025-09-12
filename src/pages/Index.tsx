import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";
import HowItWorks from "@/components/HowItWorks";
import About from "@/components/About";

const Index = () => {
  return (
    <div className="min-h-screen bg-privacy-gradient">
      <Hero />
      <ProjectsGrid />
      <HowItWorks />
      <About />
    </div>
  );
};

export default Index;
