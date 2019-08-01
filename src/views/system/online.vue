<template>
  <f-panel class="login-log" :header="false">
    <div slot="body" slot-scope="props">
      <Table
        stripe
        class="f-table"
        :columns="columns"
        :loading="loading"
        :height="props.bodyHeight"
        :data="data"
        size="small"
        border
      ></Table>
    </div>
    <div slot="footer">
      <f-page
        :total="total"
        @on-page-change="onPageChange"
        @on-size-change="onSizeChange"
      ></f-page>
    </div>
  </f-panel>
</template>

<script>
import { mapMutations } from "vuex";
import { AdminOnline, AdminTickOff } from "@/graphqls/base.graphql";
import Vue from "vue";
export default {
  data() {
    return {
      columns: [
        {
          width: 50,
          align: "center",
          render: (h, { row }) => {
            return h(
              "div",
              this.query.size * (this.query.page - 1) + row._index + 1
            );
          }
        },
        {
          width: 150,
          title: "登录时间",
          render: (h, { row }) => {
            return h("div", Vue.filter("up-time")(row.created));
          }
        },
        {
          width: 150,
          title: "最近在线",
          render: (h, { row }) => {
            return h("div", Vue.filter("up-time")(row.changed));
          }
        },
        {
          width: 100,
          title: "用户",
          render: (h, { row }) => {
            return h("div", row.user.name);
          }
        },
        {
          width: 100,
          title: "账号",
          render: (h, { row }) => {
            return h("div", row.user.account);
          }
        },
        {
          width: 100,
          title: "操作数",
          key: "ops"
        },
        {
          width: 100,
          title: "类型",
          key: "type"
        },
        {
          minWidth: 120,
          title: "Agent",
          key: "agent"
        },
        {
          width: 150,
          title: "登录IP",
          key: "ip",
          render: (h, { row }) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    window.open(
                      `http://ip138.com/ips138.asp?ip=${row.ip}&action=2`
                    );
                  }
                }
              },
              row.ip
            );
          }
        },
        {
          width: 120,
          align: "center",
          title: "操作",
          render: (h, { row }) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.$Confirm({
                      title: "提示",
                      content: "确定要进行强制下线操作吗？",
                      onOk: () => {
                        this.$apollo
                          .mutate({
                            mutation: AdminTickOff,
                            variables: {
                              id: row.id
                            }
                          })
                          .then(() => {
                            this.$Message.success("操作成功！");
                            this.render();
                          });
                      }
                    });
                  }
                }
              },
              "强制下线"
            );
          }
        }
      ],
      loading: false,
      data: [],
      query: {
        size: 20,
        page: 1,
        count: true
      },
      total: 0
    };
  },
  methods: {
    ...mapMutations("monitor", ["set_stations"]),
    render() {
      this.$apollo
        .query({
          query: AdminOnline,
          variables: {
            input: this.query
          },
          fetchPolicy: "network-only"
        })
        .then(({ data }) => {
          this.data = data.admin_onlines.data;
          this.total = data.admin_onlines.total;
          this.loading = false;
        });
    },
    onPageChange(e) {
      this.query.page = e;
      this.render();
    },
    onSizeChange(e) {
      this.query.size = e;
      this.render();
    }
  },
  mounted() {
    this.loading = true;
    this.render();
  }
};
</script>
<style lang="less">
.login-log {
  height: 100%;
}
</style>
