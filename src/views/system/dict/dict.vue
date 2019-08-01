<template>
  <div class="page-dict">
    <two-v>
      <x-wrapper
        slot="top"
        style="padding-bottom: 0"
        title="字典类型"
        service="dict"
        :model="model"
        :columns="columns"
        :rules="rules"
        :filter="filter"
        ref="wrapper"
        :height="350"
        @on-row-click="onRowClick"
        @refresh="onRefresh"
      >
        <div slot="dialog" slot-scope="{ model }">
          <FormItem :label="dictModel.id" prop="id">
            <Input v-model="model.id" :placeholder="'请输入' + dictModel.id" />
          </FormItem>
          <FormItem :label="dictModel.name" prop="name">
            <Input
              v-model="model.name"
              :placeholder="'请输入' + dictModel.name"
            />
          </FormItem>
          <FormItem :label="dictModel.weight">
            <InputNumber
              style="width: 100%"
              :min="0"
              v-model="model.weight"
              :placeholder="'请输入' + dictModel.weight"
            />
          </FormItem>
          <FormItem :label="dictModel.remark">
            <Input
              v-model="model.remark"
              type="textarea"
              :placeholder="'请输入' + dictModel.remark"
            />
          </FormItem>
        </div>
      </x-wrapper>
      <dict-item slot="bottom" ref="dictItem" :pid="pid"></dict-item>
    </two-v>
  </div>
</template>

<script>
import types from "@/types";
const { dictModel, newDict } = types;
import Vue from "vue";
import dictItem from "./dictItem";
export default {
  name: "Dict",
  components: {
    dictItem
  },
  data() {
    return {
      split: 0.5,
      dictModel,
      pid: null,
      columns: [
        {
          width: 40,
          type: "selection",
          align: "center"
        },
        {
          title: dictModel.id,
          key: "id",
          width: 150
        },
        {
          title: dictModel.name,
          key: "name",
          sortable: "custom",
          width: 200
        },
        {
          title: dictModel.weight,
          key: "weight",
          sortable: "custom",
          width: 100
        },
        {
          title: "创建时间",
          key: "created",
          sortable: "custom",
          width: 200,
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.created * 1000));
          }
        },
        {
          title: "更新时间",
          key: "changed",
          minWidth: 200,
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
                        `确定要删除字典【${row.name}】吗？`
                      )
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      model: newDict,
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }],
        id: [{ required: true, message: "必填", trigger: "blur" }]
      },
      filter: [
        {
          type: "input",
          name: dictModel.id,
          field: "id",
          placeholder: "请输入数据编码查询"
        },
        {
          type: "input",
          name: dictModel.name,
          field: "name",
          placeholder: "请输入名称模糊查询"
        }
      ]
    };
  },
  methods: {
    onRowClick(row) {
      this.pid = null;
      this.$nextTick(() => {
        this.pid = row.id;
      });
    },
    onAddChild() {
      this.$refs["dictItem"].onAdd();
    },
    onRefresh() {
      this.$refs["dictItem"].reset();
      this.pid = null;
    }
  }
};
</script>

<style lang="less">
.page-dict {
  height: 100%;
}
</style>
