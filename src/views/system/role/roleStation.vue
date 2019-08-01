<template>
  <f-panel>
    <div slot="header" style="text-align: right">
      <Button
        @click="onSubmit"
        icon="md-cloud-upload"
        :disabled="!role"
        type="primary"
        >更新权限</Button
      >
    </div>
    <div slot="body" slot-scope="props">
      <Spin fix v-show="loading"></Spin>
      <not-find v-if="!role" content="请先选择角色">
        <div slot="button"></div>
      </not-find>
      <TreeGrid
        v-else
        ref="tree"
        class="f-table"
        :style="{ height: props.bodyHeight + 'px' }"
        :data="data"
        :checkbox="true"
        idField="id"
        treeField="name"
      >
        <GridColumn field="name" title="站点名称"></GridColumn>
        <GridColumn field="id" title="ID"></GridColumn>
      </TreeGrid>
    </div>
  </f-panel>
</template>

<script>
import base from "@/mixins/base";
import { AdminRolePerms, AdminGrantPerm } from "@/graphqls/base.graphql";

export default {
  props: ["role"],
  data() {
    return {
      data: [],
      stations: [],
      loading: false
    };
  },
  watch: {
    role() {
      if (this.role) {
        this.render();
      }
    }
  },
  mixins: [base],
  methods: {
    render() {
      this.loading = true;

      this.GetStationTree(null, false, true).then(rep => {
        // rep.forEach(item => {
        //   item.checkState = "checked";
        // });
        this.getRolePerms(rep);
      });
    },
    getRolePerms(data) {
      this.$apollo
        .query({
          query: AdminRolePerms,
          variables: {
            id: this.role,
            typo: "station"
          },
          fetchPolicy: "network-only"
        })
        .then(rep => {
          const stations = rep.data.admin_role_perms;
          this.loading = false;
          data.forEach(area => {
            if (area.children) {
              let checkedLength = 0;
              area.children.forEach(child => {
                this.stations.push(child.id);

                if (stations.find(station => station == child.id)) {
                  child.checkState = "checked";
                  checkedLength++;
                  this.$set(child, "checkState", "checked");
                }
              });
              if (checkedLength > 0) {
                if (checkedLength == area.children.length) {
                  this.$set(area, "checkState", "checked");
                } else {
                  this.$set(area, "checkState", "indeterminate");
                }
              }
            }
          });
          this.data = data;
        });
    },
    onSubmit() {
      this.$Confirm({
        title: "提示",
        content: "确定要更新所选角色的站点权限吗?",
        onOk: () => {
          const checked = this.$refs.tree.getCheckedRows();
          const ids = checked
            .filter(check => check._type == "station")
            .map(station => station.id);

          this.$apollo
            .mutate({
              mutation: AdminGrantPerm,
              variables: {
                role: this.role,
                typo: "station",
                perms: this.stations.map(station => {
                  return {
                    oid: station,
                    status: ids.indexOf(station) > -1 ? 1 : 0
                  };
                })
              }
            })
            .then(() => {
              this.$Message.success("更新成功！");
              // this.render();
            });
        }
      });
    }
  }
};
</script>
