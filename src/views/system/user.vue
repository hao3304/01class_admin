<template>
  <div class="page-user">
    <x-wrapper
      title="用户"
      service="user"
      :columns="columns"
      :model="model"
      :rules="rules"
      :filter="filter"
      ref="wrapper"
      :orders="['-changed']"
      :height="windowHeight - 260"
      @on-add="onBeforeAdd"
      @on-edit="onBeforeEdit"
      @on-update="onChangeRole"
      @on-save="onChangeRole"
    >
      <div slot="dialog" slot-scope="{ model }">
        <Row>
          <i-col :span="12">
            <FormItem :label="userModel.name" prop="name">
              <Input
                v-model="model.name"
                :placeholder="'请输入' + userModel.name"
              />
            </FormItem>
          </i-col>
          <i-col :span="12">
            <FormItem :label="userModel.sn">
              <Input
                v-model="model.sn"
                :placeholder="'请输入' + userModel.sn"
              />
            </FormItem>
          </i-col>
        </Row>

        <FormItem :label="userModel.type" prop="type">
          <Select v-model="model.type" :placeholder="'请选择' + userModel.type">
          </Select>
        </FormItem>

        <Row>
          <i-col :span="24">
            <FormItem :label="userModel.account" prop="account">
              <Input
                v-model="model.account"
                :placeholder="'请输入' + userModel.account"
              />
            </FormItem>
          </i-col>
          <i-col :span="12">
            <FormItem
              :label="userModel.password"
              prop="password"
              v-if="!model.id"
            >
              <Input
                v-model="model.password"
                type="password"
                :placeholder="'请输入' + userModel.password"
              />
            </FormItem>
          </i-col>
        </Row>

        <FormItem :label="userModel.auth" prop="type">
          <Select v-model="model.auth" :placeholder="'请选择' + userModel.auth">
          </Select>
        </FormItem>
        <Row>
          <i-col :span="12">
            <FormItem :label="userModel.admin">
              <i-switch
                v-model="model.admin"
                :true-value="1"
                :false-value="0"
              ></i-switch>
            </FormItem>
          </i-col>
          <i-col :span="12">
            <FormItem :label="userModel.status">
              <RadioGroup v-model.number="model.status">
                <Radio :label="1">启用</Radio>
                <Radio :label="0">禁用</Radio>
              </RadioGroup>
            </FormItem>
          </i-col>
          <Divider>基本信息</Divider>
          <i-col :span="12">
            <FormItem :label="userModel.faceid">
              <upload-pic v-model="model.faceid"></upload-pic>
            </FormItem>
          </i-col>
          <i-col :span="12">
            <FormItem :label="userModel.avatar">
              <upload-pic v-model="model.avatar"></upload-pic>
            </FormItem>
          </i-col>
        </Row>

        <FormItem :label="userModel.idcard">
          <Input
            v-model="model.idcard"
            :placeholder="'请输入' + userModel.idcard"
          />
        </FormItem>
        <Row>
          <i-col :span="12">
            <FormItem :label="userModel.birth">
              <DatePicker
                type="date"
                v-model="model.birth"
                :placeholder="'请选择' + userModel.birth"
                style="width: 200px"
              ></DatePicker>
            </FormItem>
          </i-col>
          <i-col :span="12">
            <FormItem :label="userModel.sex">
              <RadioGroup v-model.number="model.sex">
                <Radio :label="0">未知</Radio>
                <Radio :label="1">男</Radio>
                <Radio :label="2">女</Radio>
              </RadioGroup>
            </FormItem>
          </i-col>
          <i-col :span="24">
            <FormItem :label="userModel.dep">
              <tree-select
                :simpleData="false"
                :treeData="deps"
                v-model="model.dep"
                placeholder="请选择部门"
              ></tree-select>
            </FormItem>
          </i-col>
          <i-col :span="12">
            <FormItem :label="userModel.job">
              <Input
                v-model="model.job"
                :placeholder="'请输入' + userModel.job"
              />
            </FormItem>
          </i-col>

          <i-col :span="12">
            <FormItem :label="userModel.email">
              <Input
                v-model="model.email"
                :placeholder="'请输入' + userModel.email"
              />
            </FormItem>
          </i-col>
          <i-col :span="12">
            <FormItem :label="userModel.mobile">
              <Input
                v-model="model.mobile"
                :placeholder="'请输入' + userModel.mobile"
              />
            </FormItem>
          </i-col>
          <i-col :span="12">
            <FormItem :label="userModel.smobile">
              <Input
                v-model="model.smobile"
                :placeholder="'请输入' + userModel.smobile"
              />
            </FormItem>
          </i-col>
        </Row>

        <FormItem :label="userModel.telephone">
          <Input
            v-model="model.telephone"
            :placeholder="'请输入' + userModel.telephone"
          />
        </FormItem>
        <Divider>用户角色</Divider>
        <div class="role-list">
          <CheckboxGroup v-model="targetRole">
            <div class="role-list__item" v-for="r in roles" :key="r.id">
              <Checkbox :label="r.id">
                {{ r.name }}
              </Checkbox>
            </div>
          </CheckboxGroup>
        </div>
      </div>
    </x-wrapper>

    <Modal title="重置密码" v-model="dialog">
      <Input
        type="password"
        v-model="newPassword"
        placeholder="请输入新的密码"
      />
      <div slot="footer">
        <Button @click="dialog = false">取消</Button>
        <Button @click="onOk" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import types from "@/types";
const { userModel, newUser } = types;
import Vue from "vue";
import uploadPic from "@/components/uploadPic";
import { mapState } from "vuex";
import roleUserService from "@/services/role_user";
import { resetPasword } from "@/services/user";

export default {
  name: "User",
  components: {
    uploadPic
  },
  computed: {
    ...mapState("common", ["roles", "deps"]),
    ...mapState(["windowHeight"])
  },
  data() {
    return {
      userModel,
      columns: [
        {
          width: 50,
          align: "center",
          type: "selection"
        },
        {
          title: userModel.name,
          width: 150,
          key: "name",
          sortable: "custom"
        },
        {
          title: userModel.account,
          width: 150,
          key: "account",
          sortable: "custom"
        },
        {
          title: userModel.status,
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
          title: userModel.admin,
          width: 120,
          key: "admin",
          sortable: "custom",
          render: (h, { row }) => {
            return h("div", {}, row.admin == 1 ? "是" : "");
          }
        },
        {
          title: userModel.sex,
          sortable: "custom",
          width: 100,
          key: "sex",
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("sex")(row.sex));
          }
        },
        {
          title: userModel.birth,
          width: 120,
          sortable: "custom",
          key: "birth"
        },
        {
          title: userModel.idcard,
          width: 180,
          key: "idcard",
          sortable: "custom"
        },
        {
          title: userModel.job,
          width: 200,
          key: "job"
        },
        {
          title: userModel.email,
          width: 200,
          key: "email"
        },
        {
          title: userModel.mobile,
          width: 120,
          key: "mobile"
        },
        {
          title: userModel.smobile,
          width: 100,
          key: "smobile"
        },
        {
          title: userModel.telephone,
          width: 120,
          key: "telephone"
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
          width: 150,
          key: "changed",
          sortable: "custom",
          render: (h, { row }) => {
            return h("div", {}, Vue.filter("dateFormat")(row.changed * 1000));
          }
        },
        {
          title: "操作",
          fixed: "right",
          width: 120,
          align: "center",
          render: (h, { row }) => {
            return h("div", [
              h(
                "IconButton",
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
                    icon: "iconfont icon-iconfontmima",
                    type: "primary",
                    tooltip: "重置密码",
                    placement: "right"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => this.onRestPwd(row)
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
          name: userModel.name,
          field: "name",
          placeholder: `请输入${userModel.name}模糊查询`
        },
        {
          type: "input",
          name: userModel.account,
          field: "account",
          placeholder: `请输入${userModel.account}模糊查询`
        },
        {
          type: "select",
          name: userModel.sex,
          field: "sex",
          placeholder: "请选择性别进行筛选",
          data: [
            { value: 0, name: "未知" },
            { value: 1, name: "男" },
            { value: 2, name: "女" }
          ]
        },
        {
          type: "input",
          name: userModel.idcard,
          field: "idcard",
          placeholder: `请输入${userModel.idcard}模糊查询`
        },
        {
          type: "input",
          name: userModel.email,
          field: "email",
          placeholder: `请输入${userModel.email}模糊查询`
        },
        {
          type: "input",
          name: userModel.job,
          field: "job",
          placeholder: `请输入${userModel.job}模糊查询`
        },
        {
          type: "input",
          name: userModel.mobile,
          field: "mobile",
          placeholder: `请输入${userModel.mobile}模糊查询`
        },
        {
          type: "input",
          name: userModel.smobile,
          field: "smobile",
          placeholder: `请输入${userModel.smobile}模糊查询`
        },
        {
          type: "input",
          name: userModel.telephone,
          field: "telephone",
          placeholder: `请输入${userModel.telephone}模糊查询`
        }
      ],
      total: 0,
      model: newUser,
      active: "one",
      targetRole: [],
      dialog: false,
      newPassword: "",
      selectUser: null
    };
  },
  methods: {
    onBeforeAdd() {
      this.active = "one";
      this.targetRole = [];
    },
    onBeforeEdit(row) {
      this.active = "one";
      roleUserService
        .findAll({
          size: 999,
          fields: ["*"],
          filters: [
            {
              op: "eq",
              field: "user",
              args: [row.id]
            }
          ],
          Orders: ["id"]
        })
        .then(rep => {
          this.targetRole = rep.data.map(r => r.role);
        });
    },
    onOk() {
      if (this.newPassword == "") {
        return this.$Message.warning("密码不能为空！");
      }
      resetPasword({
        id: [this.selectUser.id],
        password: this.newPassword
      }).then(() => {
        this.dialog = false;
        this.$Message.success("修改成功！");
      });
    },
    onRestPwd(row) {
      this.selectUser = row;
      this.dialog = true;
      this.newPassword = "";
    },
    onChangeRole(row) {
      roleUserService
        .batchDeleteInsert({
          deletes: {
            filters: [
              {
                op: "eq",
                field: "user",
                args: [row.id]
              }
            ]
          },
          inserts: this.targetRole.map(r => {
            return {
              user: row.id,
              role: r
            };
          })
        })
        .then(rep => {
          console.log(rep);
        });
    }
  }
};
</script>
<style lang="less">
.page-user {
  height: 100%;
}
.role-list {
  border: 1px solid #ddd;
  padding: 5px 10px 10px 10px;
  &__item {
    margin-top: 5px;
  }
}
</style>
