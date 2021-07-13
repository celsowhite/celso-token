<template>
  <div class="app">
    <div class="app__content" v-if="activeAccount">
      <h3>Account #</h3>
      <p>{{ activeAccount }}</p>

      <h3>ETH Balance</h3>
      <p>{{ $filters.toEth(activeBalance) }} ETH</p>
      <p>{{ $filters.toWei(activeBalance) }} Wei</p>

      <h3>{{ tokenSymbol }} Token</h3>
      <p v-if="userBalance">
        {{ $filters.toEth(userBalance) }} {{ tokenSymbol }}
      </p>

      <h3>Quantity</h3>
      <form
        @submit.prevent="
          this.$store.dispatch(
            'celsoTokenContract/buyTokens',
            this.tokenQuantity
          )
        "
      >
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
        tokenQuantity: 1,
      };
    },
    mounted: async function () {
      // Check for any accounts currently connected.
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        await this.$store.dispatch("account/connectAccount");
        this.$store.dispatch("celsoTokenContract/getContractData");
      }

      // Setup an event listener for the account being changed.
      this.$store.dispatch("account/setupEthereumListeners");
    },
    methods: {},
    computed: {
      ...mapState("account", {
        activeAccount: (state) => state.activeAccount,
        activeBalance: (state) => state.activeBalance,
      }),
      ...mapState("celsoTokenContract", {
        tokenSymbol: (state) => state.symbol,
        userBalance: (state) => state.userBalance,
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
