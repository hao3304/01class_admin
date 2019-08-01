import axios from "./axios";
export default {
  loads: () => axios.post(`/user/me`)
};
