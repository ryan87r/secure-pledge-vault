import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSecurePledgeVaultContract } from "@/hooks/useContract";
import { useAccount } from "wagmi";
import { Plus, Lock } from "lucide-react";
import { Contract } from "ethers";
import { SECURE_PLEDGE_VAULT_ABI } from "@/lib/contract-abi";
import { CONTRACT_ADDRESS } from "@/lib/constants";

const CreatePledgeForm = () => {
  const { address } = useAccount();
  const { instance, signer, createPledge } = useSecurePledgeVaultContract();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    duration: "30"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    setIsCreating(true);
    try {
      await createPledge(
        formData.title,
        formData.description,
        parseFloat(formData.targetAmount),
        parseInt(formData.duration)
      );
      
      alert('Pledge created successfully!');
      setFormData({ title: "", description: "", targetAmount: "", duration: "30" });
      // Refresh page to show new pledge
      window.location.reload();
    } catch (error) {
      console.error('Error creating pledge:', error);
      alert('Failed to create pledge. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!address) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Pledge
          </CardTitle>
          <CardDescription>
            Connect your wallet to create a new pledge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Please connect your wallet to create a new pledge
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Pledge
          <Lock className="h-4 w-4 text-primary" />
        </CardTitle>
        <CardDescription>
          Create a new pledge with FHE-encrypted target amount
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Pledge Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter pledge title"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your pledge project"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Target Amount (ETH)
            </label>
            <Input
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              placeholder="10.0"
              step="0.01"
              min="0.001"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              This amount will be encrypted with FHE
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Duration (Days)
            </label>
            <Input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="30"
              min="1"
              max="365"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Pledge"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePledgeForm;
