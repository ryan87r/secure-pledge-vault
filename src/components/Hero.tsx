import { Button } from "@/components/ui/button";
import { Lock, Eye, DollarSign, Shield } from "lucide-react";
import { useSecurePledgeVaultContract } from "@/hooks/useContract";
import heroImage from "@/assets/hero-privacy-funding.jpg";

const Hero = () => {
  const { pledgeData, loading, isConnected } = useSecurePledgeVaultContract();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4 bg-card/20 backdrop-blur-sm rounded-full px-6 py-3 border border-primary/30">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">FHE Secured • Private • Decentralized</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Secure Pledge Vault
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A privacy-preserving crowdfunding platform built with Fully Homomorphic Encryption (FHE) technology. 
            Support creators while maintaining complete financial privacy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              variant="default" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Pledges
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Eye className="mr-2" />
              How It Works
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-card/10 backdrop-blur-sm rounded-lg p-6 border border-primary/20">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {isConnected ? `$${pledgeData.reduce((sum, pledge) => sum + pledge.currentAmount, 0).toLocaleString()}` : "Connect Wallet"}
              </div>
              <div className="text-sm text-muted-foreground">Total Raised (FHE Encrypted)</div>
            </div>
            <div className="bg-card/10 backdrop-blur-sm rounded-lg p-6 border border-primary/20">
              <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {isConnected ? pledgeData.length : "Connect Wallet"}
              </div>
              <div className="text-sm text-muted-foreground">Active Pledges</div>
            </div>
            <div className="bg-card/10 backdrop-blur-sm rounded-lg p-6 border border-primary/20">
              <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {isConnected ? pledgeData.reduce((sum, pledge) => sum + pledge.backerCount, 0) : "Connect Wallet"}
              </div>
              <div className="text-sm text-muted-foreground">Protected Backers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;