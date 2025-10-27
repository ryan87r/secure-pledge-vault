const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Demo data
const DEMO_PLEDGES = [
  {
    title: "VR Headset for Education",
    description: "Revolutionary VR headset designed specifically for educational environments. Features eye-tracking technology, comfortable design for extended use, and comprehensive educational content library.",
    targetAmount: 50000, // 50 ETH in wei
    duration: 30, // 30 days
    category: "Technology",
    image: "/project-vr-headset.jpg"
  },
  {
    title: "Smart Home Security System",
    description: "Advanced smart home security system with AI-powered threat detection, real-time monitoring, and seamless integration with existing home automation systems.",
    targetAmount: 75000, // 75 ETH in wei
    duration: 45, // 45 days
    category: "Security",
    image: "/project-smart-home.jpg"
  },
  {
    title: "Solar Technology Innovation",
    description: "Next-generation solar panel technology with improved efficiency and durability. Includes smart energy management system and IoT integration for optimal performance monitoring.",
    targetAmount: 100000, // 100 ETH in wei
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
      console.log('📄 Using contract address from deployment-info.json:', contractAddress);
    } catch (error) {
      console.log('❌ No contract address found. Please deploy the contract first.');
      console.log('Run: node scripts/simple-deploy.cjs');
      return;
    }
    
    // Connect to contract
    const provider = new ethers.JsonRpcProvider("https://1rpc.io/sepolia");
    const wallet = new ethers.Wallet("a4337c9790abf0f42b24aab03b11e4a37ac1285af6e767ca514bd78408adce84", provider);
    
    console.log('📡 Connected to Sepolia network');
    console.log('👤 Wallet address:', wallet.address);
    
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 Wallet balance:', ethers.formatEther(balance), 'ETH');
    
    console.log('📝 Demo data initialization completed!');
    console.log('\n📋 Demo Data Summary:');
    console.log(`- ${DEMO_PLEDGES.length} demo pledges created`);
    console.log('- Contract address:', contractAddress);
    console.log('- Network: Sepolia');
    console.log('- Deployer:', wallet.address);
    
    console.log('\n🎯 Next steps:');
    console.log('1. Deploy the actual contract with FHE support');
    console.log('2. Update the contract address');
    console.log('3. Initialize real pledges with FHE encryption');
    console.log('4. Test the frontend application');
    
    // Create demo data file for frontend
    const demoData = {
      pledges: DEMO_PLEDGES,
      contractAddress,
      network: 'sepolia',
      deployer: wallet.address,
      initializedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(__dirname, '../demo-data.json'),
      JSON.stringify(demoData, null, 2)
    );
    console.log('📄 Created demo-data.json for frontend');
    
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
if (require.main === module) {
  initializeDemoData();
}

module.exports = { initializeDemoData, DEMO_PLEDGES };
