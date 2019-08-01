import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ls from "@/libs/ls";
import "./filter";
import "@/components/index";
import vueBemCn from "vue-bem-cn";
import iView from "iview";
import fvc from "fvc";
Vue.use(iView);
Vue.use(fvc);
Vue.use(vueBemCn, {});
import "vue2-animate/dist/vue2-animate.min.css";
import "@/style/style.less";
import "iview/dist/styles/iview.css";
Vue.config.productionTip = false;
Vue.prototype.$ls = ls;
window.eventBus = new Vue();
export { Vue };

export default new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    window.onresize = () => {
      store.commit(
        "set_window_height",
        window.document.documentElement.clientHeight
      );
      store.commit(
        "set_window_width",
        window.document.documentElement.clientWidth
      );
    };

    let timer = null;
    window.onMapLoad = function() {
      timer = setInterval(() => {
        if (window.AMap && window.AMap.Map) {
          store.commit("app/set_map_load", true);
          clearInterval(timer);
        }
      }, 100);
    };
  }
}).$mount("#app");

router.beforeEach((to, from, next) => {
  if (to.matched.length == 0) {
    return next({ name: "404" });
  }
  iview.LoadingBar.start();
  if (!store.state.token && to.name != "Login") {
    iview.LoadingBar.finish();
    return next({ name: "Login" });
  }
  next();
});
router.afterEach(() => {
  iview.LoadingBar.finish();
});
