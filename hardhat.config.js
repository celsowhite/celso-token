const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-waffle");

// Accounts
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// Contract Owner Address
task("contractOwnerAddress", "Get the address of the deployed contracts owner", async () => {
  const CelsoToken = await ethers.getContractFactory("CelsoToken");
  const celsoTokenContract = await CelsoToken.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  // const balance = await celsoTokenContract.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  const symbol = await celsoTokenContract.symbol();
  console.log(symbol);
})

// Address Balance
task("balance", "Get balance of an address.", async () => {
  const balance = await ethers.provider.getBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  const etherBalance = ethers.utils.formatEther(balance.toString());
  console.log(`${etherBalance} ETH`);
})

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    }
  }
};

