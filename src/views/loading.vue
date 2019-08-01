<template>
  <div class="f-single">
    <f-header></f-header>
    <div class="f-body">
      <f-nav></f-nav>
      <div class="f-main">
        <f-tab></f-tab>
        <div class="f-container" style="overflow: hidden">
          <div
            class="skeletal"
            style="position: fixed;left: 50%;top:10%;margin-left: -42px;"
          >
            <div class="looping-rhombuses-spinner">
              <div class="rhombus"></div>
              <div class="rhombus"></div>
              <div class="rhombus"></div>
            </div>
            <p>加载中，请稍后</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FHeader from "@/layout/single/FHeader";
import FNav from "@/layout/single/FNav";
import FFooter from "@/layout/single/FFooter";
import FTab from "@/layout/single/FTab";
export default {
  components: {
    FHeader,
    FNav,
    FFooter,
    FTab
  }
};
</script>

<style lang="less"></style>
