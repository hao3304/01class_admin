import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import app from "./app";
import common from "./common";
import router from "@/router";
import ls from "@/libs/ls";
// import iot from "fvc-iot/src/store";

export default new Vuex.Store({
  state: {
    token: "",
    windowHeight: document.documentElement.clientHeight,
    windowWidth: document.documentElement.clientWidth,
    winHeight: document.documentElement.clientHeight,
    winWidth: document.documentElement.clientWidth
  },
  mutations: {
    set_token(state, payload) {
      state.token = payload;
    },
    logout(state) {
      state.token = null;
      ls.set("token", null);
    },
    set_window_height(state, payload) {
      state.windowHeight = payload;
      state.winHeight = payload;
    },
    set_window_width(state, payload) {
      state.windowWidth = payload;
      state.winWidth = payload;
    }
  },
  getters: {
    getModel: state => (id, target = "iot", obj) => {
      const model = {};
      const types =
        (target ? state.common.types[target] : state.common.types["iot"]) || [];
      const type = types.find(type => type.name == id);
      if (type) {
        type.inputFields.forEach(field => {
          model[field.name] = null;
        });
      }
      return obj ? Object.assign(model, obj) : model;
    },
    getFieldName: state => (id, target) => {
      const model = {};
      const types =
        (target ? state.common.types[target] : state.common.types["iot"]) || [];
      const type = types.find(type => type.name == id);
      if (type) {
        const fields =
          type.inputFields.length > 0 ? type.inputFields : type.fields;
        fields.forEach(field => {
          model[field.name] = field.description || field.name;
        });
      }
      return model;
    }
  },
  modules: {
    app,
    common
  }
});
