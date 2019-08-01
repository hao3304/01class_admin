<template>
  <div class="page-dict-item">
    <f-panel>
      <div slot="header" style="text-align: right;padding-right: 5px">
        <Button
          @click="onAdd"
          type="primary"
          class="f-button"
          icon="md-add"
          :disabled="!pid"
        >
          字典
        </Button>
      </div>
      <div slot="body" slot-scope="props">
        <Table
          :height="props.bodyHeight"
          size="small"
          :columns="columns"
          :data="data"
          :loading="loading"
          border
          class="f-table"
        >
        </Table>
      </div>
    </f-panel>
    <Drawer
      v-model="dialog"
      :title="title"
      :width="600"
      :loading="formLoading"
      class="f-drawer"
    >
      <div class="f-drawer__body">
        <i-form ref="form" :label-width="75" :rules="rules" :model="model">
          <FormItem :label="dictItemModel.value" prop="value">
            <Input
              v-model="model.value"
              :placeholder="'请输入' + dictItemModel.value"
            />
          </FormItem>
          <FormItem :label="dictItemModel.name" prop="name">
            <Input
              v-model="model.name"
              :placeholder="'请输入' + dictItemModel.name"
            />
          </FormItem>
          <FormItem :label="dictItemModel.extension">
            <Input
              v-model="model.extension"
              :placeholder="'请输入' + dictItemModel.extension"
            />
          </FormItem>
          <FormItem :label="dictItemModel.weight">
            <InputNumber
              style="width: 100%"
              :min="0"
              v-model="model.weight"
              :placeholder="'请输入' + dictItemModel.weight"
            />
          </FormItem>
          <FormItem :label="dictItemModel.status">
            <RadioGroup v-model.number="model.status">
              <Radio :label="1">启用</Radio>
              <Radio :label="0">禁用</Radio>
            </RadioGroup>
          </FormItem>
        </i-form>
      </div>

      <div class="f-drawer__footer">
        <Button @click="onCancel">取消</Button>
        <Button @click="onOk" type="primary">确定</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import types from "@/types";
import Vue from "vue";
const { newDictItem, dictItemModel } = types;
import itemService from "@/services/dictItem";
import base from "@/mixins/base";

export default {
  props: ["pid"],
  name: "dictItem",
  mixins: [base],
  data() {
    return {
      newDictItem: newDictItem,
      dictItemModel,
      data: [],
      columns: [
        {
          title: "#",
          type: "index",
          width: 40,
          align: "center"
        },
        {
          title: dictItemModel.code,
          key: "code",
          width: 100
        },
        {
          title: dictItemModel.name,
          key: "name",
          width: 120,
          sortable: true
        },
        {
          title: dictItemModel.value,
          key: "value",
          width: 120,
          sortable: true
        },
        {
          title: dictItemModel.extension,
          key: "extension",
          width: 100
        },
        {
          title: dictItemModel.status,
          key: "status",
          sortable: "custom",
          render: (h, { row }) => {
            return h(
              "Tag",
              {
                props: {
                  color: row.status == 1 ? "success" : "default",
                  size: "small",
                  type: "border"
                },
                style: {
                  fontSize: "12px"
                }
              },
              row.status == 1 ? "启用中" : "已禁用"
            );
          },
          width: 100
        },
        {
          title: dictItemModel.weight,
          key: "weight",
          width: 100,
          sortable: true
        },
        {
          title: "创建时间",
          key: "created",
          width: 150,
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.created * 1000));
          }
        },
        {
          title: "更新时间",
          key: "changed",
          mWidth: 150,
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.changed * 1000));
          }
        },
        {
          title: "操作",
          width: 120,
          fixed: "right",
          align: "center",
          render: (h, { row }) => {
            return h("div", [
              h(
                "iconButton",
                {
                  props: {
                    icon: "iconfont icon-bianji",
                    type: "primary",
                    tooltip: null,
                    placement: "left"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => this.onEdit(row)
                  }
                },
                "编辑"
              ),
              h(
                "iconButton",
                {
                  props: {
                    type: "error",
                    icon: "iconfont icon-shanchu",
                    tooltip: null,
                    placement: "right"
                  },
                  on: {
                    click: () =>
                      this.onDelete(row.id, `确定要删除字典【${row.name}】吗？`)
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      rules: {
        code: [{ required: true, message: "必填", trigger: "blur" }],
        name: [{ required: true, message: "必填", trigger: "blur" }],
        value: [{ required: true, message: "必填", trigger: "blur" }]
      },
      parent: {},
      dialog: false,
      title: "新增字典",
      formLoading: false,
      loading: false,
      model: newDictItem(),
      action: "",
      query: {
        page: 1,
        size: 999,
        count: 1,
        fields: ["*"],
        orders: ["weight"],
        filters: [
          {
            op: "eq",
            field: "code",
            args: []
          }
        ]
      }
    };
  },
  watch: {
    pid() {
      this.setParent();
    }
  },
  methods: {
    setParent() {
      if (this.pid) {
        this.model.code = this.pid;
        this.query.filters[0].args = [this.pid];
        this.render();
      } else {
        this.data = [];
      }
    },
    render() {
      this.loading = true;
      itemService.findAll(this.query).then(rep => {
        this.data = rep.data;
        this.loading = false;
      });
    },
    onAdd() {
      this.dialog = true;
      this.action = "add";
      this.$refs.form.resetFields();
      this.model = newDictItem();
      this.model.code = this.query.filters[0].args[0];
    },
    onCancel() {
      this.dialog = false;
    },
    onOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.action == "update") {
            this.update();
          } else {
            this.save();
          }
        } else {
          this.$Message.warning("请填写完整！");
        }
      });
    },
    save() {
      this.formLoading = true;
      itemService.add(this.model).then(() => {
        this.formLoading = false;
        this.dialog = false;
        this.$Message.success("新增成功！");
        this.render();
      });
    },
    onDelete(id, str) {
      this.$Confirm({
        title: "提示",
        content: str ? str : "确定要删除当前选择数据吗？",
        loading: true,
        onOk: () => {
          itemService
            .remove(id)
            .then(() => {
              this.$Modal.remove();
              this.$Message.success("删除成功！");
              this.render();
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    onEdit(data) {
      this.$refs.form.resetFields();
      const values = JSON.parse(JSON.stringify(data));
      delete values["_rowKey"];
      delete values["_index"];
      this.model = { ...values };
      this.dialog = true;
      this.action = "update";
      this.updateId = values.id;
    },
    update() {
      this.formLoading = true;
      itemService
        .update(this.updateId, this.model)
        .then(rep => {
          console.log(rep);
          this.dialog = false;
          this.$Message.success("编辑成功！");
          this.render();
          this.formLoading = false;
        })
        .catch(() => {
          this.formLoading = false;
        });
    },
    reset() {
      this.query.filters[0].args = [];
      this.parent = {};
      this.data = [];
      this.model = newDictItem();
    }
  }
};
</script>

<style lang="less">
.page-dict-item {
  height: 100%;
}
</style>
