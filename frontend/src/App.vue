<template>
  <div class="app">
    <div class="app__content" v-if="userAddress">
      <h3>Account #</h3>
      <p>{{ userAddress }}</p>

      <h3>ETH Balance</h3>
      <p>{{ userEthBalance }} ETH</p>

      <h3>{{ celsoToken.symbol }} Token</h3>
      <p>{{ celsoToken.balance }} {{ celsoToken.symbol }}</p>
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
      };
    },
    mounted: async function () {
      // Check for any accounts currently connected.
      window.ethereum
        .request({ method: "eth_accounts" })
        .then(this.setupAccount);
    },
    methods: {
      /*---------------------
      Initialize Dapp
      ---------------------*/
      async initializeDapp() {
        this.initializeEthers();
      },

      /*---------------------
      Initialize Ethers
      ---------------------*/
      async initializeEthers() {
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

        // Token Data
        const tokenBalance = await contract.balanceOf(this.userAddress);
        const tokenSymbol = await contract.symbol();

        this.celsoToken = {
          balance: ethers.utils.formatUnits(tokenBalance.toString()),
          symbol: tokenSymbol,
        };
      },

      /*---------------------
      Get Token Data
      ---------------------*/
      async getTokenData() {
        // const tokenBalance = await contract.balanceOf();
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
