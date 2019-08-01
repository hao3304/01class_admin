import service from "@/services/me";
export default {
  namespaced: true,
  state: {
    system: {},
    me: {}
  },
  actions: {
    async init({ commit }) {
      const rep = await service.loads();
      commit("SET_INIT", rep.me);
    }
  },
  mutations: {
    SET_INIT(state, payload) {
      state.me = payload;
    },
    SET_TYPES(state, payload) {
      state.types = payload;
    }
  },
  getters: {
    getDict: state => key => {
      const dict = state.dicts.find(dict => dict.id == key);
      return dict ? dict.values : [];
    },
    getDictVal: state => {
      return function(key, value) {
        const target = state.dicts.find(dict => dict.id == key);
        const values = target ? target.values : [];
        const dict = values.find(v => v.value == value);
        return dict ? dict.name : "-";
      };
    }
  }
};
