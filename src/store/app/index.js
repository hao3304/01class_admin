export default {
  namespaced: true,
  state: {
    modules: [
      {
        id: 1,
        name: "课程管理",
        icon: "iconzonglan",
        path: "Home"
      }
    ],
    module: 0,
    breadcrumbs: [],
    mapLoad: false,
    keepAlive: ["Dashboard", "VipMap"]
  },
  mutations: {
    set_module(state, payload) {
      state.module = payload;
    },
    set_breadcrumbs(state, payload) {
      state.breadcrumbs = payload;
    },
    set_map_load(state, payload) {
      state.mapLoad = payload;
    },
    set_keep_alive(state, payload) {
      if (!payload || payload.length == 0) {
        state.keepAlive = ["Dashboard", "VipMap"];
      } else {
        if (state.keepAlive.indexOf(payload) == -1) {
          state.keepAlive.push(payload);
        }
      }
    }
  }
};
