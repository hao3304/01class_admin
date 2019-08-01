<template>
  <div id="app">
    <router-view v-if="token"></router-view>
<!--    <loading v-if="token && !me.id"></loading>-->
    <Login v-if="!token"> </Login>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import loading from "./views/loading";
import Login from "./views/login/login";
export default {
  components: { loading, Login },
  data() {
    return {};
  },
  computed: {
    ...mapState("common", ["types", "me"]),
    ...mapState(["token"])
  },
  watch: {
    $route() {
      this.getBreadCrumbs();
    }
  },
  async beforeCreate() {
    const token = this.$ls.get("token");
    if (token) {
      this.$store.commit("set_token", token);
      await this.$store.dispatch("common/init");
    } else {
      this.$router.replace({ name: "Login" });
    }
  },
  methods: {
    ...mapMutations("app", ["set_breadcrumbs"]),
    getBreadCrumbs() {
      const { matched } = this.$router.history.current;
      const rst = [];
      matched.forEach(match => {
        if (match.meta.title) {
          rst.push(match.meta.title);
        }
      });
      this.set_breadcrumbs(rst);
    }
  }
};
</script>
<style lang="less">
#app {
  height: 100%;
  min-width: 1280px;
  overflow: hidden;
  background-color: #eff3f6;
}
</style>
