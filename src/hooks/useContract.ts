import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { SECURE_PLEDGE_VAULT_ABI } from '@/lib/contract-abi';
import { CONTRACT_ADDRESS } from '@/lib/constants';
import { useState, useEffect, useMemo } from 'react';
import { useZamaInstance } from './useZamaInstance';
import { useEthersSigner } from './useEthersSigner';
import { Contract } from 'ethers';

export const useSecurePledgeVaultContract = () => {
  const { address, isConnected } = useAccount();
  const { instance, isLoading: fheLoading, error: fheError, isInitialized } = useZamaInstance();
  const signer = useEthersSigner();
  const [pledgeData, setPledgeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Create contract instance with useMemo to prevent recreation
  const contract = useMemo(
    () => (signer ? new Contract(CONTRACT_ADDRESS, SECURE_PLEDGE_VAULT_ABI, signer) : null),
    [signer]
  );

  // Check if contract address is valid
  const isValidContractAddress = CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x...' && CONTRACT_ADDRESS.startsWith('0x');

  // Read contract data - only if contract address is valid
  const { data: pledgeCounter } = useReadContract({
    address: isValidContractAddress ? CONTRACT_ADDRESS as `0x${string}` : undefined,
    abi: SECURE_PLEDGE_VAULT_ABI,
    functionName: 'pledgeCounter',
    query: {
      enabled: isValidContractAddress && isConnected,
    },
  });

  const { data: backingCounter } = useReadContract({
    address: isValidContractAddress ? CONTRACT_ADDRESS as `0x${string}` : undefined,
    abi: SECURE_PLEDGE_VAULT_ABI,
    functionName: 'backingCounter',
    query: {
      enabled: isValidContractAddress && isConnected,
    },
  });

  // Write contract functions
  const { writeContractAsync: createPledge } = useWriteContract();
  const { writeContractAsync: backPledge } = useWriteContract();
  const { writeContractAsync: verifyPledge } = useWriteContract();
  const { writeContractAsync: withdrawFunds } = useWriteContract();

  // Load pledge data from contract with proper dependency management
  useEffect(() => {
    const loadPledgeData = async () => {
      if (!pledgeCounter || !isConnected || !isValidContractAddress || !contract) {
        console.log('Skipping data load:', { pledgeCounter, isConnected, isValidContractAddress, hasContract: !!contract });
        return;
      }

      console.log(`Loading ${Number(pledgeCounter)} pledges from contract...`);
      setLoading(true);
      try {
        const pledges = [];
        const totalPledges = Number(pledgeCounter);

        for (let i = 0; i < Math.min(totalPledges, 10); i++) {
          try {
            console.log(`Loading pledge ${i}...`);
            const pledgeInfo = await contract.getPledgeInfo(i);
            console.log(`Pledge ${i} data:`, pledgeInfo);

            pledges.push({
              id: i,
              title: pledgeInfo.title,
              description: pledgeInfo.description,
              targetAmount: Number(pledgeInfo.targetAmount),
              currentAmount: Number(pledgeInfo.currentAmount),
              backerCount: Number(pledgeInfo.backerCount),
              isActive: pledgeInfo.isActive,
              isVerified: pledgeInfo.isVerified,
              pledger: pledgeInfo.pledger,
              startTime: Number(pledgeInfo.startTime) * 1000,
              endTime: Number(pledgeInfo.endTime) * 1000,
            });
            console.log(`Successfully loaded pledge ${i}: ${pledgeInfo.title}`);
          } catch (error) {
            console.error(`Error loading pledge ${i}:`, error);
            // Don't add fallback data, just skip this pledge
            console.log(`Skipping pledge ${i} due to error`);
          }
        }

        console.log(`Successfully loaded ${pledges.length} pledges`);
        setPledgeData(pledges);
      } catch (error) {
        console.error('Error loading pledge data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPledgeData();
  }, [pledgeCounter, isConnected, isValidContractAddress, contract]); // Added contract back to dependencies

  return {
    pledgeData,
    loading,
    pledgeCounter: Number(pledgeCounter || 0),
    backingCounter: Number(backingCounter || 0),
    isConnected,
    instance,
    signer,
    isValidContractAddress,
    fheLoading,
    fheError,
    isInitialized,
    createPledge: async (title: string, description: string, targetAmount: number, duration: number) => {
      if (!address) {
        throw new Error('Missing wallet connection');
      }

      try {
        const result = await createPledge({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: SECURE_PLEDGE_VAULT_ABI,
          functionName: 'createPledge',
          args: [title, description, BigInt(targetAmount), BigInt(duration)],
        });

        return result;
      } catch (err) {
        console.error('Error creating pledge:', err);
        throw err;
      }
    },
    backPledge: async (pledgeId: number, amount: number) => {
      if (!instance || !address || !signer) {
        throw new Error('Missing wallet or encryption service');
      }

      try {
        const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
        // For FHE encryption, use ETH amount (not wei) to stay within 32-bit limit
        // Convert to smallest unit that fits in 32-bit: multiply by 10^6 (micro-ETH)
        const amountInMicroETH = Math.floor(amount * 1e6);
        if (amountInMicroETH > 4294967295) {
          throw new Error('Amount too large for FHE encryption. Maximum: 4294.967295 ETH');
        }
        input.add32(BigInt(amountInMicroETH));
        const encryptedInput = await input.encrypt();

        // For actual ETH transfer, convert to wei
        const amountInWei = Math.floor(amount * 1e18);

        console.log('Encrypted input handles:', encryptedInput.handles);
        console.log('Encrypted input proof:', encryptedInput.inputProof);
        
        // Ensure handles and proof are properly formatted as hex strings
        const handle = typeof encryptedInput.handles[0] === 'string' 
          ? encryptedInput.handles[0] 
          : `0x${encryptedInput.handles[0].toString(16)}`;
        const proof = typeof encryptedInput.inputProof === 'string' 
          ? encryptedInput.inputProof 
          : `0x${encryptedInput.inputProof.toString(16)}`;

        const result = await backPledge({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: SECURE_PLEDGE_VAULT_ABI,
          functionName: 'backPledge',
          args: [BigInt(pledgeId), handle, proof],
          value: BigInt(amountInWei), // Send actual amount in wei
        });

        return result;
      } catch (err) {
        console.error('Error backing pledge:', err);
        throw err;
      }
    },
    verifyPledge: (pledgeId: number, isVerified: boolean) => {
      return verifyPledge({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: SECURE_PLEDGE_VAULT_ABI,
        functionName: 'verifyPledge',
        args: [BigInt(pledgeId), isVerified],
      });
    },
    withdrawFunds: (pledgeId: number) => {
      return withdrawFunds({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: SECURE_PLEDGE_VAULT_ABI,
        functionName: 'withdrawFunds',
        args: [BigInt(pledgeId)],
      });
    },
  };
};