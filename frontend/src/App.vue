<template>
  <div class="app">
    <div class="app__content" v-if="activeAccount">
      <h3>Account #</h3>
      <p>{{ activeAccount }}</p>

      <h3>ETH Balance</h3>
      <p>{{ $filters.toEth(activeBalance) }}</p>
      <p>{{ $filters.toWei(activeBalance) }}</p>

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
      <button @click="this.$store.dispatch('account/requestAccount')">
        Connect
      </button>
    </div>
  </div>
</template>

<script>
  import { ethers } from "ethers";
  import CelsoToken from "../../artifacts/contracts/CelsoToken.sol/CelsoToken.json";
  import { mapState } from "vuex";

  export default {
    name: "App",
    components: {},
    data() {
      return {
        contractAddress: {
          celsoToken: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        },
        celsoToken: {
          symbol: null,
          balance: null,
        },
        tokenQuantity: 1,
      };
    },
    mounted: async function () {
      // Check for any accounts currently connected.
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        this.$store.dispatch("account/connectAccount");
      }
      // Setup an event listener for the account being changed.
      this.$store.dispatch("account/setupEthereumListeners");
    },
    methods: {
      /*---------------------
      Initialize Dapp
      ---------------------*/
      async initializeDapp() {
        // Contract
        // The contract we'd like to interact with.
        const contract = new ethers.Contract(
          this.contractAddress.celsoToken,
          CelsoToken.abi,
          this.provider
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
      Buy Tokens
      ---------------------*/
      async buyTokens() {
        // Get the provider. When this is called, the user should already be authenticated by metamask.
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
    computed: {
      ...mapState("account", {
        activeAccount: (state) => state.activeAccount,
        activeBalance: (state) => state.activeBalance,
      }),
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
