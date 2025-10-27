const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Contract ABI (simplified for deployment)
const CONTRACT_ABI = [
  "constructor()",
  "function createPledge(string memory _title, string memory _description, bytes32 _targetAmount, uint256 _duration, bytes calldata inputProof) public returns (uint256)",
  "function backPledge(uint256 pledgeId, bytes32 amount, bytes calldata inputProof) public payable returns (uint256)",
  "function getPledgeInfo(uint256 pledgeId) public view returns (string memory, string memory, bytes32, bytes32, uint32, bool, bool, address, uint256, uint256)",
  "function getPledgeVaultBalance(uint256 pledgeId) public view returns (uint256)",
  "function getTotalVaultBalance() public view returns (uint256)",
  "function getContractBalance() public view returns (uint256)"
];

// Contract bytecode (you'll need to compile and get the actual bytecode)
const CONTRACT_BYTECODE = "0x608060405234801561001057600080fd5b50600436106100a95760003560e01c8063..."; // Placeholder

async function deployContract() {
  try {
    console.log('🚀 Starting contract deployment...');
    
    // Get configuration from environment
    const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://1rpc.io/sepolia";
    const privateKey = process.env.PRIVATE_KEY || "a4337c9790abf0f42b24aab03b11e4a37ac1285af6e767ca514bd78408adce84";
    
    if (!privateKey) {
      throw new Error('Private key not found in environment variables');
    }
    
    // Connect to Sepolia network
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log('📡 Connected to Sepolia network');
    console.log('👤 Deployer address:', wallet.address);
    
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 Wallet balance:', ethers.formatEther(balance), 'ETH');
    
    if (balance < ethers.parseEther("0.01")) {
      throw new Error('Insufficient balance for deployment. Need at least 0.01 ETH');
    }
    
    // Deploy contract
    console.log('📦 Deploying SecurePledgeVault contract...');
    const factory = new ethers.ContractFactory(CONTRACT_ABI, CONTRACT_BYTECODE, wallet);
    
    const contract = await factory.deploy();
    console.log('⏳ Deployment transaction:', contract.deploymentTransaction()?.hash);
    
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    console.log('✅ Contract deployed successfully!');
    console.log('📍 Contract address:', contractAddress);
    console.log('🔗 Etherscan:', `https://sepolia.etherscan.io/address/${contractAddress}`);
    
    // Update environment file
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add contract address
    if (envContent.includes('VITE_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /VITE_CONTRACT_ADDRESS=.*/,
        `VITE_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nVITE_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('📝 Updated .env file with contract address');
    
    // Update constants file
    const constantsPath = path.join(__dirname, 'src/lib/constants.ts');
    const constantsContent = `export const CONTRACT_ADDRESS = "${contractAddress}";`;
    fs.writeFileSync(constantsPath, constantsContent);
    console.log('📝 Updated constants file with contract address');
    
    // Create deployment info file
    const deploymentInfo = {
      contractAddress,
      network: 'sepolia',
      deployer: wallet.address,
      deploymentTime: new Date().toISOString(),
      transactionHash: contract.deploymentTransaction()?.hash
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'deployment-info.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log('📄 Created deployment-info.json');
    
    console.log('🎉 Deployment completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: node scripts/initialize-demo.js');
    console.log('2. Update frontend with new contract address');
    console.log('3. Test the application');
    
    return contractAddress;
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  deployContract();
}

module.exports = { deployContract };
