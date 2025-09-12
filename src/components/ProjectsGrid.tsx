import ProjectCard from "./ProjectCard";
import { useSecurePledgeVaultContract } from "@/hooks/useContract";
import vrHeadsetImage from "@/assets/project-vr-headset.jpg";
import solarTechImage from "@/assets/project-solar-tech.jpg";
import smartHomeImage from "@/assets/project-smart-home.jpg";

const ProjectsGrid = () => {
  const { pledgeData, loading, isConnected } = useSecurePledgeVaultContract();

  // Mock data for demonstration when not connected
  const mockProjects = [
    {
      id: 0,
      title: "NeuralVR: Next-Gen Gaming Headset",
      description: "Revolutionary VR headset with neural interface technology for immersive gaming experiences. Direct brain-computer interaction for unprecedented realism.",
      pledger: "TechVision Labs",
      image: vrHeadsetImage,
      category: "Technology",
      targetAmount: 100000,
      currentAmount: 67000,
      backerCount: 234,
      isActive: true,
      isVerified: true,
      startTime: Date.now() - 86400000 * 15,
      endTime: Date.now() + 86400000 * 15,
      isEncrypted: true
    },
    {
      id: 1,
      title: "SolarFlow: Portable Clean Energy",
      description: "Compact solar panels with advanced energy storage. Perfect for off-grid living and emergency power backup systems.",
      pledger: "GreenTech Innovations",
      image: solarTechImage,
      category: "Green Tech",
      targetAmount: 75000,
      currentAmount: 66750,
      backerCount: 567,
      isActive: true,
      isVerified: true,
      startTime: Date.now() - 86400000 * 22,
      endTime: Date.now() + 86400000 * 8,
      isEncrypted: false
    },
    {
      id: 2,
      title: "HomeAI: Smart Living Assistant",
      description: "AI-powered home automation with holographic interface. Control your entire smart home with gesture and voice commands.",
      pledger: "FutureHome Solutions",
      image: smartHomeImage,
      category: "AI & IoT",
      targetAmount: 120000,
      currentAmount: 54000,
      backerCount: 128,
      isActive: true,
      isVerified: false,
      startTime: Date.now() - 86400000 * 8,
      endTime: Date.now() + 86400000 * 22,
      isEncrypted: true
    }
  ];

  const projects = isConnected && pledgeData.length > 0 ? pledgeData : mockProjects;

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Discover Secure Pledges
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover innovative projects with FHE-encrypted pledge amounts. 
            Support creators while maintaining complete financial privacy.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id || index} {...project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsGrid;