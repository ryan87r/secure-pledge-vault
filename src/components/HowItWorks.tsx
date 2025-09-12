import { Shield, Lock, Eye, DollarSign } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Shield,
      title: "Connect Wallet",
      description: "Connect your crypto wallet securely to the platform. Your identity remains anonymous while maintaining full control."
    },
    {
      icon: Lock,
      title: "Make Private Pledge",
      description: "Pledge any amount to projects you love. Your pledge amount is encrypted and hidden from other backers and creators."
    },
    {
      icon: Eye,
      title: "Milestone Reveals",
      description: "When projects reach funding milestones (25%, 50%, 75%), pledge amounts are gradually revealed to build momentum."
    },
    {
      icon: DollarSign,
      title: "Release Funds",
      description: "Funds are automatically released to creators when milestones are met, ensuring accountability and progress."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-card/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How Privacy Funding Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our revolutionary system protects backer privacy while ensuring creator accountability 
            through milestone-based reveals and secure smart contracts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="bg-privacy-gradient rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-privacy-glow">
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-trust-green text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-card-gradient rounded-xl p-8 border border-privacy-primary/20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Why Privacy Matters in Crowdfunding
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold text-privacy-primary">Prevent Whale Influence</h4>
                <p className="text-sm text-muted-foreground">
                  Hidden pledges prevent large backers from influencing project direction or creating pressure.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-privacy-primary">Fair Competition</h4>
                <p className="text-sm text-muted-foreground">
                  Projects compete on merit, not just on who has the wealthiest network of supporters.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-privacy-primary">Backer Protection</h4>
                <p className="text-sm text-muted-foreground">
                  Your financial support remains private, protecting you from targeted marketing or exploitation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;