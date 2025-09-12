import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, Eye, Clock, Users, Shield } from "lucide-react";
import { useSecurePledgeVaultContract, useFHEOperations } from "@/hooks/useContract";
import { useState } from "react";

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
  isEncrypted 
}: ProjectCardProps) => {
  const { backPledge } = useSecurePledgeVaultContract();
  const { encryptValue, generateProof } = useFHEOperations();
  const [isBacking, setIsBacking] = useState(false);

  const progress = Math.min((currentAmount / targetAmount) * 100, 100);
  const daysLeft = Math.max(0, Math.ceil((endTime - Date.now()) / (1000 * 60 * 60 * 24)));

  const handleBackPledge = async () => {
    if (!id) return;
    
    setIsBacking(true);
    try {
      // Mock backing amount (in a real app, this would be user input)
      const backingAmount = 1000; // $1000
      const encryptedAmount = encryptValue(backingAmount);
      const proof = generateProof(backingAmount);
      
      await backPledge(id, encryptedAmount, proof);
    } catch (error) {
      console.error('Error backing pledge:', error);
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
          
          {/* Stats */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{backerCount} backers</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{daysLeft} days left</span>
            </div>
          </div>
          
          <Button 
            variant="default" 
            className="w-full"
            onClick={handleBackPledge}
            disabled={!isActive || isBacking || daysLeft <= 0}
          >
            {isBacking ? "Backing..." : daysLeft <= 0 ? "Ended" : "Back This Pledge"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;