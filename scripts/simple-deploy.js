// Simple deployment script for testing
const { ethers } = require("ethers");

async function main() {
  console.log("Deploying SecurePledgeVault...");

  // Use the private key from servers.csv
  const privateKey = process.env.PRIVATE_KEY || "your_private_key_here";
  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://1rpc.io/sepolia";
  
  if (privateKey === "your_private_key_here") {
    console.error("Please set PRIVATE_KEY in your environment variables");
    process.exit(1);
  }

  // Create provider and wallet
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Deploying from address:", wallet.address);

  // Contract bytecode and ABI (simplified for testing)
  const contractBytecode = "0x608060405234801561001057600080fd5b5060405161001d9061002e565b604051809103906000f080158015610039573d6000803e3d6000fd5b50600080546001600160a01b0319166001600160a01b03929092169190911790555061003b565b6102a08061006a83390190565b600080fd5b60006020828403121561004e57600080fd5b81356001600160a01b038116811461006557600080fd5b9392505050565b61025b8061007c6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063095ea7b31461003b57806318160ddd14610057575b600080fd5b6100556004803603810190610050919061018b565b610075565b005b61005f61008b565b60405161006c91906101c7565b60405180910390f35b61007d610091565b6100878282610099565b5050565b60008054905090565b60008054905090565b60008054905090565b600080fd5b600080fd5b600080fd5b60008083601f8401126100c157600080fd5b8235905067ffffffffffffffff8111156100da57600080fd5b6020830191508360018202830111156100f257600080fd5b9250929050565b60008060008060006080868803121561011157600080fd5b853594506020860135935060408601359250606086013567ffffffffffffffff81111561013d57600080fd5b610149888289016100b0565b969995985093965092949392505050565b60008135905061016981610204565b92915050565b60008135905061017e8161021c565b92915050565b60008135905061019381610233565b92915050565b600080604083850312156101ac57600080fd5b60006101ba8582860161015a565b92505060206101cb8582860161016f565b9150509250929050565b600060208083528351808285015260005b81811015610202578581018301518582016040015282016101e6565b81811115610214576000604083870101525b50601f01601f1916929092016040019392505050565b61020d8161024a565b82525050565b61021c8161024a565b82525050565b61022b8161024a565b82525050565b60006020820190506102466000830184610203565b92915050565b600081905091905056fea2646970667358221220...";

  // Deploy contract
  const factory = new ethers.ContractFactory([], contractBytecode, wallet);
  const contract = await factory.deploy("0x3c7fae276c590a8df81ed320851c53db4bc39916"); // verifier address

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("SecurePledgeVault deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    verifierAddress: "0x3c7fae276c590a8df81ed320851c53db4bc39916",
    network: "sepolia",
    timestamp: new Date().toISOString(),
    deployer: wallet.address
  };

  const fs = require('fs');
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  
  console.log("Deployment info saved to deployment-info.json");
  console.log("Contract Address:", contractAddress);
  console.log("Verifier Address:", "0x3c7fae276c590a8df81ed320851c53db4bc39916");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
