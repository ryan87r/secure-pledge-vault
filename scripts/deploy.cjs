const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SecurePledgeVault...");

  // Get the contract factory
  const SecurePledgeVault = await ethers.getContractFactory("SecurePledgeVault");

  // Deploy the contract with a verifier address (you can change this)
  const verifierAddress = "0x3c7fae276c590a8df81ed320851c53db4bc39916"; // Replace with actual verifier address
  const securePledgeVault = await SecurePledgeVault.deploy(verifierAddress);

  await securePledgeVault.waitForDeployment();

  const contractAddress = await securePledgeVault.getAddress();
  console.log("SecurePledgeVault deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    verifierAddress: verifierAddress,
    network: "sepolia",
    timestamp: new Date().toISOString(),
    deployer: await ethers.provider.getSigner().getAddress()
  };

  const fs = require('fs');
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  
  console.log("Deployment info saved to deployment-info.json");
  console.log("Contract Address:", contractAddress);
  console.log("Verifier Address:", verifierAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
