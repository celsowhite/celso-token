import { markRaw, isReactive } from "vue";
import { ethers } from "ethers";
import CelsoToken from "../../../../artifacts/contracts/CelsoToken.sol/CelsoToken.json";

/*----------------------------
State
---
Root state object that holds the global state for the site.
----------------------------*/

const state = () => ({
  activeAccount: null,
  activeBalance: null,
  provider: null,
  signer: null,
  networkId: null,
  networkName: null,
});

/*----------------------------
Mutations
----------------------------*/

const mutations = {
  // Set Active Account
  setActiveAccount(state, selectedAddress) {
    state.activeAccount = selectedAddress;
  },

  // Set Active Balance
  setActiveBalance(state, balance) {
    state.activeBalance = balance;
  },

  // Set Ethers Provider
  setEthersProvider(state, provider) {
    state.provider = provider;
  },

  // Set Signer
  setSigner(state, signer) {
    state.signer = signer;
  },

  // Set Network
  setNetwork(state, network) {
    state.networkId = network.chainId;

    switch (network.chainId) {
      case 1:
        state.networkName = "Mainnet";
        break;
      case 42:
        state.networkName = "Kovan";
        break;
      case 3:
        state.networkName = "Ropsten";
        break;
      case 4:
        state.networkName = "Rinkeby";
        break;
      case 5:
        state.networkName = "Goerli";
        break;
      default:
        state.networkName = "Localhost";
        break;
    }
  },
};

/*----------------------------
Actions
----------------------------*/

const actions = {
  async connectAccount({ commit }) {
    // Provider - Connection to the ethereum network.
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const rawProvider = markRaw(provider);

    // Signer - Data about this particular ethereum user.
    const signer = provider.getSigner();
    const rawSigner = markRaw(signer);
    const signerAddress = await signer.getAddress();
    const signerBalance = await signer.getBalance();

    // Network
    const network = await provider.getNetwork();

    // Set account info in the global store.
    commit("setActiveAccount", signerAddress);
    commit("setActiveBalance", signerBalance);
    commit("setEthersProvider", rawProvider);
    commit("setSigner", rawSigner);
    commit("setNetwork", network);
  },

  async setupEthereumListener({ commit, dispatch }) {
    // Accounts Changed
    window.ethereum.on("accountsChanged", (accounts) => {
      dispatch("connectAccount");
    });

    // Chain Changed
    window.ethereum.on("chainChanged", (chainId) => {
      console.log(chainId);
      dispatch("connectAccount");
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
