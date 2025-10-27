import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, Eye, Clock, Users, Shield } from "lucide-react";
import { useSecurePledgeVaultContract } from "@/hooks/useContract";
import { useAccount } from "wagmi";
import { useState } from "react";
import { Contract } from "ethers";
import { SECURE_PLEDGE_VAULT_ABI } from "@/lib/contract-abi";
import { CONTRACT_ADDRESS } from "@/lib/constants";

interface ProjectCardProps {
  id?: number;
  title: string;
  description: string;
  pledger: string;
  image: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  backerCount: number;
  isActive: boolean;
  isVerified: boolean;
  startTime: number;
  endTime: number;
  isEncrypted: boolean;
  vaultBalance?: number;
}

const ProjectCard = ({ 
  id,
  title, 
  description, 
  pledger, 
  image, 
  category, 
  targetAmount,
  currentAmount,
  backerCount, 
  isActive,
  isVerified,
  startTime,
  endTime,
  isEncrypted,
  vaultBalance = 0
}: ProjectCardProps) => {
  const { address } = useAccount();
  const { instance, signer, backPledge } = useSecurePledgeVaultContract();
  const [isBacking, setIsBacking] = useState(false);
  const [backingAmount, setBackingAmount] = useState("0.1");

  const progress = Math.min((currentAmount / targetAmount) * 100, 100);
  const daysLeft = Math.max(0, Math.ceil((endTime - Date.now()) / (1000 * 60 * 60 * 24)));
  
  // Debug logging for time calculation
  console.log(`Pledge ${id} time debug:`, {
    endTime,
    currentTime: Date.now(),
    timeDiff: endTime - Date.now(),
    daysLeft,
    endDate: new Date(endTime).toLocaleDateString()
  });

  const handleBackPledge = async () => {
    if (!address) {
      alert('Please connect your wallet');
      return;
    }
    if (!backingAmount || parseFloat(backingAmount) <= 0) {
      alert('Please enter a valid backing amount');
      return;
    }
    setIsBacking(true);
    try {
      await backPledge(id || 0, parseFloat(backingAmount));
      alert('Pledge backed successfully!');
      setBackingAmount("0.1");
      // Refresh pledge data
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert('Backing failed');
    } finally {
      setIsBacking(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-card to-card/50 rounded-xl shadow-lg border border-primary/20 overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-xl">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        <Badge variant="secondary" className="absolute top-3 left-3">
          {category}
        </Badge>
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {isEncrypted && (
            <div className="bg-background/80 backdrop-blur-sm rounded-full p-2">
              <Lock className="h-4 w-4 text-primary" />
            </div>
          )}
          {isVerified && (
            <div className="bg-green-500/80 backdrop-blur-sm rounded-full p-2">
              <Shield className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-muted-foreground">by {pledger}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {description}
        </p>
        
        <div className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {isEncrypted ? "Progress (FHE Encrypted)" : "Progress"}
              </span>
              <span className="text-sm font-medium">
                {isEncrypted ? "***%" : `${progress.toFixed(1)}%`}
              </span>
            </div>
            <Progress 
              value={isEncrypted ? 0 : progress} 
              className="h-2"
            />
            {isEncrypted && (
              <div className="flex items-center gap-2 text-xs text-primary">
                <Eye className="h-3 w-3" />
                <span>Amounts encrypted with FHE</span>
              </div>
            )}
          </div>
          
          {/* Time Remaining Display */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Time Remaining
              </span>
              <span className={`text-sm font-medium ${daysLeft <= 0 ? 'text-red-500' : daysLeft <= 3 ? 'text-orange-500' : 'text-green-500'}`}>
                {daysLeft <= 0 ? 'Ended' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}
              </span>
            </div>
            {daysLeft > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Ends on {new Date(endTime).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          {/* Vault Balance Display */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Vault Balance
              </span>
              <span className="text-sm font-medium">
                {isEncrypted ? "*** ETH" : `${(vaultBalance / 1e18).toFixed(4)} ETH`}
              </span>
            </div>
            {isEncrypted && (
              <div className="flex items-center gap-2 text-xs text-primary">
                <Eye className="h-3 w-3" />
                <span>Vault balance encrypted with FHE</span>
              </div>
            )}
          </div>
          
          {/* Backing Amount Input */}
          {address && isActive && daysLeft > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Backing Amount (ETH)
              </label>
              <input
                type="number"
                value={backingAmount}
                onChange={(e) => setBackingAmount(e.target.value)}
                placeholder="0.1"
                step="0.01"
                min="0.000000000000000001"
                max="4294.967295"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
          
          <Button 
            variant="default" 
            className="w-full"
            onClick={handleBackPledge}
            disabled={!isActive || isBacking || daysLeft <= 0 || !address}
          >
            {isBacking ? "Backing..." : daysLeft <= 0 ? "Ended" : !address ? "Connect Wallet" : "Back This Pledge"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;