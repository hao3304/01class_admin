<template>
  <div :class="b()">
    <div :class="b('logo')">
      <img src="~@/assets/images/sys-name.png" alt="" />
    </div>
    <div :class="b('title')">零一教室管理平台</div>
    <div :class="b('menu')">
      <ul>
        <li
          v-for="(m, index) in modules"
          :key="index"
          :class="{
            active: breadcrumbs && breadcrumbs.indexOf(m.name) > -1,
            'mouse-enter': enter === index
          }"
          @click="onSelect(index)"
          @mouseenter="onMouseEnter(index)"
          @mouseleave="onMouseEnter(null)"
        >
          <i :class="['iconfont', m.icon]"></i>
          <span>{{ m.name }}</span>

          <template v-if="m.level && m.level == 3">
            <div
              :class="[b('child'), b('mul')]"
              style="width: 680px;margin-left: -440px"
            >
              <div
                v-for="child in m.children"
                class="mul-block"
                :key="child.id"
              >
                <div class="mul-block__header">
                  {{ child.name }}
                </div>
                <ul>
                  <li
                    v-for="c in child.children"
                    :class="getChildActive2(c.name)"
                    @click.stop="onSelectPath(c.path, index)"
                    :key="c.name"
                  >
                    {{ c.name }}
                  </li>
                </ul>
              </div>
            </div>
          </template>
          <template v-else>
            <ul v-if="m.children && m.children.length > 0" :class="b('child')">
              <li
                v-for="child in m.children"
                :key="child.id"
                :class="getChildActive(child.name, m)"
                @click.stop="onSelectPath(child.path, index)"
              >
                {{ child.name }}
              </li>
            </ul>
          </template>
        </li>
      </ul>
    </div>
    <div :class="b('tool')">
      <Poptip :title="`你好，${me.name}！`" placement="top-end">
        <Badge :dot="myTicket > 0" style="margin-right: 10px">
          <Avatar size="large" :src="avatar" alt="" />
        </Badge>
        {{ me.name }}
        <Icon type="md-arrow-dropdown" />

        <CellGroup slot="content">
          <Cell title="我的审批">
            <Badge :count="myTicket" slot="extra" />
          </Cell>
          <Cell>
            <div @click="onLogout">退出</div>
          </Cell>
        </CellGroup>
      </Poptip>
      <a href="javascript:;">
        <f-icon
          icon="iconquanping"
          v-show="!fullScreen"
          @click="onFullScreen"
        ></f-icon>
        <f-icon
          icon="icon009pingmusuoxiao"
          v-show="fullScreen"
          @click="onExitFullScreen"
        ></f-icon>
      </a>
      <a href="javascript:;">
        <f-icon icon="iconshuaxin1" @click="onRefresh"></f-icon>
      </a>
      <a href="javascript:;">
        <f-icon icon="icontuichu" @click="onLogout"></f-icon>
      </a>
    </div>

    <Modal fullscreen class="f-dialog" v-model="dialog" :footer-hide="true">
      <iframe
        v-if="dialog"
        :src="getSrc()"
        style="height: 100%;width: 100%"
        frameborder="0"
      ></iframe>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
// import { DoLogout } from "@/graphqls/base.graphql";
const avatar = require("@/assets/images/avatar.png");
export default {
  name: "f-header",
  computed: {
    ...mapState("app", ["modules", "module", "breadcrumbs"]),
    ...mapState("common", ["system", "me"])
  },
  data: () => ({
    name: process.env.VUE_APP_NAME,
    enter: null,
    fullScreen: false,
    avatar,
    myTicket: 0,
    dialog: false
  }),
  methods: {
    ...mapMutations("app", ["set_module", "set_keep_alive"]),
    getSrc() {
      return window.location.origin + process.env.VUE_APP_BASE + "#/dashboard";
    },
    onSelect(module) {
      if (module == 4) return (this.dialog = true);
      this.set_module(module);
      const target = this.modules[module];
      if (target.path) {
        this.onSelectPath(target.path);
      } else if (target.children && target.children.length > 0) {
        this.onSelectPath(target.children[0].path);
      }
    },
    getChildActive(name, parent) {
      if (
        this.breadcrumbs.length >= 2 &&
        this.breadcrumbs[1] == name &&
        this.breadcrumbs[0] == parent.name
      ) {
        return "active";
      }
      return "";
    },
    getChildActive2(name) {
      if (this.breadcrumbs.length >= 3 && this.breadcrumbs[2] == name) {
        return "active";
      }
      return "";
    },
    onSelectPath(name, parent) {
      this.$router.push({ name });
      if (parent != undefined) {
        this.set_module(parent);
      }
      this.set_keep_alive(null);
      this.onMouseEnter(null);
    },
    onLogout() {
      this.$Modal.confirm({
        title: "提示",
        content: "确定要退出当前用户？",
        onOk: () => {
          // this.$apollo.mutate({
          //   mutation: DoLogout
          // });
          this.$store.commit("logout");
        },
        onCancel: () => {}
      });
    },
    onMouseEnter(index) {
      this.enter = index;
    },
    onFullScreen() {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      this.fullScreen = true;
    },
    onExitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      this.fullScreen = false;
    },
    onRefresh() {
      window.location.reload();
    },
    toNav() {
      this.$router.push({ name: "Nav" });
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
@import "~@/style/theme.less";

@keyframes scaleY {
  0% {
    transform: scaleY(0.5);
    opacity: 0;
  }
  100% {
    transform: scaleY(1);
    opacity: 1;
  }
}

.f-header {
  height: @HeaderHeight;
  background-image: url("./images/header-bg.png");
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.06);
  border-bottom: 4px solid rgba(0, 0, 0, 0.1);
  display: flex;
  padding: 0 10px;
  align-items: center;

  &__logo {
    cursor: pointer;
    img {
      height: 80px;
    }
  }

  &__title {
    font-size: 30px;
    font-weight: 400;
    color: #fff;
    padding: 0 20px;
    text-shadow: 1px 1px 1px #0099cc;
    cursor: pointer;
  }
  &__menu {
    height: 100%;
    padding: 0 20px;
    flex: 1;
    > ul {
      display: flex;
      height: 100%;
      > li {
        width: 110px;
        list-style: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        color: #efefef;
        transition: all 0.2s;
        &:after {
          position: absolute;
          transition: all 0.4s;
          bottom: -4px;
          height: 4px;
          left: 50%;
          right: 50%;
          content: " ";
          background-color: #fe824c;
        }

        &:hover {
          color: #fff;
          background-color: rgba(0, 0, 0, 0.1);
          &:after {
            left: 0;
            right: 0;
          }
        }

        &.mouse-enter {
          .f-header__child {
            display: inline-block;
            animation: scaleY 0.4s;
          }

          .f-header__child.f-header__mul {
            display: flex;
          }
        }

        &.active {
          background-color: rgba(0, 0, 0, 0.2);
          color: #fff;
          &:after {
            left: 0;
            right: 0;
          }
        }

        i {
          font-size: 30px;
        }
        span {
          font-size: 14px;
        }
      }
    }
  }

  &__child {
    position: absolute;
    top: @HeaderHeight;
    background-color: #162436;
    left: 0;
    width: 220px;
    z-index: 1000;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    display: none;
    transform-origin: top;
    li {
      list-style: none;
      line-height: 50px;
      font-size: 14px;
      color: #bbb;
      padding: 0 15px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
      }

      &.active {
        background-color: #1890ff;
        color: #fff;
      }
    }
  }

  &__mul {
    padding: 15px;
    .mul-block {
      padding: 0 10px;
      flex: 1;
      &__header {
        color: #fff;
        font-weight: bold;
        font-size: 14px;
        padding: 5px;
        cursor: default;
      }
    }
  }

  &__tool {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    /deep/.ivu-poptip {
      height: 100%;
      .ivu-poptip-rel {
        height: 100%;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 14px;
      }
      .ivu-poptip-body {
        padding: 0;
      }

      li {
        padding: 10px 15px;
        cursor: pointer;
        color: #333;
        &:hover {
          background-color: #f9f9f9;
        }

        i {
          float: right;
          color: #666;
          font-size: 14px;
          margin-top: 2px;
        }
      }
    }
    img {
      width: 40px;
      margin-right: 10px;
    }
    i {
      font-size: 20px;
    }

    a {
      margin-left: 20px;
      &:hover {
        i {
          color: #fff;
        }
      }
      i {
        font-size: 22px;
        color: #efefef;
      }
    }
  }

  @media only screen and(max-width: 1400px) {
    height: 68px;

    &__logo {
      img {
        height: 52px;
        width: 52px;
      }
    }
    &__title {
      font-size: 20px;
    }

    &__child {
      top: 68px;
    }

    &__menu {
      padding: 0 10px;
      > ul {
        > li {
          width: 100px;

          i {
            font-size: 26px;
          }
          span {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
