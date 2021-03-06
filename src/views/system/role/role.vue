<template>
  <two-v class="page-role" :split="0.4">
    <x-wrapper
      title="角色"
      service="role"
      :columns="columns"
      :model="model"
      :rules="rules"
      :filter="filter"
      ref="wrapper"
      :loads="true"
      slot="top"
      @on-row-click="onRowClick"
      @refresh="onRefresh"
    >
      <div slot="dialog" slot-scope="{ model }">
        <FormItem :label="roleModel.name" prop="name">
          <Input
            v-model="model.name"
            :placeholder="'请输入' + roleModel.name"
          />
        </FormItem>
        <FormItem :label="roleModel.weight">
          <InputNumber
            style="width: 100%"
            :min="0"
            v-model="model.weight"
            :placeholder="'请输入' + roleModel.weight"
          />
        </FormItem>
        <FormItem :label="roleModel.status">
          <RadioGroup v-model.number="model.status">
            <Radio :label="1">启用</Radio>
            <Radio :label="0">禁用</Radio>
          </RadioGroup>
        </FormItem>
      </div>
    </x-wrapper>

    <Tabs slot="bottom" class="f-tabs" style="height: 100%">
      <TabPanel title="站点权限">
        <role-station :role="selectRole"></role-station>
      </TabPanel>
    </Tabs>
  </two-v>
</template>
<script>
import types from "@/types";
const { roleModel, newRole } = types;
import Vue from "vue";
import { mapState } from "vuex";
import roleStation from "./roleStation";

export default {
  components: { roleStation },
  data() {
    return {
      roleModel,
      columns: [
        {
          width: 40,
          align: "center",
          type: "selection"
        },
        {
          title: roleModel.name,
          width: 200,
          key: "name",
          sortable: "custom"
        },
        {
          title: roleModel.status,
          width: 100,
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
          }
        },
        {
          title: roleModel.weight,
          width: 100,
          key: "weight",
          sortable: "custom"
        },
        {
          title: "创建时间",
          width: 150,
          key: "created",
          sortable: "custom",
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.created * 1000));
          }
        },
        {
          title: "更新时间",
          minWidth: 150,
          key: "changed",
          sortable: "custom",
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
                    click: () => this.$refs.wrapper.onEdit(row)
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
                      this.$refs.wrapper.onDelete(
                        row.id,
                        `确定要删除角色【${row.name}】吗？`
                      )
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        sn: [{ required: true, message: "必填", trigger: "blur" }],
        account: [{ required: true, message: "必填", trigger: "blur" }],
        password: [{ required: true, message: "必填", trigger: "blur" }]
      },
      filter: [
        {
          type: "input",
          name: roleModel.name,
          field: "name",
          placeholder: "请输入名称模糊查询"
        },
        {
          type: "select",
          name: roleModel.status,
          field: "status",
          placeholder: "请选择状态进行筛选",
          data: [{ value: 1, name: "启用" }, { value: 0, name: "禁用" }]
        }
      ],
      total: 0,
      model: newRole,
      selectRole: null
    };
  },
  computed: {
    ...mapState(["windowHeight"])
  },
  methods: {
    onRowClick(row) {
      this.selectRole = row.id;
    },
    onRefresh() {
      this.selectRole = null;
    }
  }
};
</script>
<style lang="less">
.page-role {
  height: 100%;
}
</style>
