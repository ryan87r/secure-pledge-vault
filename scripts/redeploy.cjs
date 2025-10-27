const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function main() {
  console.log('🚀 Starting contract redeployment...');
  
  // Check environment variables
  if (!process.env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY not found in environment variables');
  }
  if (!process.env.SEPOLIA_RPC_URL) {
    throw new Error('SEPOLIA_RPC_URL not found in environment variables');
  }

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log('📡 Connected to Sepolia network');
  console.log('👤 Deployer address:', wallet.address);
  
  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log('💰 Balance:', ethers.formatEther(balance), 'ETH');
  
  if (balance < ethers.parseEther('0.01')) {
    throw new Error('Insufficient balance for deployment');
  }

  // Read contract bytecode and ABI
  const contractPath = path.join(__dirname, '../artifacts/contracts/SecurePledgeVault.sol/SecurePledgeVault.json');
  
  if (!fs.existsSync(contractPath)) {
    throw new Error('Contract artifacts not found. Please run "npx hardhat compile" first.');
  }
  
  const contractArtifact = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  const bytecode = contractArtifact.bytecode;
  const abi = contractArtifact.abi;
  
  console.log('📄 Contract bytecode loaded');
  console.log('📋 Contract ABI loaded');

  // Deploy contract
  console.log('🔨 Deploying contract...');
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  
  // Use deployer address as verifier for demo purposes
  const verifierAddress = wallet.address;
  console.log('🔐 Using verifier address:', verifierAddress);
  
  const contract = await factory.deploy(verifierAddress);
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  console.log('✅ Contract deployed successfully!');
  console.log('📍 Contract address:', contractAddress);
  
  // Update constants file
  const constantsPath = path.join(__dirname, '../src/lib/constants.ts');
  const constantsContent = `export const CONTRACT_ADDRESS = "${contractAddress}";`;
  
  fs.writeFileSync(constantsPath, constantsContent);
  console.log('📝 Updated constants.ts with new contract address');
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: wallet.address,
    network: 'sepolia',
    timestamp: new Date().toISOString(),
    transactionHash: contract.deploymentTransaction()?.hash
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../deployment-info.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log('💾 Saved deployment info to deployment-info.json');
  
  console.log('🎉 Deployment completed successfully!');
  console.log('📋 Next steps:');
  console.log('1. Update frontend with new contract address');
  console.log('2. Run initialization script to add demo data');
  console.log('3. Test the application');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
