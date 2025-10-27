const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function main() {
  console.log('🚀 Starting data initialization...');
  
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
  console.log('👤 Initializer address:', wallet.address);
  
  // Read contract address
  const constantsPath = path.join(__dirname, '../src/lib/constants.ts');
  if (!fs.existsSync(constantsPath)) {
    throw new Error('constants.ts not found. Please deploy contract first.');
  }
  
  const constantsContent = fs.readFileSync(constantsPath, 'utf8');
  const contractAddressMatch = constantsContent.match(/CONTRACT_ADDRESS = "([^"]+)"/);
  if (!contractAddressMatch) {
    throw new Error('Contract address not found in constants.ts');
  }
  
  const contractAddress = contractAddressMatch[1];
  console.log('📍 Contract address:', contractAddress);
  
  // Read contract ABI
  const contractPath = path.join(__dirname, '../artifacts/contracts/SecurePledgeVault.sol/SecurePledgeVault.json');
  const contractArtifact = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  const contract = new ethers.Contract(contractAddress, contractArtifact.abi, wallet);
  
  console.log('📋 Contract instance created');

  // Demo data
  const demoPledges = [
    {
      title: "VR Headset for Education",
      description: "Revolutionary VR headset designed specifically for educational environments. Features eye-tracking technology, comfortable design for extended use, and comprehensive educational content library.",
      targetAmount: ethers.parseEther("10"), // 10 ETH
      duration: 30 * 24 * 60 * 60 // 30 days in seconds
    },
    {
      title: "Smart Home Security System",
      description: "Advanced smart home security system with AI-powered threat detection, real-time monitoring, and seamless integration with existing home automation systems.",
      targetAmount: ethers.parseEther("15"), // 15 ETH
      duration: 45 * 24 * 60 * 60 // 45 days in seconds
    },
    {
      title: "Solar Technology Innovation",
      description: "Next-generation solar panel technology with improved efficiency and durability. Includes smart energy management system and IoT integration for optimal performance monitoring.",
      targetAmount: ethers.parseEther("20"), // 20 ETH
      duration: 60 * 24 * 60 * 60 // 60 days in seconds
    }
  ];

  console.log('📝 Creating demo pledges...');
  
  // Create pledges
  for (let i = 0; i < demoPledges.length; i++) {
    const pledge = demoPledges[i];
    console.log(`Creating pledge ${i + 1}: ${pledge.title}`);
    
    try {
      const tx = await contract.createPledge(
        pledge.title,
        pledge.description,
        pledge.targetAmount,
        pledge.duration
      );
      
      const receipt = await tx.wait();
      console.log(`✅ Pledge ${i + 1} created. TX: ${tx.hash}`);
      
      // Wait a bit between transactions
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Failed to create pledge ${i + 1}:`, error.message);
    }
  }

  console.log('🎉 Data initialization completed!');
  console.log('📋 Summary:');
  console.log(`- Created ${demoPledges.length} demo pledges`);
  console.log(`- Contract address: ${contractAddress}`);
  console.log(`- Deployer: ${wallet.address}`);
  console.log('');
  console.log('🔗 Next steps:');
  console.log('1. Test the frontend application');
  console.log('2. Create some backing records by supporting pledges');
  console.log('3. Test the "My Backings" functionality');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  });
