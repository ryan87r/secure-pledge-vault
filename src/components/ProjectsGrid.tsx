import ProjectCard from "./ProjectCard";
import { useSecurePledgeVaultContract } from "@/hooks/useContract";
import { useState, useEffect } from "react";

// Image mapping for demo projects
const IMAGE_MAP: Record<number, string> = {
  0: "/project-vr-headset.jpg",
  1: "/project-smart-home.jpg", 
  2: "/project-solar-tech.jpg"
};

const CATEGORY_MAP: Record<number, string> = {
  0: "Technology",
  1: "Security", 
  2: "Environment"
};

const ProjectsGrid = () => {
  const { pledgeData, loading, isConnected } = useSecurePledgeVaultContract();
  const [projects, setProjects] = useState<any[]>([]);
  const [demoData, setDemoData] = useState<any>(null);

  // Load demo data
  useEffect(() => {
    const loadDemoData = async () => {
      try {
        const response = await fetch('/demo-data.json');
        if (response.ok) {
          const data = await response.json();
          setDemoData(data);
        }
      } catch (error) {
        console.log('No demo data found, using contract data only');
      }
    };
    loadDemoData();
  }, []);

  useEffect(() => {
    if (pledgeData && pledgeData.length > 0) {
      // Transform contract data to project format
      const transformedProjects = pledgeData.map((pledge: any, index: number) => ({
        id: pledge.pledgeId || index,
        title: pledge.title || `Pledge ${index + 1}`,
        description: pledge.description || "No description available",
        pledger: pledge.pledger || "Unknown",
        image: IMAGE_MAP[index] || "/project-placeholder.jpg",
        category: CATEGORY_MAP[index] || "General",
        targetAmount: 0, // Will be decrypted from encrypted data
        currentAmount: 0, // Will be decrypted from encrypted data
        backerCount: pledge.backerCount || 0,
        isActive: pledge.isActive || false,
        isVerified: pledge.isVerified || false,
        startTime: pledge.startTime || Date.now(),
        endTime: pledge.endTime || Date.now() + 86400000 * 30,
        isEncrypted: true,
        vaultBalance: pledge.vaultBalance || 0
      }));
      setProjects(transformedProjects);
    } else if (demoData && demoData.pledges) {
      // Use demo data when no contract data is available
      const demoProjects = demoData.pledges.map((pledge: any, index: number) => ({
        id: index,
        title: pledge.title,
        description: pledge.description,
        pledger: "Demo Creator",
        image: IMAGE_MAP[index] || "/project-placeholder.jpg",
        category: pledge.category,
        targetAmount: pledge.targetAmount,
        currentAmount: Math.floor(pledge.targetAmount * 0.6), // 60% funded
        backerCount: Math.floor(Math.random() * 100) + 50,
        isActive: true,
        isVerified: true,
        startTime: Date.now() - 86400000 * 15,
        endTime: Date.now() + 86400000 * pledge.duration,
        isEncrypted: false,
        vaultBalance: Math.floor(pledge.targetAmount * 0.6)
      }));
      setProjects(demoProjects);
    } else {
      // Show empty state when no data
      setProjects([]);
    }
  }, [pledgeData, demoData]);

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
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">
              {isConnected ? "No pledges found. Be the first to create one!" : "Connect your wallet to view pledges"}
            </div>
            {!isConnected && (
              <div className="text-sm text-muted-foreground">
                Connect your wallet to interact with the platform
              </div>
            )}
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