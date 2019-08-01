<template>
  <f-panel :header="false" class="page-system">
    <div
      slot="body"
      slot-scope="props"
      :style="{ height: props.bodyHeight + 'px' }"
      style="overflow-y: auto"
    >
      <div style="padding:40px 20px;max-width: 600px;">
        <i-form :label-width="120">
          <FormItem label="系统Logo：">
            <upload-pic :type="2" v-model="model.logo"></upload-pic>
          </FormItem>
          <FormItem label="系统名称(图片)：">
            <upload-pic :type="2" v-model="model.named_logo"></upload-pic>
          </FormItem>
          <FormItem label="系统名称(图片)：">
            <upload-pic :type="2" v-model="model.system_logo"></upload-pic>
          </FormItem>
          <FormItem label="系统名称：">
            <Input v-model="model.name" size="large" placeholder="请输入" />
          </FormItem>
          <FormItem label="copyright：">
            <Input
              v-model="model.copyright"
              size="large"
              placeholder="请输入"
            />
          </FormItem>
          <FormItem label="favicon：">
            <upload-pic :type="2" v-model="model.favicon"></upload-pic>
          </FormItem>
        </i-form>
        <div style="text-align: right">
          <Button style="width: 100px" @click="onSubmit" type="primary"
            >提交</Button
          >
        </div>
      </div>
    </div>
  </f-panel>
</template>

<script>
import { UpdateSystemConfig, SystemConfig } from "@/graphqls/base.graphql";
const model = () => {
  return {
    name: null,
    logo: null,
    named_logo: null,
    copyright: null,
    favicon: null,
    system_logo: null
  };
};
export default {
  name: "system",
  data() {
    return {
      model: model(),
      loading: false
    };
  },
  methods: {
    onSubmit() {
      this.loading = true;
      this.$apollo
        .mutate({
          mutation: UpdateSystemConfig,
          variables: {
            form: this.model
          }
        })
        .then(() => {
          this.loading = false;
          this.$Message.success("提交成功！");
          this.render();
        });
    },
    render() {
      this.loading = true;
      this.$apollo
        .query({
          query: SystemConfig
        })
        .then(({ data }) => {
          this.loading = false;
          Object.assign(this.model, data.system_config);
        });
    }
  },
  mounted() {
    this.render();
  }
};
</script>

<style lang="less">
.page-system {
}
</style>
