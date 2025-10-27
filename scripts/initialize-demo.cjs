const { ethers } = require('ethers');
const { createInstance, initSDK, SepoliaConfig } = require('@zama-fhe/relayer-sdk/bundle');

// Contract ABI (simplified for initialization)
const CONTRACT_ABI = [
  "function createPledge(string memory _title, string memory _description, bytes32 _targetAmount, uint256 _duration, bytes calldata inputProof) public returns (uint256)",
  "function backPledge(uint256 pledgeId, bytes32 amount, bytes calldata inputProof) public returns (uint256)",
  "function submitImpactReport(uint256 pledgeId, uint32 beneficiariesReached, bytes32 fundsUtilized, string memory reportHash, bytes calldata inputProof) public returns (uint256)"
];

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
    console.log('Initializing FHE SDK...');
    await initSDK();
    
    const instance = await createInstance(SepoliaConfig);
    console.log('FHE SDK initialized successfully');
    
    // Get contract address from environment or deployment info
    let contractAddress = process.env.VITE_CONTRACT_ADDRESS;
    
    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      // Try to read from deployment-info.json
      try {
        const deploymentInfo = require('../deployment-info.json');
        contractAddress = deploymentInfo.contractAddress;
        console.log('📄 Using contract address from deployment-info.json:', contractAddress);
      } catch (error) {
        console.log('❌ No contract address found. Please deploy the contract first.');
        console.log('Run: node scripts/deploy-contract.js');
        return;
      }
    }
    
    // Connect to contract (you'll need to provide a signer)
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || "https://1rpc.io/sepolia");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wallet);
    
    console.log('Creating demo pledges...');
    
    for (let i = 0; i < DEMO_PLEDGES.length; i++) {
      const pledge = DEMO_PLEDGES[i];
      console.log(`Creating pledge ${i + 1}: ${pledge.title}`);
      
      try {
        // Create encrypted input for target amount
        const input = instance.createEncryptedInput(contractAddress, wallet.address);
        input.add32(BigInt(pledge.targetAmount * 1e18)); // Convert to wei
        const encryptedInput = await input.encrypt();
        
        // Create pledge
        const tx = await contract.createPledge(
          pledge.title,
          pledge.description,
          encryptedInput.handles[0],
          BigInt(pledge.duration * 24 * 60 * 60), // Convert days to seconds
          encryptedInput.inputProof
        );
        
        await tx.wait();
        console.log(`✅ Pledge ${i + 1} created successfully: ${tx.hash}`);
        
        // Add some demo backings
        if (i === 0) { // Only add backings to first pledge for demo
          console.log('Adding demo backings...');
          
          const backingAmounts = [5000, 10000, 15000]; // 5, 10, 15 ETH in wei
          
          for (let j = 0; j < backingAmounts.length; j++) {
            const backingInput = instance.createEncryptedInput(contractAddress, wallet.address);
            backingInput.add32(BigInt(backingAmounts[j] * 1e18));
            const backingEncryptedInput = await backingInput.encrypt();
            
            const backingTx = await contract.backPledge(
              i, // pledgeId
              backingEncryptedInput.handles[0],
              backingEncryptedInput.inputProof,
              { value: ethers.parseEther(backingAmounts[j].toString()) }
            );
            
            await backingTx.wait();
            console.log(`✅ Backing ${j + 1} added: ${backingTx.hash}`);
          }
        }
        
      } catch (error) {
        console.error(`❌ Error creating pledge ${i + 1}:`, error.message);
      }
    }
    
    console.log('🎉 Demo data initialization completed!');
    
  } catch (error) {
    console.error('❌ Initialization failed:', error);
  }
}

// Run the initialization
if (require.main === module) {
  initializeDemoData();
}

module.exports = { initializeDemoData, DEMO_PLEDGES };
