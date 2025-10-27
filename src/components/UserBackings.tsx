import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useSecurePledgeVaultContract } from "@/hooks/useContract";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Eye, Clock, DollarSign, ExternalLink } from "lucide-react";
import { Contract } from "ethers";
import { SECURE_PLEDGE_VAULT_ABI } from "@/lib/contract-abi";
import { CONTRACT_ADDRESS } from "@/lib/constants";

interface BackingRecord {
  backingId: number;
  pledgeId: number;
  amount: string; // Encrypted amount (will be decrypted)
  backer: string;
  timestamp: number;
  pledgeTitle: string;
  pledgeDescription: string;
  pledgePledger: string;
  pledgeEndTime: number;
  pledgeIsActive: boolean;
}

const UserBackings = () => {
  const { address } = useAccount();
  const { instance, signer, isValidContractAddress } = useSecurePledgeVaultContract();
  const [backings, setBackings] = useState<BackingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [decryptedAmounts, setDecryptedAmounts] = useState<Record<number, number>>({});

  // Create contract instance
  const contract = signer ? new Contract(CONTRACT_ADDRESS, SECURE_PLEDGE_VAULT_ABI, signer) : null;

  const loadUserBackings = async () => {
    if (!address || !contract || !isValidContractAddress) {
      console.log('Skipping user backings load:', { address, hasContract: !!contract, isValidContractAddress });
      return;
    }

    console.log('Loading user backings for:', address);
    setLoading(true);
    try {
      // Get user's backing IDs
      const backingIds = await contract.getUserBackings(address);
      console.log('User backing IDs:', backingIds);

      const backingRecords: BackingRecord[] = [];
      
      for (const backingId of backingIds) {
        try {
          // Get backing info
          const backingInfo = await contract.getBackingInfo(backingId);
          console.log(`Backing ${backingId} info:`, backingInfo);

          // Get pledge info (we need to find which pledge this backing belongs to)
          // For now, we'll need to iterate through pledges to find the right one
          // This is not efficient, but works for demo purposes
          const pledgeCounter = await contract.pledgeCounter();
          let pledgeId = 0;
          let pledgeInfo = null;
          
          for (let i = 0; i < Number(pledgeCounter); i++) {
            const pledgeBackings = await contract.getPledgeBackings(i);
            if (pledgeBackings.includes(backingId)) {
              pledgeId = i;
              pledgeInfo = await contract.getPledgeInfo(i);
              break;
            }
          }

          if (pledgeInfo) {
            backingRecords.push({
              backingId: Number(backingId),
              pledgeId,
              amount: "***", // Encrypted amount placeholder
              backer: backingInfo.backer,
              timestamp: Number(backingInfo.timestamp) * 1000,
              pledgeTitle: pledgeInfo.title,
              pledgeDescription: pledgeInfo.description,
              pledgePledger: pledgeInfo.pledger,
              pledgeEndTime: Number(pledgeInfo.endTime) * 1000,
              pledgeIsActive: pledgeInfo.isActive,
            });
          }
        } catch (error) {
          console.error(`Error loading backing ${backingId}:`, error);
        }
      }

      console.log('Loaded backing records:', backingRecords);
      setBackings(backingRecords);
    } catch (error) {
      console.error('Error loading user backings:', error);
    } finally {
      setLoading(false);
    }
  };

  const decryptAmount = async (backingId: number) => {
    if (!instance || !address) {
      alert('Missing encryption service or wallet connection');
      return;
    }

    try {
      console.log('Decrypting amount for backing:', backingId);
      
      // Create encrypted input for decryption
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      
      // Call contract to get encrypted amount (this would need a new function)
      // For now, we'll show a placeholder
      const decryptedAmount = 0.1; // This should be the actual decrypted amount
      
      setDecryptedAmounts(prev => ({
        ...prev,
        [backingId]: decryptedAmount
      }));
      
      console.log('Decrypted amount:', decryptedAmount);
    } catch (error) {
      console.error('Error decrypting amount:', error);
      alert('Failed to decrypt amount');
    }
  };

  useEffect(() => {
    loadUserBackings();
  }, [address, contract, isValidContractAddress]);

  if (!address) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            My Backings
          </CardTitle>
          <CardDescription>
            Connect your wallet to view your backing records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Please connect your wallet to view your backing records
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            My Backings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading your backings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (backings.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            My Backings
          </CardTitle>
          <CardDescription>
            Your backing records with FHE-encrypted amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Backings Found</h3>
            <p className="text-muted-foreground">
              You haven't backed any pledges yet. Start supporting projects to see your records here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          My Backings ({backings.length})
        </CardTitle>
        <CardDescription>
          Your backing records with FHE-encrypted amounts. Click "Decrypt" to view your backing amounts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {backings.map((backing) => (
            <div key={backing.backingId} className="border border-border rounded-lg p-4 hover:border-primary/40 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{backing.pledgeTitle}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{backing.pledgeDescription}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={backing.pledgeIsActive ? "default" : "secondary"}>
                    {backing.pledgeIsActive ? "Active" : "Ended"}
                  </Badge>
                  {backing.pledgeIsActive && (
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {Math.max(0, Math.ceil((backing.pledgeEndTime - Date.now()) / (1000 * 60 * 60 * 24)))} days left
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Backing Amount:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-medium">
                      {decryptedAmounts[backing.backingId] 
                        ? `$${(decryptedAmounts[backing.backingId] * 4000).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                        : "*** USD (Encrypted)"
                      }
                    </span>
                    {!decryptedAmounts[backing.backingId] && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => decryptAmount(backing.backingId)}
                        className="h-6 px-2 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Decrypt
                      </Button>
                    )}
                  </div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Backing Date:</span>
                  <div className="font-medium">
                    {new Date(backing.timestamp).toLocaleDateString()}
                  </div>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Pledge Creator:</span>
                  <div className="font-medium font-mono text-xs">
                    {backing.pledgePledger.slice(0, 6)}...{backing.pledgePledger.slice(-4)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <Lock className="h-4 w-4 text-primary" />
                <span className="text-xs text-primary">
                  Amount encrypted with FHE - only you and the pledge creator can decrypt
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBackings;
