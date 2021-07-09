<template>
  <div class="app">
    <div class="app__content" v-if="userAddress">
      <h3>Account #</h3>
      <p>{{ userAddress }}</p>

      <h3>ETH Balance</h3>
      <p>{{ userEthBalance }} ETH</p>

      <h3>{{ celsoToken.symbol }} Token</h3>
      <p>{{ celsoToken.balance }} {{ celsoToken.symbol }}</p>

      <h3>Quantity</h3>
      <form @submit.prevent="buyTokens">
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          v-model.number="tokenQuantity"
        />
        <button type="submit">Buy More Tokens</button>
      </form>
    </div>

    <div v-else>
      <button @click="connectToAccount()">Connect</button>
    </div>
  </div>
</template>

<script>
  import { ethers } from "ethers";
  import CelsoToken from "../../artifacts/contracts/CelsoToken.sol/CelsoToken.json";

  export default {
    name: "App",
    components: {},
    data() {
      return {
        contractAddress: {
          celsoToken: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        },
        userAddress: null,
        userEthBalance: null,
        celsoToken: {
          symbol: null,
          balance: null,
        },
        tokenQuantity: 1,
      };
    },
    mounted: async function () {
      // Check for any accounts currently connected.
      window.ethereum
        .request({ method: "eth_accounts" })
        .then(this.setupAccount);

      // Setup an event listener for the account being changed.
      window.ethereum.on("accountsChanged", (accounts) => {
        this.setupAccount(accounts);
      });
    },
    methods: {
      /*---------------------
      Initialize Dapp
      ---------------------*/
      async initializeDapp() {
        // Provider
        // Connection to the ethereum network.
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Signer
        // Data about this particular ethereum user.
        const signer = provider.getSigner();
        this.userAddress = await signer.getAddress();
        const ethBalance = await signer.getBalance();
        this.userEthBalance = ethers.utils.formatUnits(ethBalance.toString());

        // Contract
        // The contract we'd like to interact with.
        const contract = new ethers.Contract(
          this.contractAddress.celsoToken,
          CelsoToken.abi,
          provider
        );
        const value = await contract.getTokenValue();

        // Token Data
        const tokenBalance = await contract.balanceOf(this.userAddress);
        const tokenSymbol = await contract.symbol();

        this.celsoToken = {
          balance: ethers.utils.formatUnits(tokenBalance.toString()),
          symbol: tokenSymbol,
        };
      },

      /*---------------------
      Setup Account
      ---------------------*/
      async setupAccount(accounts) {
        if (accounts.length === 0) {
          alert("Please connect to MetaMask.");
        } else {
          this.initializeDapp();
        }
      },

      /*---------------------
      Connect To Account
      ---------------------*/
      async connectToAccount() {
        // Request access to the users metamask. Requesting access will resolve with a list of the users accounts we have access to.
        // Once given access then we can connect to the ethereum network and the users account.
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        this.setupAccount(accounts);
      },

      /*---------------------
      Buy Tokens
      ---------------------*/
      async buyTokens() {
        // Get the provider. When this is called, the user should already be authenticated by metamak.
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Get the signer and initialize the contract with it.
        // When sending ether you need to initialize contract via a signer not provider. Doing so allows us to initiate actions on the behalf of the signer.
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          this.contractAddress.celsoToken,
          CelsoToken.abi,
          signer
        );

        // Calculate the total value the user would like to purchase.
        const tokenValue = await contract.getTokenValue();
        const totalValue = this.tokenQuantity * tokenValue;

        // Call the contracts buy tokens method which mints the token quantity to the users account on the blockchain.
        await contract.buyTokens(this.tokenQuantity, {
          value: totalValue.toString(),
        });
      },
    },
  };
</script>

<style>
  .app {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: "helvetica";
  }
</style>
