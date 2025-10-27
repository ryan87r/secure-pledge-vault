# 🔐 Secure Pledge Vault - FHE-Encrypted Crowdfunding Platform

> **The Future of Private Crowdfunding is Here**

Welcome to the world's first **Fully Homomorphic Encryption (FHE)** powered crowdfunding platform where your financial privacy is never compromised. Built on cutting-edge cryptographic technology, Secure Pledge Vault ensures that pledge amounts remain encrypted until project milestones are achieved.

![FHE Secured](https://img.shields.io/badge/FHE-Secured-00ff88?style=for-the-badge&logo=shield&logoColor=white)
![Privacy First](https://img.shields.io/badge/Privacy-First-ff6b6b?style=for-the-badge&logo=lock&logoColor=white)
![Web3 Ready](https://img.shields.io/badge/Web3-Ready-8b5cf6?style=for-the-badge&logo=ethereum&logoColor=white)

## 🌟 Project Status: COMPLETED ✅

This project has been successfully implemented with full FHE encryption capabilities:

### ✅ **Completed Features**

- **🔒 FHE-Encrypted Smart Contract**: All sensitive data (pledge amounts, backing amounts, reputation scores) are encrypted using FHE technology
- **🛡️ Privacy by Design**: No one can see pledge amounts until milestones are reached
- **⚡ Real-time Encryption**: All financial data is encrypted on-chain in real-time
- **🎯 Milestone-Based Revelation**: Choose when to reveal your contribution
- **🌐 Multi-Chain Ready**: Built for Ethereum with FHE capabilities
- **👥 Community Verification**: Decentralized verification system for projects
- **🔐 End-to-End Encryption**: Complete FHE workflow from frontend to blockchain

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   FHE Layer      │    │   Blockchain    │
│   (React/Vite)  │◄──►│   (Encryption)   │◄──►│   (Ethereum)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **⚡ Vite** - Lightning-fast build tool
- **⚛️ React 18** - Modern UI framework
- **🎨 Tailwind CSS** - Utility-first styling
- **🧩 shadcn/ui** - Beautiful component library
- **📱 Responsive Design** - Mobile-first approach

### Blockchain & Privacy
- **🔗 Wagmi v2.9.0** - React hooks for Ethereum
- **🌈 RainbowKit v2.2.8** - Wallet connection made simple
- **⚡ Viem v2.33.0** - TypeScript interface for Ethereum
- **🔐 FHEVM** - Fully Homomorphic Encryption on Ethereum
- **📜 Solidity** - Smart contract development

### Development Tools
- **📘 TypeScript** - Type-safe development
- **🔍 ESLint** - Code quality assurance
- **🎯 Prettier** - Code formatting
- **📦 npm** - Package management

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **Web3 Wallet** (MetaMask, Rainbow, etc.)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ryan87r/secure-pledge-vault.git
cd secure-pledge-vault

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp env.example .env.local

# 4. Edit .env.local with your configuration
# (See Environment Variables section below)

# 5. Start the development server
npm run dev
```

### 🔧 Environment Variables

Create a `.env.local` file with your configuration:

```env
# Network Configuration
SEPOLIA_RPC_URL=https://1rpc.io/sepolia
PRIVATE_KEY=your_private_key_here

# API Keys
ETHERSCAN_API_KEY=J8PU7AX1JX3RGEH1SNGZS4628BAH192Y3N
VITE_WALLET_CONNECT_PROJECT_ID=e08e99d213c331aa0fd00f625de06e66
VITE_RPC_URL=https://1rpc.io/sepolia

# Contract Configuration
VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Pinata IPFS Configuration
VITE_PINATA_API_KEY=your_pinata_api_key_here
VITE_PINATA_SECRET_KEY=your_pinata_secret_key_here
```

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🏛️ Smart Contract Features

Our `SecurePledgeVault.sol` contract implements:

- **🔐 FHE-Encrypted Storage**: All pledge amounts stored encrypted using `externalEuint32`
- **👤 Reputation System**: Encrypted user reputation tracking
- **📊 Impact Reporting**: Privacy-preserving project metrics
- **💰 Secure Withdrawals**: Milestone-based fund release
- **🛡️ Access Control**: Role-based permissions
- **🔒 Complete Privacy**: No sensitive data exposed on-chain

### Key FHE Functions:

```solidity
// Create pledge with encrypted target amount
function createPledge(
    string memory _title,
    string memory _description,
    externalEuint32 _targetAmount,
    uint256 _duration,
    bytes calldata inputProof
) public returns (uint256)

// Back pledge with encrypted amount
function backPledge(
    uint256 pledgeId,
    externalEuint32 amount,
    bytes calldata inputProof
) public payable returns (uint256)

// Submit impact report with encrypted metrics
function submitImpactReport(
    uint256 pledgeId,
    externalEuint32 beneficiariesReached,
    externalEuint32 fundsUtilized,
    string memory reportHash,
    bytes calldata inputProof
) public returns (uint256)
```

## 🔐 FHE Implementation Details

### Frontend Encryption Flow:

```typescript
// Initialize FHE instance
const { instance } = useZamaInstance();

// Create encrypted input
const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
input.add32(BigInt(targetAmount));

// Encrypt and get handles
const encryptedInput = await input.encrypt();
const handles = encryptedInput.handles;
const inputProof = encryptedInput.inputProof;

// Submit to contract
await contract.createPledge(title, description, handles[0], duration, inputProof);
```

### Key Features:

1. **🔒 Complete Data Privacy**: All financial amounts are encrypted with FHE
2. **🛡️ Zero-Knowledge Proofs**: Cryptographic proofs ensure data integrity
3. **⚡ Real-time Encryption**: Data encrypted before blockchain submission
4. **🎯 Selective Disclosure**: Choose when to reveal encrypted data
5. **🔐 End-to-End Security**: Privacy maintained throughout entire workflow

## 🌍 Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Configure Environment**: Set up environment variables
3. **Deploy**: Automatic deployment on every push

### Smart Contract Deployment

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.cjs --network sepolia
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💾 Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **📤 Push** to the branch (`git push origin feature/amazing-feature`)
5. **🔄 Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass

## 📚 Learn More

- **🔐 FHE Technology**: [FHEVM Documentation](https://docs.fhenix.xyz/)
- **⚛️ React**: [React Documentation](https://react.dev/)
- **🔗 Wagmi**: [Wagmi Documentation](https://wagmi.sh/)
- **🌈 RainbowKit**: [RainbowKit Documentation](https://www.rainbowkit.com/)

## 🐛 Troubleshooting

### Common Issues

**Wallet Connection Problems?**
- Ensure you're on the correct network (Sepolia)
- Check your WalletConnect Project ID
- Try refreshing the page

**Build Errors?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (v18+ required)
- Verify environment variables

**Contract Interaction Issues?**
- Ensure contract is deployed
- Check contract address in config
- Verify you have testnet ETH

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FHEVM Team** - For the amazing FHE technology
- **RainbowKit Team** - For seamless wallet integration
- **Vite Team** - For the incredible build tool
- **shadcn/ui** - For the beautiful components

## 📞 Support

- **🐛 Issues**: [GitHub Issues](https://github.com/ryan87r/secure-pledge-vault/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/ryan87r/secure-pledge-vault/discussions)
- **📧 Email**: biggish-gulper08@icloud.com

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by the Secure Pledge Vault Team

[![GitHub stars](https://img.shields.io/github/stars/ryan87r/secure-pledge-vault?style=social)](https://github.com/ryan87r/secure-pledge-vault)
[![GitHub forks](https://img.shields.io/github/forks/ryan87r/secure-pledge-vault?style=social)](https://github.com/ryan87r/secure-pledge-vault)

</div>