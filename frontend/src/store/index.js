import { createStore, createLogger } from "vuex";
import account from "./modules/account";

const debug = process.env.NODE_ENV !== "production";

export default createStore({
  modules: {
    account,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
