<template>
  <div :class="b()" v-show="children.length > 0">
    <ul>
      <li :class="b('item')" v-for="item in children" :key="item.id">
        <a
          href="javascript:;"
          @click="onRoute(item.path)"
          :class="getChildActive(item.name, modules[module])"
        >
          <i class="iconfont" :class="item.icon"></i>
          <div>
            {{ item.name }}
          </div></a
        >
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "f-nav",
  computed: {
    ...mapState("app", ["modules", "module", "breadcrumbs"]),
    children() {
      if (this.breadcrumbs.length > 0) {
        return (
          this.modules.find(module => module.name == this.breadcrumbs[0])
            .children || []
        );
      } else {
        return [];
      }
    }
  },
  methods: {
    getChildActive(name, parent) {
      if (this.breadcrumbs.length >= 2 && this.breadcrumbs.indexOf(name) > -1) {
        return "active";
      }
      return "";
    },
    onRoute(name) {
      this.$router.push({ name });
    }
  }
};
</script>

<style lang="less">
.f-nav {
  background-color: #003661;
  width: 68px;
  height: 100%;
  border-top: 1px solid #000;
  &__menu {
    height: 49px;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    color: #bbb;
    font-size: 24px;
    line-height: 48px;
    text-align: center;
    background-color: rgb(8, 24, 52);
  }
  &__item {
    height: 68px;
    list-style: none;
    position: relative;
    a {
      display: flex;
      height: 100%;
      color: #bbb;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      i {
        font-size: 24px;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
      &.active {
        background-color: rgba(0, 0, 0, 0.3);
        color: #5fbbff;
        &:after {
          transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
            opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
            -webkit-transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
          opacity: 1;
          transform: scaleY(1);
        }
      }
      &:after {
        position: absolute;
        left: 0;
        top: 0;
        content: " ";
        bottom: 0;
        border-right: 3px solid #fe824c;
        transform: scaleY(0.0001);
        opacity: 0;
        transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
          opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
          -webkit-transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
      }
    }
  }
}
</style>
