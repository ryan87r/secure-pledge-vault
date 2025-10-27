const { ethers } = require('ethers');
require('dotenv').config();

// Contract ABI (updated for new interface)
const CONTRACT_ABI = [
  "function createPledge(string memory _title, string memory _description, uint256 _targetAmount, uint256 _duration) public returns (uint256)",
  "function backPledge(uint256 pledgeId, bytes32 amount, bytes calldata inputProof) public payable returns (uint256)",
  "function submitImpactReport(uint256 pledgeId, uint32 beneficiariesReached, bytes32 fundsUtilized, string memory reportHash, bytes calldata inputProof) public returns (uint256)"
];

// Demo data
const DEMO_PLEDGES = [
  {
    title: "VR Headset for Education",
    description: "Revolutionary VR headset designed specifically for educational environments. Features eye-tracking technology, comfortable design for extended use, and comprehensive educational content library.",
    targetAmount: 50, // 50 ETH
    duration: 30, // 30 days
    category: "Technology",
    image: "/project-vr-headset.jpg"
  },
  {
    title: "Smart Home Security System",
    description: "Advanced smart home security system with AI-powered threat detection, real-time monitoring, and seamless integration with existing home automation systems.",
    targetAmount: 75, // 75 ETH
    duration: 45, // 45 days
    category: "Security",
    image: "/project-smart-home.jpg"
  },
  {
    title: "Solar Technology Innovation",
    description: "Next-generation solar panel technology with improved efficiency and durability. Includes smart energy management system and IoT integration for optimal performance monitoring.",
    targetAmount: 100, // 100 ETH
    duration: 60, // 60 days
    category: "Environment",
    image: "/project-solar-tech.jpg"
  }
];

async function initializeDemoData() {
  try {
    console.log('🚀 Starting demo data initialization...');
    
    // Get contract address from deployment info
    let contractAddress;
    try {
      const deploymentInfo = require('../deployment-info.json');
      contractAddress = deploymentInfo.contractAddress;
      console.log('📄 Using contract address:', contractAddress);
    } catch (error) {
      console.log('❌ No contract address found. Please deploy the contract first.');
      console.log('Run: npm run deploy');
      return;
    }
    
    // Connect to contract
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || "https://1rpc.io/sepolia");
    const privateKey = process.env.PRIVATE_KEY;
    
    if (!privateKey) {
      throw new Error('PRIVATE_KEY environment variable is required');
    }
    
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wallet);
    
    console.log('👤 Using wallet:', wallet.address);
    console.log('💰 Wallet balance:', ethers.formatEther(await provider.getBalance(wallet.address)), 'ETH');
    
    console.log('📝 Creating demo pledges...');
    
    for (let i = 0; i < DEMO_PLEDGES.length; i++) {
      const pledge = DEMO_PLEDGES[i];
      console.log(`\n📋 Creating pledge ${i + 1}: ${pledge.title}`);
      
      try {
        // Create pledge with public target amount (no FHE encryption needed)
        const tx = await contract.createPledge(
          pledge.title,
          pledge.description,
          ethers.parseEther(pledge.targetAmount.toString()), // Convert to wei
          BigInt(pledge.duration * 24 * 60 * 60) // Convert days to seconds
        );
        
        console.log(`⏳ Transaction submitted: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`✅ Pledge ${i + 1} created successfully!`);
        console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
        
      } catch (error) {
        console.error(`❌ Error creating pledge ${i + 1}:`, error.message);
      }
    }
    
    console.log('\n🎉 Demo data initialization completed!');
    console.log('📊 Created', DEMO_PLEDGES.length, 'demo pledges');
    console.log('🌐 Contract address:', contractAddress);
    console.log('🔗 View on Etherscan: https://sepolia.etherscan.io/address/' + contractAddress);
    
  } catch (error) {
    console.error('❌ Initialization failed:', error);
  }
}

// Run the initialization
if (require.main === module) {
  initializeDemoData();
}

module.exports = { initializeDemoData, DEMO_PLEDGES };
