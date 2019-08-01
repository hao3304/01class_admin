import axios from "axios";
import Cookies from "@/libs/ls";
import Vue from "../main";

export const GetRoot = () => {
  // const origin = window.location.origin;
  return process.env.VUE_APP_BOOT;

  // if (origin.indexOf("gitee") > -1) {
  //   return "https://mobile.jxrqgs.com";
  // } else {
  //   return process.env.NODE_ENV == "development"
  //     ? process.env.VUE_APP_BOOT
  //     : origin;
  // }
};
export const ROOT = GetRoot();
export const baseURL = ROOT + "/" + process.env.VUE_APP_DISPLAY;

const instance = axios.create({
  baseURL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    "X-AUTH-TOKEN": Cookies.get("token")
  }
});

instance.interceptors.response.use(
  res => {
    if (res.data.code === 0) {
      return res.data.data;
    } else if (res.data.code == 403) {
      Vue.$store.commit("LOGOUT");
      Vue.$router.push("/login");
      Vue.$Notice.error({
        title: "警告",
        desc: res.data.message,
        duration: 4
      });
      return Promise.reject();
    } else {
      Vue.$Notice.error({
        title: "警告",
        desc: res.data.message,
        duration: 4
      });
      return Promise.reject();
    }
  },
  error => {
    const { response } = error;
    if (!response) {
      Vue.$Notice.error({
        title: "警告",
        desc: error.message,
        duration: 4
      });

      return Promise.reject(error);
    }
    switch (response.status) {
      case 404:
        {
          Vue.$Notice.error({
            title: "警告",
            desc: "未找到服务！",
            duration: 4
          });
        }
        break;
      default:
        Vue.$Notice.error({
          title: "警告",
          desc: response.message,
          duration: 4
        });
    }

    return Promise.reject(error);
  }
);

export default instance;

export const RESTful = function(target) {
  return {
    findAll: params => instance.get(`/api/${target}`, { params }),
    add: params => instance.post(`/api/${target}`, params),
    remove: id => instance.delete(`/api/${target}/${id}`),
    update: (id, params) => instance.put(`/api/${target}/${id}`, params),
    findOne: id => instance.get(`/api/${target}/${id}`)
  };
};
