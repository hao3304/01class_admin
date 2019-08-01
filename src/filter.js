import Vue from "vue";
import store from "@/store";
import { baseURL } from "@/services/axios";
import { toDecimal } from "@/libs/common";

Vue.filter("up-time", time => {
  if (time) {
    const now = new Date();
    const year = now.Format("yyyy");
    const month = now.Format("MM");
    const day = now.Format("dd");
    const current = new Date(time * 1000).Format("yyyy-MM-dd hh:mm");
    if (current.indexOf(year) > -1) {
      if (current.indexOf(`${year}-${month}-${day}`) > -1) {
        return current.split(" ")[1];
      } else {
        return current.slice(5, 19);
      }
    } else {
      return current;
    }
  } else {
    return "-";
  }
});

Vue.filter("fm", (v1, v2) => {
  if (v1 && v2) {
    if (v1.value == 1 && v2.value == 0) {
      return "开到位";
    } else if (v1.value == 0 && v2.value == 1) {
      return "关到位";
    } else if (v1.value == 0 && v2.value == 0) {
      return "开";
    } else {
      return "故障";
    }
  } else {
    return "-";
  }
});



Vue.filter("dateFormat", (value, format) => {
  if (!value) {
    return "-";
  }

  if (format) {
    return new Date(value).Format(format);
  } else {
    return new Date(value).Format("yyyy-MM-dd");
  }
});

Vue.filter("dict", (value, type) => {
  const dicts = store.state.common.dicts;
  const target = dicts.find(d => d.id == type);
  if (target) {
    const dict = target.values.find(t => t.value == value);
    return dict ? dict.name : "-";
  } else {
    return "-";
  }
});

Vue.filter("toFixed", (value, type) => {
  const units = store.state.common.units;
  const unit = units.find(u => u.id == type);
  if (value == null) return "-";

  if (unit.unit && unit.unit.indexOf("#") > -1) {
    const uu = unit.unit.match(/\d:\W+/g);
    const val = uu.find(u => u.indexOf(value) > -1);
    return val
      ? val
          .split(":")[1]
          .replace("#", "")
          .replace("*", "")
      : "-";
  }
  return unit ? toDecimal(value, unit.precision) : value;
});

Vue.filter("valueUnit", (value, type) => {
  const units = store.state.common.units;
  const unit = units.find(u => u.id == type);
  if (value == null) return "-";

  if (unit) {
    if (unit.unit && unit.unit.indexOf("#") > -1) {
      const uu = unit.unit.match(/\d:\W+/g);
      const val = uu.find(u => u.indexOf(value) > -1);
      return val
        ? val
            .split(":")[1]
            .replace("#", "")
            .replace("*", "")
        : "-";
    } else {
      return (
        toDecimal(value, unit.precision) + (unit.unit ? ` ${unit.unit}` : "")
      );
    }
  } else {
    return "-";
  }
});

Vue.filter("unit", type => {
  const units = store.state.common.units;
  const unit = units.find(u => u.id == type);
  if (unit) {
    if (unit.unit && unit.unit.indexOf("#") > -1) {
      return null;
    } else {
      return unit.unit ? ` ${unit.unit}` : null;
    }
  } else {
    return null;
  }
});

Vue.filter("image", (value, option = {}) => {
  return baseURL + `/image/${value}/${option.height || 0}/${option.width || 0}`;
});

Date.prototype.Format = function(fmt) {
  //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "D+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+|Y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
