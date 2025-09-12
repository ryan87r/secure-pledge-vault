import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

// Configure supported chains for Secure Pledge Vault
export const config = getDefaultConfig({
  appName: 'Secure Pledge Vault',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '2ec9743d0d0cd7fb94dee1a7e6d33475',
  chains: [sepolia, mainnet],
  ssr: false,
});

// Contract addresses (to be updated after deployment)
export const contractAddresses = {
  securePledgeVault: '0x...', // Will be set after contract deployment
  fheToken: '0x...', // FHE token contract address
};

// FHE SDK Configuration
export const fheConfig = {
  network: 'sepolia',
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://1rpc.io/sepolia',
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '11155111'),
};
