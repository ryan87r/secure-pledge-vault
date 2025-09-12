import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

// Configure supported chains for Secure Pledge Vault
export const config = getDefaultConfig({
  appName: 'Secure Pledge Vault',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_WALLET_CONNECT_PROJECT_ID',
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
  rpcUrl: import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID',
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '11155111'),
};
