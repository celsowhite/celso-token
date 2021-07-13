import { createStore, createLogger } from "vuex";
import account from "./modules/account";
import celsoTokenContract from "./modules/celsoTokenContract";

const debug = process.env.NODE_ENV !== "production";

export default createStore({
  modules: {
    account,
    celsoTokenContract,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
