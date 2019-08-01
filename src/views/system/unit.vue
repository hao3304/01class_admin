<template>
  <x-wrapper
    title="数据类型"
    service="unit"
    :columns="columns"
    :model="model"
    :rules="rules"
    :filter="filter"
    ref="wrapper"
    :loads="true"
  >
    <div slot="dialog" slot-scope="{ model }">
      <FormItem :label="unitModel.id" prop="id">
        <Input v-model="model.id" :placeholder="'请输入' + unitModel.id" />
      </FormItem>
      <FormItem :label="unitModel.name" prop="name">
        <Input v-model="model.name" :placeholder="'请输入' + unitModel.name" />
      </FormItem>
      <FormItem :label="unitModel.type" prop="type">
        <Select v-model="model.type" :placeholder="'请选择' + unitModel.type">
          <Option
            v-for="u in unitType"
            :key="u.id"
            :label="u.name"
            :value="u.id"
          ></Option>
        </Select>
      </FormItem>
      <FormItem :label="unitModel.precision">
        <InputNumber
          style="width: 100%"
          :min="0"
          :max="10"
          v-model="model.precision"
          :placeholder="'请输入' + unitModel.precision"
        />
      </FormItem>
      <FormItem :label="unitModel.unit">
        <Input v-model="model.unit" :placeholder="'请输入' + unitModel.unit" />
      </FormItem>
      <FormItem :label="unitModel.max">
        <InputNumber
          style="width: 100%"
          v-model="model.max"
          :placeholder="'请输入' + unitModel.max"
        />
      </FormItem>
      <FormItem :label="unitModel.min">
        <InputNumber
          style="width: 100%"
          v-model="model.min"
          :placeholder="'请输入' + unitModel.min"
        />
      </FormItem>
      <FormItem :label="unitModel.cycle">
        <Select v-model="model.cycle">
          <Option label="1  分钟" key="60" :value="60" />
          <Option label="1  小时" key="3600" :value="3600" />
          <Option label="24 小时" key="86400" :value="86400" />
        </Select>
      </FormItem>
      <FormItem :label="unitModel.weight">
        <InputNumber
          style="width: 100%"
          :min="0"
          v-model="model.weight"
          :placeholder="'请输入' + unitModel.weight"
        />
      </FormItem>
      <FormItem :label="unitModel.status">
        <RadioGroup v-model.number="model.status">
          <Radio :label="1">启用</Radio>
          <Radio :label="0">禁用</Radio>
        </RadioGroup>
      </FormItem>
    </div>
  </x-wrapper>
</template>
<script>
import types from "@/types";
const { unitModel, newUnit } = types;
import Vue from "vue";
import { mapState } from "vuex";

export default {
  data() {
    return {
      unitModel,
      columns: [
        {
          width: 50,
          align: "center",
          type: "selection"
        },
        {
          title: unitModel.id,
          width: 100,
          key: "id",
          sortable: "custom"
        },
        {
          title: unitModel.name,
          width: 200,
          key: "name"
        },
        {
          title: unitModel.type,
          width: 100,
          key: "type",
          render: (h, { row }) => {
            const type = this.unitType.find(unit => unit.id == row.type);
            return h("div", type ? type.name : "-");
          }
        },
        {
          title: unitModel.precision,
          width: 100,
          key: "precision"
        },
        {
          title: unitModel.unit,
          width: 150,
          key: "unit"
        },
        {
          title: unitModel.max,
          width: 100,
          key: "max"
        },
        {
          title: unitModel.min,
          width: 100,
          key: "min"
        },
        {
          title: unitModel.cycle,
          width: 100,
          key: "cycle",
          align: "center",
          render: (h, { row }) => {
            switch (row.cycle) {
              case 60:
                return h("div", "1 分钟");
              case 3600:
                return h("div", "1 小时");
              case 86400:
                return h("div", "24 小时");
            }
          }
        },
        {
          title: unitModel.status,
          width: 100,
          key: "status",
          align: "center",
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
          title: unitModel.weight,
          width: 100,
          key: "weight",
          sortable: "custom"
        },
        {
          title: " ",
          minWidth: 1
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
                        `确定要删除数据类型【${row.name}】吗？`
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
        id: [{ required: true, message: "必填", trigger: "blur" }],
        type: [
          { required: true, type: "number", message: "必选", trigger: "change" }
        ]
      },
      filter: [
        {
          type: "input",
          name: unitModel.id,
          field: "id",
          placeholder: "请输入编码模糊查询"
        },
        {
          type: "input",
          name: unitModel.name,
          field: "name",
          placeholder: "请输入名称模糊查询"
        },
        {
          type: "select",
          name: unitModel.status,
          field: "status",
          placeholder: "请选择状态进行筛选",
          data: [{ value: 1, name: "启用" }, { value: 0, name: "禁用" }]
        }
      ],
      total: 0,
      model: newUnit
    };
  },
  computed: {
    ...mapState(["windowHeight"]),
    ...mapState("common", ["unitType"])
  },
  methods: {}
};
</script>
<style lang="less"></style>
