import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";
import HowItWorks from "@/components/HowItWorks";
import About from "@/components/About";
import CreatePledgeForm from "@/components/CreatePledgeForm";
import UserBackings from "@/components/UserBackings";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Lock } from "lucide-react";

const Index = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'pledges' | 'my-backings'>('pledges');

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

      {/* Tab Navigation */}
      <section className="py-8 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={activeTab === 'pledges' ? 'default' : 'outline'}
              onClick={() => setActiveTab('pledges')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              All Pledges
            </Button>
            <Button
              variant={activeTab === 'my-backings' ? 'default' : 'outline'}
              onClick={() => setActiveTab('my-backings')}
              className="flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              My Backings
            </Button>
          </div>
        </div>
      </section>

      {/* Content based on active tab */}
      {activeTab === 'pledges' ? <ProjectsGrid /> : <UserBackings />}
      
      <HowItWorks />
      <About />
    </div>
  );
};

export default Index;
