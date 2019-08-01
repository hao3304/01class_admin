import store from "store";
import expire from "store/plugins/expire";

store.addPlugin(expire);
const prefix = process.env.NAME;
export default {
  get(name) {
    return store.get(`${prefix}_${name}`);
  },
  set(name, value, time) {
    return store.set(`${prefix}_${name}`, value, time || null);
  }
};
