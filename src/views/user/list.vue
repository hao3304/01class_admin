<template>
  <f-panel :class="b()">
    <div slot="header">
      <f-filter :list="filters">
        <div slot="buttons">
          <Button icon="md-add" @click="onAdd" type="primary">用户</Button>
        </div>
      </f-filter>
    </div>
    <div slot="body" slot-scope="params">
      <Table
        size="small"
        :height="params.bodyHeight"
        border
        stripe
        :loading="loading"
        :data="data"
        :columns="columns"
        class="f-table"
      ></Table>

      <Modal
        :title="action == 'add' ? '新增用户' : '编辑用户'"
        v-model="dialog"
      >
        <Form ref="form" :model="model" :rules="rules" :label-width="75">
          <Row>
            <i-col :span="12">
              <FormItem label="姓" prop="firstname">
                <Input placeholder="请输入姓氏" v-model="model.firstname" />
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="名" prop="lastname">
                <Input placeholder="请输入名称" v-model="model.lastname" />
              </FormItem>
            </i-col>
            <i-col :span="24">
              <FormItem label="帐号" prop="id">
                <Input
                  :disabled="action == 'edit'"
                  placeholder="请输入帐号"
                  v-model="model.id"
                />
              </FormItem>
            </i-col>
            <i-col :span="24">
              <FormItem label="密码" prop="password">
                <Input placeholder="请输入密码" v-model="model.password" />
              </FormItem>
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
    <div slot="footer">
      <f-page
        :total="total"
        :current.sync="query.page"
        @on-page-change="onPageChange"
        @on-size-change="onSizeChange"
      ></f-page>
    </div>
  </f-panel>
</template>

<script>
import { renderButton, getRequires } from "fvc";
import userService from "@/services/user";
import base from "@/mixins/base";
const Model = () => {
  return {
    firstname: null,
    lastname: null,
    id: null,
    password: null
  };
};

export default {
  name: "p-user",
  mixins: [base],
  data() {
    return {
      loading: false,
      total: 0,
      data: [],
      dialog: false,
      action: "add",
      model: Model(),
      rules: getRequires(["lastname", "firstname", "id", "password"]),
      columns: [
        {
          type: "index",
          align: "center",
          width: 60
        },
        {
          title: "帐号",
          key: "id",
          width: 120
        },
        {
          title: "姓名",
          key: "name",
          width: 100,
          render: (h, { row }) => {
            return h("div", row.firstname + row.lastname);
          }
        },
        {
          title: "密码",
          key: "password",
          width: 120
        },
        {
          title: " ",
          minWidth: 1
        },
        {
          title: "操作",
          width: 120,
          align: "center",
          fixed: "right",
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
      query: {
        page: 1,
        size: 20
      },
      filters: [
        {
          type: "input",
          field: "title",
          placeholder: "请输入帐号模糊查询",
          name: "帐号"
        }
      ]
    };
  },
  methods: {
    reset() {
      this.query.page = 1;
      this.render();
    },
    render() {
      this.loading = true;
      userService.findAll(this.query).then(rep => {
        this.total = parseInt(rep.count);
        this.data = rep.data;
        this.loading = false;
      });
    },
    onPageChange(p) {
      this.query.page = p;
      this.render();
    },
    onSizeChange(s) {
      this.query.size = s;
      this.render();
    },
    onAdd() {
      this.action = "add";
      this.dialog = true;
      this.model = Model();
    },
    onEdit(row) {
      this.action = "edit";
      this.model = this._clone(Model(), row);
      this.id = row.id;
      this.dialog = true;
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.model));
          this.loading = true;
          if (this.action == "add") {
            userService
              .add(params)
              .then(rep => {
                this.$Message.success("新增成功！");
                this.reset();
                this.dialog = false;
              })
              .catch(e => {
                this.loading = false;
              });
          } else {
            delete params.id;
            userService
              .update(this.id, params)
              .then(rep => {
                this.$Message.success("更新成功！");
                this.reset();
                this.dialog = false;
              })
              .catch(e => {
                this.loading = false;
              });
          }
        }
      });
    },
    onDel(row) {
      this.$Modal.confirm({
        title: "提示",
        content: `确定要删除用户【${row.id}】吗？`,
        onOk: () => {
          this.loading = true;
          userService.remove(row.id).then(rep => {
            this.$Message.success("删除成功！");
            this.render();
          });
        }
      });
    }
  },
  mounted() {
    this.render();
  }
};
</script>

<style lang="less">
.p-user {
  height: 100%;
}
</style>
