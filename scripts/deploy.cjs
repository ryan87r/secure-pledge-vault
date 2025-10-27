const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SecurePledgeVault contract...");

  // Get the contract factory
  const SecurePledgeVault = await ethers.getContractFactory("SecurePledgeVault");

  // Set the verifier address (use exact case from wallet)
  const verifierAddress = "0x3C7FAe276c590a8DF81eD320851C53DB4bC39916";
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());
  console.log("Verifier address:", verifierAddress);
  
  if (!deployer.address) {
    throw new Error("No deployer account found. Please check your private key configuration.");
  }

  const securePledgeVault = await SecurePledgeVault.deploy(verifierAddress);
  await securePledgeVault.waitForDeployment();

  const contractAddress = await securePledgeVault.getAddress();
  console.log("SecurePledgeVault deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    verifier: verifierAddress,
    network: "sepolia",
    timestamp: new Date().toISOString(),
    blockNumber: await deployer.provider.getBlockNumber()
  };

  console.log("Deployment completed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("Verifier:", verifierAddress);
  console.log("Network: sepolia");
  console.log("Timestamp:", deploymentInfo.timestamp);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });