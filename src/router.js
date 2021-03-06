import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import page404 from "@/views/error-page/404.vue";
import Building from "@/views/building";

export default new Router({
  // mode: "history",
  // base: process.env.NODE_ENV == "production" ? "/app/" : "/",
  routes: [
    {
      path: "/building",
      component: () => import("@/layout/single"),
      children: [
        {
          path: "",
          name: "Building",
          component: Building
        }
      ]
    },
    {
      path: "/404",
      component: () => import("@/layout/full"),
      children: [
        {
          path: "",
          name: "404",
          component: page404
        }
      ]
    },
    {
      path: "/",
      meta: {
        title: "课程管理"
      },
      component: () => import("@/layout/single"),
      children: [
        {
          path: "",
          name: "Home",
          meta: {
            title: "栏目管理"
          },
          component: () => import("@/views/course/category")
        },
        {
          path: "/course",
          name: "Course",
          meta: {
            title: "课程列表"
          },
          component: () => import("@/views/course/list")
        }
      ]
    },
    {
      path: "/user",

      component: () => import("@/layout/single"),
      children: [
        {
          path: "list",
          name: "User",
          meta: {
            title: "用户管理"
          },
          component: () => import("@/views/user/list")
        }
      ]
    }
  ]
});
