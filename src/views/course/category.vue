<template>
  <div :class="b()">
    <Spin fix v-show="loading"></Spin>
    <div :class="b('tree')">
      <div id="course-tree" class="ztree"></div>
    </div>
    <f-panel :class="b('content')">
      <div slot="header">
        <f-filter :list="[]">
          <div slot="buttons">
            <Button @click="onAdd" icon="md-add" type="primary">栏目</Button>
          </div>
        </f-filter>
      </div>
      <div slot="body" slot-scope="params">
        <Table
          class="f-table"
          border
          stripe
          size="small"
          :data="data"
          :columns="columns"
          :height="params.bodyHeight"
        ></Table>

        <Modal
          :title="action == 'add' ? '新增栏目' : '编辑栏目'"
          v-model="dialog"
        >
          <Form ref="form" :model="model" :rules="rules" :label-width="75">
            <FormItem label="栏目名称" prop="name">
              <Input placeholder="请输入栏目名称" v-model="model.name" />
            </FormItem>
            <FormItem label="父栏目">
              <tree-select
                :treeData="treeData"
                v-model="model.pid"
                placeholder="请选择上级(默认根目录)"
              ></tree-select>
            </FormItem>
            <FormItem label="状态">
              <i-switch
                v-model="model.status"
                :true-value="1"
                :false-value="0"
              ></i-switch>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button @click="dialog = false">取消</Button>
            <Button
              :loading="loading"
              icon="md-checkmark"
              @click="onSubmit"
              type="primary"
              >确认</Button
            >
          </div>
        </Modal>
      </div>
    </f-panel>
  </div>
</template>

<script>
import { renderButton } from "fvc";
import categoryService from "@/services/category";
const Model = () => {
  return {
    id: null,
    pid: 0,
    name: null,
    status: 1
  };
};
import base from "@/mixins/base";
export default {
  name: "p-category",
  mixins: [base],
  data() {
    return {
      loading: false,
      category: [],
      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          key: "name",
          width: 200
        },
        {
          title: "父级",
          key: "pid",
          width: 200,
          render: (h, { row }) => {
            const target = this.treeData.find(d => d.id == row.pid);
            return h("div", target ? target.name : "-");
          }
        },
        {
          title: "状态",
          key: "status",
          width: 100,
          align: "center",
          render: (h, { row }) => {
            return h(
              "Tag",
              {
                props: {
                  color: row.status == 1 ? "success" : "error"
                }
              },
              row.status == 1 ? "启用" : "禁用"
            );
          }
        },
        {
          title: "创建日期",
          key: "created",
          width: 120,
          render: (h, { row }) => {
            return h("div", new Date(row.created).Format("yyyy-MM-dd"));
          }
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
            return renderButton(h, [
              {
                name: "edit",
                click: () => this.onEdit(row)
              },
              {
                name: "delete",
                click: () => this.onDel(row)
              }
            ]);
          }
        }
      ],
      dialog: false,
      action: "add",
      model: Model(),
      treeData: [],
      data: [],
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }]
      }
    };
  },
  methods: {
    renderTree() {
      const treeData = [{ name: "根目录", id: 0, pid: null, open: true }];
      this.loading = true;
      categoryService.findAll().then(rep => {
        const setting = {
          data: {
            simpleData: {
              enable: true,
              pIdKey: "pid"
            }
          },
          view: {
            showIcon: true
          },
          callback: {
            onClick: (e, type, node) => {
              const nodes = this.$treeObj.transformToArray(node);
              this.data = nodes.filter(node => node.id != 0);
            }
          }
        };
        this.data = rep;

        this.treeData = treeData.concat(
          rep.map(item => {
            item.open = true;
            return item;
          })
        );
        this.$treeObj = $.fn.zTree.init(
          $("#course-tree"),
          setting,
          this.treeData
        );
        this.loading = false;
      });
    },
    onAdd() {
      this.action = "add";
      this.dialog = true;
      this.model = Model();
      const node = this.$treeObj.getSelectedNodes();
      if (node.length > 0) {
        if (node[0].id != 0) {
          this.model.pid = node[0].id;
        }
      }
    },
    onEdit(row) {
      this.action = "edit";
      this.model = this._clone(Model(), row);
      this.dialog = true;
    },
    onDel(row) {
      this.$Modal.confirm({
        title: "提示",
        content: `确定要删除【${row.name}】吗？`,
        onOk: () => {
          if (this.treeData.filter(node => node.pid == row.id).length > 0) {
            return this.$Message.error("请先删除子栏目！");
          }
          this.loading = true;

          categoryService.remove(row.id).then(rep => {
            this.$Message.success("删除成功！");
            this.renderTree();
          });
        }
      });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.model));
          delete params.id;
          this.loading = true;
          if (this.action == "add") {
            categoryService.add(params).then(rep => {
              this.$Message.success("新增成功！");
              this.renderTree();
              this.dialog = false;
            });
          } else {
            categoryService.update(this.model.id, params).then(rep => {
              this.$Message.success("更新成功！");
              this.renderTree();
              this.dialog = false;
            });
          }
        }
      });
    }
  },
  mounted() {
    this.renderTree();
  }
};
</script>
<style lang="less">
.p-category {
  height: 100%;
  position: relative;
  display: flex;
  &__tree {
    background-color: #fff;
    width: 240px;
    display: flex;
    flex-direction: column;
    border-right: 2px solid #ddd;
  }
  &__content {
    flex: 1;
    overflow: hidden;
  }
}
</style>
