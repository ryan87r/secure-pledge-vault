import { FHEBadge } from "@/components/FHEBadge";
import { WalletConnect } from "@/components/WalletConnect";

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FHEBadge />
          <div>
            <h1 className="text-xl font-bold text-foreground">Secure Pledge Vault</h1>
            <p className="text-xs text-muted-foreground">Privacy-Preserving Crowdfunding with FHE</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-foreground hover:text-primary transition-colors"
          >
            Projects
          </button>
          <button 
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-foreground hover:text-primary transition-colors"
          >
            How It Works
          </button>
          <button 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-foreground hover:text-primary transition-colors"
          >
            About
          </button>
        </nav>

        <WalletConnect />
      </div>
    </header>
  );
};

export default Header;