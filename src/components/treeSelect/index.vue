<template>
  <div class="tree-select" v-clickoutside="onClickOutside">
    <!--<Input  :placeholder="placeholder" v-model="str"  @on-focus="onFocus"  />-->
    <div class="ivu-select ivu-select-single" @click="onFocus">
      <div class="ivu-select-selection">
        <input ref="input" type="hidden" v-model="str" />
        <span class="ivu-select-selected-value" v-if="str">
          {{ str }}
        </span>
        <span class="ivu-select-placeholder" v-else>{{
          placeholder || ""
        }}</span>
      </div>
    </div>
    <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
    <div class="tree-select__block" :class="{ expand: expand }">
      <div ref="tree" id="select-tree" class="ztree"></div>
    </div>
  </div>
</template>

<script>
import clickoutside from "iview/src/directives/clickoutside";
import Emitter from "@/libs/common/emitter";
export default {
  directives: { clickoutside },
  mixins: [Emitter],
  props: {
    placeholder: {
      default: "请选择",
      type: String
    },
    treeData: {
      default: () => [],
      type: Array
    },
    value: {
      default: null,
      type: [String, Number]
    },
    simpleData: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      expand: false,
      str: ""
    };
  },
  name: "treeSelect",
  watch: {
    treeData() {
      if (this.treeData.length > 0) {
        this.renderTree();
      }
    },
    value() {
      if (this.value === "" || this.value === null) {
        this.str = "";
      } else {
        const target = this.treeData.find(d => d.id == this.value);
        if (target) {
          this.str = target.name;
          const node = this.zTree.getNodeByParam("id", target.id, null);
          this.zTree.selectNode(node);
        }
      }
      this.dispatch("FormItem", "on-form-change", this.value);
    }
  },
  methods: {
    onFocus() {
      this.expand = true;
    },
    onClickOutside() {
      this.expand = false;
    },
    renderTree() {
      const setting = {
        data: {
          simpleData: {
            enable: this.simpleData,
            pIdKey: "pid"
          }
        },
        view: {
          showIcon: true
        },
        callback: {
          onClick: (event, treeId, treeNode) => {
            this.expand = false;
            this.$emit("input", treeNode.id);
            this.str = treeNode.name;
          }
        }
      };
      this.zTree = $.fn.zTree.init($(this.$refs.tree), setting, this.treeData);
    }
  },
  mounted() {
    if (this.value === 0) {
      this.str = "根目录";
    }
    if (this.treeData.length > 0) {
      this.renderTree();
    }
  }
};
</script>

<style lang="less">
.tree-select {
  position: relative;
  &__block {
    position: absolute;
    height: 0;
    border: 1px solid #ccc;
    width: 100%;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    overflow: auto;
    background-color: #fff;
    transition: height 0.25s ease;
    opacity: 0;
    z-index: 1000;
    &.expand {
      height: 220px;
      opacity: 1;
    }
  }
}
</style>
