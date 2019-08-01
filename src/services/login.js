import axios from "./axios";
export default {
  login: params => axios.post(`/user/login`, params),
  logout: () => axios.get(`/login`)
};
