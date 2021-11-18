import { markRaw } from "vue";
import { ethers } from "ethers";
import CelsoToken from "../../../../artifacts/contracts/CelsoToken.sol/CelsoToken.json";

/*----------------------------
State
----------------------------*/

const state = () => ({
  address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  symbol: null,
  value: null,
  userBalance: null,
  contract: null,
});

/*----------------------------
Mutations
----------------------------*/

const mutations = {
  // Set Contract
  setContract(state, contract) {
    state.contract = contract;
  },

  // Set Token Value
  setTokenValue(state, value) {
    state.value = value;
  },

  // Set Token Symbol
  setTokenSymbol(state, symbol) {
    state.symbol = symbol;
  },

  // Set User Balance
  setUserBalance(state, userBalance) {
    state.userBalance = userBalance;
  },
};

/*----------------------------
Actions
----------------------------*/

const actions = {
  /**
   * Get Contract Data
   *
   * Get the token info.
   */
  async getContractData({ state, commit, rootState }) {
    // Contract
    const contract = new ethers.Contract(
      state.address,
      CelsoToken.abi,
      rootState.account.provider
    );
    const rawContract = markRaw(contract);

    // Token Data
    const tokenValue = await contract.getTokenValue();
    const tokenSymbol = await contract.symbol();
    const userBalance = await contract.balanceOf(
      rootState.account.activeAccount
    );

    // Save Data
    commit("setContract", rawContract);
    commit("setTokenValue", tokenValue);
    commit("setTokenSymbol", tokenSymbol);
    commit("setUserBalance", userBalance);
  },

  /**
   * Buy Tokens
   *
   */
  async buyTokens({ state, commit, rootState }, quantity) {
    // Init the contract with the signer so we can make authenticated calls using eth.
    const contract = new ethers.Contract(
      state.address,
      CelsoToken.abi,
      rootState.account.signer
    );

    // Calculate the total value the user would like to purchase.
    const totalValue = quantity * state.value;

    // Call the contracts buy tokens method which mints the token quantity to the users account on the blockchain.
    await contract.buyTokens(quantity, {
      value: totalValue.toString(),
    });
  },
};

/*----------------------------
Getters
----------------------------*/

const getters = {};

/*----------------------------
Vuex Data
---
Export state, getters, actions and mutations so they can be used by vue instances and components.
----------------------------*/

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
