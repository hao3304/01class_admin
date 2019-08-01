<template>
  <two-h>
    <div class="page-dep__tree" slot="left">
      <not-find
        @click="onAdd"
        v-if="!loading && tableData.length == 0"
      ></not-find>
      <div id="depTree" class="ztree" v-else></div>
    </div>
    <x-wrapper
      slot="right"
      title="部门"
      service="dep"
      :columns="columns"
      :model="model"
      :rules="rules"
      :filter="filter"
      ref="wrapper"
      :height="windowHeight - 300"
      :loads="true"
      :orders="['id']"
      @on-save="render"
      @on-update="render"
      @on-delete="render"
      @refresh="render"
      @on-add="onBeforeAdd"
    >
      <div slot="dialog" slot-scope="{ model }">
        <FormItem :label="depModel.name" prop="name">
          <Input placeholder="请输入区域名称" v-model="model.name" />
        </FormItem>
        <FormItem :label="depModel.sname">
          <Input
            :placeholder="'请输入' + depModel.sname"
            v-model="model.sname"
          />
        </FormItem>
        <FormItem :label="depModel.parent" prop="parent">
          <tree-select
            :treeData="treeData"
            v-model="model.parent"
            placeholder="请选择上级(默认根目录)"
          ></tree-select>
        </FormItem>
        <FormItem :label="depModel.address">
          <Input
            :placeholder="'请输入' + depModel.address"
            v-model="model.address"
          />
        </FormItem>
        <FormItem :label="depModel.linkman">
          <Input
            :placeholder="'请输入' + depModel.linkman"
            v-model="model.linkman"
          />
        </FormItem>
        <FormItem :label="depModel.phone">
          <Input
            :placeholder="'请输入' + depModel.phone"
            v-model="model.phone"
          />
        </FormItem>
        <FormItem :label="depModel.status">
          <RadioGroup v-model.number="model.status">
            <Radio :label="1">启用</Radio>
            <Radio :label="0">禁用</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="depModel.weight">
          <InputNumber
            style="width: 100%"
            :min="0"
            v-model="model.weight"
            :placeholder="'请输入' + depModel.weight"
          />
        </FormItem>
        <FormItem :label="depModel.remark">
          <Input
            placeholder="请输入备注"
            type="textarea"
            v-model="model.remark"
          />
        </FormItem>
      </div>
    </x-wrapper>
  </two-h>
</template>
<script>
import types from "@/types";
import Vue from "vue";
const depIcon = require("@/assets/images/icon/dep.png");
const allIcon = require("@/assets/images/icon/all.png");
const { newDep, depModel } = types;
import treeSelect from "@/components/treeSelect";
import depService from "@/services/dep";
import { mapState } from "vuex";
import notFind from "@/components/notFind";
export default {
  data() {
    return {
      dialog: false,
      formLoading: false,
      loading: false,
      columns: [
        {
          width: 60,
          type: "selection"
        },
        {
          title: depModel.name,
          key: "name",
          width: 200
        },
        {
          title: depModel.sname,
          key: "sname",
          width: 100
        },
        {
          title: depModel.parent,
          key: "parent",
          sortable: "custom",
          render: (h, { row }) => {
            const target = this.tableData.find(d => d.id == row.parent);
            return h("div", {}, target ? target.name : "根节点");
          },
          width: 200
        },
        {
          title: depModel.address,
          key: "address",
          width: 200
        },
        {
          title: depModel.linkman,
          key: "linkman",
          width: 100
        },
        {
          title: depModel.phone,
          key: "phone",
          width: 150
        },
        {
          title: depModel.status,
          key: "status",
          sortable: "custom",
          width: 100,
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
          title: depModel.weight,
          key: "weight",
          sortable: "custom",
          width: 100
        },
        {
          title: depModel.remark,
          key: "remark",
          width: 150
        },
        {
          title: "创建时间",
          width: 200,
          key: "created",
          sortable: "custom",
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.created * 1000));
          }
        },
        {
          title: "更新时间",
          minWidth: 200,
          key: "changed",
          sortable: "custom",
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.changed * 1000));
          }
        },
        {
          title: "操作",
          width: 100,
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
                    tooltip: "编辑",
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
                    tooltip: "删除",
                    placement: "right"
                  },
                  on: {
                    click: () =>
                      this.$refs.wrapper.onDelete(
                        row.id,
                        `确定要删除区域【${row.name}】吗？`
                      )
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableData: [],
      treeData: [],
      action: null,
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }]
        // parent: [{ required: true, message: '必选', trigger: 'change' }]
      },
      form: newDep(),
      model: newDep,
      depModel: depModel,
      parent: null,
      filter: [
        {
          name: "区域名称",
          type: "input",
          field: "name",
          placeholder: "请输入区域名称模糊查询"
        }
      ]
    };
  },
  components: {
    treeSelect,
    notFind
  },
  computed: {
    ...mapState(["windowHeight"])
  },
  methods: {
    onRefresh() {
      this.parent = null;
    },
    renderTree() {
      const self = this;
      const setting = {
        data: {
          simpleData: {
            enable: true,
            pIdKey: "parent"
          }
        },
        view: {
          showIcon: true
        },
        callback: {
          onClick: (e, type, node) => {
            const list = self.$treeObj.transformToArray(node);
            this.parent = node.id;
            self.$refs.wrapper.doFilter({
              op: "in",
              field: "id",
              args: list.map(l => l.id)
            });
          }
        }
      };
      this.$treeObj = $.fn.zTree.init($("#depTree"), setting, this.treeData);
    },
    getTreeData() {
      this.treeData = [
        {
          id: null,
          parent: null,
          name: "根节点",
          icon: allIcon,
          open: true
        }
      ];
      this.tableData.forEach(item => {
        item.icon = depIcon;
        item.open = true;
        this.treeData.push(item);
      });
    },
    render() {
      this.loading = true;
      depService
        .findAll({
          size: 999,
          fields: ["*"],
          orders: ["-changed"]
        })
        .then(rep => {
          this.loading = false;
          this.tableData = rep.data;
          this.getTreeData();
          if (rep.data.length > 0) {
            this.renderTree();
          }
        });
    },
    onAdd() {
      this.$refs.wrapper.onAdd();
    },
    onBeforeAdd() {
      this.$refs.wrapper.form.parent = this.parent;
    }
  },
  mounted() {
    this.render();
  }
};
</script>
<style lang="less"></style>
