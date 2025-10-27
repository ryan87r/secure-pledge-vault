import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";
import HowItWorks from "@/components/HowItWorks";
import About from "@/components/About";
import CreatePledgeForm from "@/components/CreatePledgeForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="min-h-screen bg-privacy-gradient">
      <Hero />
      
      {/* Create Pledge Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Create Your Pledge
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Start your own privacy-preserving crowdfunding campaign with FHE encryption
            </p>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="mb-8"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showCreateForm ? "Hide Form" : "Create New Pledge"}
            </Button>
          </div>
          
          {showCreateForm && <CreatePledgeForm />}
        </div>
      </section>
      
      <ProjectsGrid />
      <HowItWorks />
      <About />
    </div>
  );
};

export default Index;
