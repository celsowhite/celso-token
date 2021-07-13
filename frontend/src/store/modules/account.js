import { markRaw, isReactive } from "vue";
import { ethers } from "ethers";
import CelsoToken from "../../../../artifacts/contracts/CelsoToken.sol/CelsoToken.json";

/*----------------------------
State
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
  /**
   * Connect Account
   *
   * Get the ethereum provider, signer and network info.
   */
  async connectAccount({ commit }) {
    // Provider - Connection to the ethereum network.
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const rawProvider = markRaw(provider);
    const network = await provider.getNetwork();

    // Signer - Data about this particular ethereum user.
    const signer = provider.getSigner();
    const rawSigner = markRaw(signer);
    const signerAddress = await signer.getAddress();
    const signerBalance = await signer.getBalance();

    // Set account info in the global store.
    commit("setActiveAccount", signerAddress);
    commit("setActiveBalance", signerBalance);
    commit("setEthersProvider", rawProvider);
    commit("setSigner", rawSigner);
    commit("setNetwork", network);

    return;
  },

  /**
   * Request Account
   *
   * Request access to the users metamask account. Triggers the metamask popup.
   */
  async requestAccount({ commit, dispatch }) {
    // Request access to the users metamask. Requesting access will resolve with a list of the users accounts we have access to.
    // Once given access then we can connect to the ethereum network and the users account.
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      alert("Please connect to MetaMask.");
    } else {
      dispatch("connectAccount");
    }
  },

  /**
   * Setup Ethereum Listeners
   *
   * Init ethereum listeners to react to account changes.
   */
  async setupEthereumListeners({ commit, dispatch }) {
    // Accounts Changed
    window.ethereum.on("accountsChanged", (accounts) => {
      dispatch("connectAccount");
    });

    // Chain Changed
    window.ethereum.on("chainChanged", (chainId) => {
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
