<template>
  <div :class="b()">
    <div :class="b('tree')">
      <div id="course-tree" class="ztree"></div>
    </div>
    <f-panel :class="b('content')">
      <div slot="header">
        <f-filter :list="[]">
          <div slot="buttons">
            <Button icon="md-add" type="primary">课程</Button>
          </div>
        </f-filter>
      </div>
    </f-panel>
  </div>
</template>

<script>
import categoryService from "@/services/category";
export default {
  name: "p-course",
  methods: {
    renderTree() {
      categoryService.findAll().then(rep => {
        debugger;
      });
    }
  },
  mounted() {
    this.renderTree();
  }
};
</script>

<style lang="less">
.p-course {
  height: 100%;
  display: flex;
  &__tree {
    background-color: #fff;
    width: 240px;
  }
  &__content {
    flex: 1;
    overflow: hidden;
  }
}
</style>
