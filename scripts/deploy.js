const hre = require("hardhat");

async function deploy() {
  // Setup the contract.
  const CelsoToken = await hre.ethers.getContractFactory("CelsoToken");

  // Deploy the contract.
  const celsoTokenContract = await CelsoToken.deploy();
  await celsoTokenContract.deployed();
  
  console.log(`Contract deployed to ${ celsoTokenContract.address }.`);

  // Contract Address: 0x5fbdb2315678afecb367f032d93f642f64180aa3
  // Owner Address: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
}

// Run the deploy script.
deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
