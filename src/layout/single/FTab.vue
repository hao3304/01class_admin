<template>
  <div :class="b()" v-if="breadcrumbs.length > 1">
    <Breadcrumb>
      <BreadcrumbItem v-for="breadcrumb in breadcrumbs" :key="breadcrumb">
        <i class="iconfont" :class="getIcon(breadcrumb)"></i>

        {{ breadcrumb }}</BreadcrumbItem
      >
    </Breadcrumb>
    <iframe
      allowtransparency="true"
      frameborder="0"
      width="210"
      class="iframe"
      height="28"
      scrolling="no"
      src="//tianqi.2345.com/plugin/widget/index.htm?s=3&z=1&t=1&v=0&d=1&bd=0&k=&f=&ltf=009944&htf=cc0000&q=1&e=0&a=1&c=54511&w=317&h=28&align=center"
    ></iframe>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "f-tab",
  computed: {
    ...mapState("app", ["breadcrumbs", "modules"])
  },
  methods: {
    getIcon(name) {
      const module = this.modules.find(module => module.name == name);
      return module ? module.icon : "";
    }
  }
};
</script>

<style lang="less">
.f-tab {
  height: 50px;
  border-bottom: 1px solid #e5e5e5;
  line-height: 50px;
  background-color: #fff;
  position: relative;
  padding: 0 20px;

  .iframe {
    position: absolute;
    right: 8px;
    top: 13px;
  }
}

@media only screen and(max-width: 1400px) {
  .f-tab {
    height: 40px;
    line-height: 40px;
    .ivu-breadcrumb {
      font-size: 12px;
    }

    .iframe {
      top: 8px;
    }
  }
}
</style>
