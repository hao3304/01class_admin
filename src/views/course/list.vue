<template>
  <div :class="b()">
    <Spin fix v-show="loading"></Spin>
    <div :class="b('tree')">
      <div id="course-tree" class="ztree"></div>
    </div>
    <f-panel :class="b('content')">
      <div slot="header">
        <f-filter @on-filter="onSearch" :list="filters">
          <div slot="buttons">
            <Button @click="onAdd" icon="md-add" type="primary">课程</Button>
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
          :title="action == 'add' ? '新增课程' : '编辑课程'"
          v-model="dialog"
          fullscreen
        >
          <Form ref="form" :model="model" :rules="rules" :label-width="75">
            <Row>
              <i-col :span="12">
                <FormItem label="课程名称" prop="title">
                  <Input placeholder="请输入课程名称" v-model="model.title" />
                </FormItem>
              </i-col>
              <i-col :span="8">
                <FormItem label="栏目" prop="category">
                  <tree-select
                    :treeData="treeData"
                    v-model="model.category"
                    placeholder="请选择上级(默认根目录)"
                  ></tree-select>
                </FormItem>
              </i-col>
              <i-col :span="4">
                <FormItem label="状态">
                  <i-switch
                    v-model="model.status"
                    :true-value="1"
                    :false-value="0"
                  ></i-switch>
                </FormItem>
              </i-col>
              <i-col style="border: 1px solid #ccc" :span="24">
                <mark-down ref="editor" :initialValue="initialValue" />
              </i-col>
            </Row>
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
import courseService from "@/services/course";
import MarkDown from "vue-meditor";
const Model = () => {
  return {
    id: null,
    title: null,
    content: null,
    status: 1,
    category: null
  };
};
import base from "@/mixins/base";
export default {
  name: "p-course",
  mixins: [base],
  components: { MarkDown },
  data() {
    return {
      loading: false,
      category: [],
      initialValue: "",
      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "课程名称",
          key: "title",
          width: 220
        },
        {
          title: "栏目",
          key: "category",
          width: 200,
          render: (h, { row }) => {
            const target = this.treeData.find(d => d.id == row.category);
            return h("div", target ? target.name : "-");
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
        title: [{ required: true, message: "必填", trigger: "blur" }],
        category: [
          { required: true, type: "number", message: "必填", trigger: "change" }
        ]
      },
      filters: [
        {
          type: "input",
          field: "title",
          placeholder: "请输入课程名称模糊查询",
          name: "课程名称"
        }
      ],
      query: {
        title: null,
        category: null
      }
    };
  },
  methods: {
    onSearch(filters) {
      if (filters.length > 0) {
        this.query.title = filters[0].value;
      } else {
        this.query.title = null;
      }
      this.render();
    },
    render() {
      this.loading = true;
      courseService.findAll(this.query).then(rep => {
        this.data = rep;
        this.loading = false;
      });
    },
    renderTree() {
      const treeData = [{ id: 0, name: "全部栏目", open: true }];
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
              this.query.category = node.id == 0 ? null : node.id;
              this.render();
            }
          }
        };

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
          this.model.category = node[0].id;
        }
      }
    },
    onEdit(row) {
      this.action = "edit";
      this.model = this._clone(Model(), row);
      this.initialValue = row.content;
      this.dialog = true;
    },
    onDel(row) {
      this.$Modal.confirm({
        title: "提示",
        content: `确定要删除课程【${row.title}】吗？`,
        onOk: () => {
          this.loading = true;

          courseService.remove(row.id).then(rep => {
            this.$Message.success("删除成功！");
            this.render();
          });
        }
      });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.model));
          delete params.id;
          params.content = this.$refs.editor.value;
          this.loading = true;
          if (this.action == "add") {
            courseService.add(params).then(rep => {
              this.$Message.success("新增成功！");
              this.render();
              this.dialog = false;
            });
          } else {
            courseService.update(this.model.id, params).then(rep => {
              this.$Message.success("更新成功！");
              this.render();
              this.dialog = false;
            });
          }
        }
      });
    }
  },
  mounted() {
    this.renderTree();
    this.render();
  }
};
</script>
<style lang="less">
.p-course {
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
