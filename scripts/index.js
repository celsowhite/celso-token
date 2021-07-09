const hre = require("hardhat");

async function main() {
  // Get The Contract
  const CelsoToken = await hre.ethers.getContractFactory("CelsoToken");
  const celsoTokenContract = CelsoToken.attach(
    "0x5fbdb2315678afecb367f032d93f642f64180aa3"
  );

  // Balance Of
  /* const balanceOfAccount = await celsoTokenContract.balanceOf(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  );
  console.log(`Owner Account Balance: ${balanceOfAccount}`); */

  // Total Supply
  /* const totalSupply = await celsoTokenContract.totalSupply();
  console.log(`Total Supply: ${totalSupply}`); */

  // Buy Tokens
  const amount = await celsoTokenContract.buyTokens(13, {
    value: ethers.utils.parseEther("39.0"),
  });
  console.log(`${amount.value.toString()} WEI`);
  console.log(`${ethers.utils.formatEther(amount.value.toString())} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
