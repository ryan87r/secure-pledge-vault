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
      if (!pledgeCounter || !isConnected || !isValidContractAddress || !contract) return;

      setLoading(true);
      try {
        const pledges = [];
        const totalPledges = Number(pledgeCounter);

        for (let i = 0; i < Math.min(totalPledges, 10); i++) {
          try {
            const pledgeInfo = await contract.getPledgeInfo(i);

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
          } catch (error) {
            console.error(`Error loading pledge ${i}:`, error);
            // Fallback to demo data if contract call fails
            pledges.push({
              id: i,
              title: `Pledge ${i + 1}`,
              description: `Description for pledge ${i + 1}`,
              targetAmount: 1000,
              currentAmount: Math.floor(Math.random() * 1000),
              backerCount: Math.floor(Math.random() * 50),
              isActive: true,
              isVerified: Math.random() > 0.5,
              pledger: address,
              startTime: Date.now() - Math.random() * 86400000 * 30,
              endTime: Date.now() + Math.random() * 86400000 * 30,
            });
          }
        }

        setPledgeData(pledges);
      } catch (error) {
        console.error('Error loading pledge data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPledgeData();
  }, [pledgeCounter, isConnected, isValidContractAddress]); // Removed contract from dependencies

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
        input.add32(BigInt(amount));
        const encryptedInput = await input.encrypt();

        const result = await backPledge({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: SECURE_PLEDGE_VAULT_ABI,
          functionName: 'backPledge',
          args: [BigInt(pledgeId), encryptedInput.handles[0], encryptedInput.inputProof],
          value: BigInt(1000000000000000000), // 1 ETH in wei
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