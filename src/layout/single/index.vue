<template>
  <div class="f-single">
    <f-header></f-header>
    <div class="f-body">
      <f-nav></f-nav>
      <div class="f-main">
        <f-tab></f-tab>
        <div class="f-container">
          <keep-alive :include="keepAlive">
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
    <f-footer></f-footer>
  </div>
</template>

<script>
import FHeader from "./FHeader";
import FNav from "./FNav";
import FFooter from "./FFooter";
import FTab from "./FTab";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("app", ["keepAlive"])
  },
  components: {
    FHeader,
    FNav,
    FFooter,
    FTab
  }
};
</script>

<style lang="less">
@import "~@/style/theme.less";
.f-single {
  display: flex;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
  .f-body {
    overflow: hidden;
    flex: 1;
    display: flex;
    .f-main {
      flex: 1;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .f-container {
        flex: 1;
        overflow-y: auto;
        background-color: #eff3f6;
      }
    }
  }
}
</style>
