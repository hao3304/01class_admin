<template>
  <f-panel class="login-log">
    <div slot="header">
      <f-filter :list="filter" @on-filter="onFilter"> </f-filter>
    </div>
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
        @on-size-change="onPageSizeChange"
      ></f-page>
    </div>
  </f-panel>
</template>

<script>
import { mapMutations } from "vuex";
import base from "@/mixins/base";
import { AdminLog } from "@/graphqls/base.graphql";
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
          title: "类型",
          key: "type"
        },
        {
          width: 150,
          title: "IP",
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
          width: 100,
          title: "操作数",
          key: "ops"
        },
        {
          minWidth: 120,
          title: "Agent",
          key: "agent"
        },
        {
          width: 150,
          title: "登录时间",
          render: (h, { row }) => {
            return h(
              "div",
              {},
              new Date(row.created * 1000).Format("yyyy-MM-dd hh:mm")
            );
          }
        },
        {
          width: 150,
          title: "登出时间",
          render: (h, { row }) => {
            return h(
              "div",
              {},
              new Date(row.changed * 1000).Format("yyyy-MM-dd hh:mm")
            );
          }
        }
      ],
      loading: false,
      data: [],
      query: {
        size: 20,
        page: 1,
        account: null,
        name: null,
        type: null,
        count: true,
        stime: Date.parse(new Date()) / 1000 - 3600 * 24 * 90,
        etime: Date.parse(new Date()) / 1000
      },
      total: 0,
      filter: [
        {
          type: "input",
          name: "用户名称",
          field: "name",
          placeholder: "请输入用户名称模糊查询"
        },
        {
          type: "input",
          name: "账号",
          field: "account",
          placeholder: "请输入账号模糊查询"
        }
      ],
      filterLength: 0
    };
  },
  mixins: [base],
  methods: {
    ...mapMutations("monitor", ["set_stations"]),
    render() {
      this.loading = true;
      this.$apollo
        .query({
          query: AdminLog,
          variables: {
            input: this.query
          },
          fetchPolicy: "network-only"
        })
        .then(({ data }) => {
          this.data = data.admin_logins.data;
          this.total = data.admin_logins.total;
          this.loading = false;
          this.loading = false;
        });
    },
    onPageChange(e) {
      this.query.page = e;
      this.render();
    },
    onPageSizeChange(size) {
      this.query.page = 1;
      this.query.limit = size;
      this.render();
    },
    onFilter(filter) {
      const fName = filter.find(f => f.field == "name");
      const fAccount = filter.find(f => f.field == "account");

      this.query.name = fName ? fName.value : null;
      this.query.account = fAccount ? fAccount.value : null;
      this.query.page = 1;
      this.loading = true;
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
