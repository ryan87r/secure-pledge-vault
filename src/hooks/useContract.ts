import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { SECURE_PLEDGE_VAULT_ABI } from '@/lib/contract-abi';
import { CONTRACT_ADDRESS } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { useZamaInstance } from './useZamaInstance';
import { useEthersSigner } from './useEthersSigner';
import { Contract } from 'ethers';

export const useSecurePledgeVaultContract = () => {
  const { address, isConnected } = useAccount();
  const { instance, isLoading: fheLoading, error: fheError, isInitialized } = useZamaInstance();
  const signer = useEthersSigner();
  const [pledgeData, setPledgeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  // Load pledge data
  useEffect(() => {
    const loadPledgeData = async () => {
      if (!pledgeCounter || !isConnected) return;
      
      setLoading(true);
      try {
        const pledges = [];
        const totalPledges = Number(pledgeCounter);
        
        for (let i = 0; i < Math.min(totalPledges, 10); i++) {
          // In a real implementation, you would call getPledgeInfo for each pledge
          // For now, we'll use mock data
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
        
        setPledgeData(pledges);
      } catch (error) {
        console.error('Error loading pledge data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPledgeData();
  }, [pledgeCounter, isConnected]); // Removed address from dependencies

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
            console.log('🚀 Starting pledge creation process...');
            console.log('📊 Input parameters:', { title, description, targetAmount, duration });

            console.log('🔄 Step 1: Calling contract...');
            const result = await createPledge({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: SECURE_PLEDGE_VAULT_ABI,
              functionName: 'createPledge',
              args: [title, description, BigInt(targetAmount), BigInt(duration)],
            });

            console.log('✅ Pledge creation successful!');
            return result;
          } catch (err) {
            console.error('❌ Error creating pledge:', err);
            throw err;
          }
        },
    backPledge: async (pledgeId: number, amount: number) => {
      if (!instance || !address || !signer) {
        throw new Error('Missing wallet or encryption service');
      }
      
      try {
        console.log('🚀 Starting FHE pledge backing process...');
        console.log('📊 Input parameters:', { pledgeId, amount });
        
        console.log('🔄 Step 1: Creating encrypted input...');
        const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
        
        console.log('🔄 Step 2: Adding backing amount to encrypted input...');
        input.add32(BigInt(amount));
        
        console.log('🔄 Step 3: Encrypting data...');
        const encryptedInput = await input.encrypt();
        console.log('✅ Encryption completed, handles count:', encryptedInput.handles.length);
        
        console.log('🔄 Step 4: Calling contract...');
        const result = await backPledge({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: SECURE_PLEDGE_VAULT_ABI,
          functionName: 'backPledge',
          args: [BigInt(pledgeId), encryptedInput.handles[0], encryptedInput.inputProof],
          value: BigInt(1000000000000000000), // 1 ETH in wei
        });
        
        console.log('✅ Pledge backing successful!');
        return result;
      } catch (err) {
        console.error('❌ Error backing pledge:', err);
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

export const useFHEOperations = () => {
  const { instance } = useZamaInstance();
  const [fheInitialized, setFheInitialized] = useState(false);

  useEffect(() => {
    if (instance) {
      setFheInitialized(true);
    }
  }, [instance]);

  const encryptValue = async (value: number, contractAddress: string, userAddress: string): Promise<{handles: string[], inputProof: string}> => {
    if (!instance) {
      throw new Error('FHE instance not initialized');
    }
    
    const input = instance.createEncryptedInput(contractAddress, userAddress);
    input.add32(BigInt(value));
    const encryptedInput = await input.encrypt();
    
    return {
      handles: encryptedInput.handles,
      inputProof: encryptedInput.inputProof
    };
  };

  const decryptValue = async (handle: string, contractAddress: string, userAddress: string): Promise<number> => {
    if (!instance) {
      throw new Error('FHE instance not initialized');
    }
    
    const keypair = instance.generateKeypair();
    const pairs = [{ handle, contractAddress }];
    const start = Math.floor(Date.now() / 1000).toString();
    const days = '1';
    const eip712 = instance.createEIP712(keypair.publicKey, [contractAddress], start, days);
    
    // This would need a signer to complete the decryption
    // For now, return 0 as placeholder
    return 0;
  };

  return {
    fheInitialized,
    encryptValue,
    decryptValue,
  };
};
