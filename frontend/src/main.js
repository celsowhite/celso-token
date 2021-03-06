import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import { ethers } from "ethers";

// Create app instance
const app = createApp(App);

// Store
app.use(store);

// Filters
app.config.globalProperties.$filters = {
  toEth(bigNumber) {
    return `${ethers.utils.formatEther(bigNumber)}`;
  },
  toWei(bigNumber) {
    return `${ethers.utils.formatUnits(bigNumber, "wei")}`;
  },
};

// Mount App
app.mount("#app");
