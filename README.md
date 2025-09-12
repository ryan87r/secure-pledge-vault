# Secure Pledge Vault

A privacy-preserving crowdfunding platform built with Fully Homomorphic Encryption (FHE) technology.

## Features

- **Privacy-Preserving Pledges**: All financial data is encrypted using FHE
- **Decentralized Verification**: Community-driven verification system
- **Reputation System**: Encrypted reputation tracking for users
- **Impact Reporting**: Transparent impact reporting with encrypted metrics
- **Multi-Chain Support**: Built on Ethereum with FHE capabilities

## Technologies

This project is built with:

- **Frontend**: Vite, TypeScript, React, shadcn-ui, Tailwind CSS
- **Blockchain**: Solidity, FHEVM, Wagmi, RainbowKit
- **Privacy**: Fully Homomorphic Encryption (FHE)
- **Wallet Integration**: RainbowKit with multiple wallet support

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A Web3 wallet (MetaMask, Rainbow, etc.)

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/ryan87r/secure-pledge-vault.git

# Step 2: Navigate to the project directory
cd secure-pledge-vault

# Step 3: Install dependencies
npm install

# Step 4: Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Step 5: Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID

# Infura Configuration (Optional)
NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_API_KEY
```

## Smart Contract

The project includes a Solidity smart contract (`SecurePledgeVault.sol`) that implements:

- FHE-encrypted pledge creation and backing
- Privacy-preserving reputation system
- Encrypted impact reporting
- Secure fund withdrawal mechanisms

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Smart Contract Deployment

1. Deploy the contract to Sepolia testnet
2. Update contract address in `src/lib/wallet-config.ts`
3. Verify contract on block explorer

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
