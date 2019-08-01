<template>
  <div :class="b()" id="login-bg" @mousemove="onMouseMove">
    <div id="stars">
      <div class="star" style="top: 0px;left: 500px;"></div>
    </div>
    <transition name="fadeDown">
      <div v-show="show" :class="b('block')">
        <div class="left">
          <div :class="b('logo')">
            <img src="~@/assets/images/sys-name.png" alt="" />
          </div>
        </div>
        <div class="right">
          <div :class="b('form')">
            <h5>用户登录</h5>
            <div class="user">
              <i class="iconfont iconyonghu"></i>
              <Input v-model="form.username" clearable placeholder="用户名" />
            </div>
            <div class="password">
              <i class="iconfont iconmima01-copy"></i>
              <Input
                type="password"
                v-model="form.password"
                clearable
                @on-enter="onSubmit"
                placeholder="密码"
              />
            </div>
            <div class="save_pwd">
              <Checkbox v-model="save"
                >&nbsp;<span style="color: #fff">记住密码</span></Checkbox
              >
            </div>

            <div class="button">
              <button @click="onSubmit">{{loading ? '登录中...':'登 录'}}</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import loginService from "@/services/login";
import axios from "@/services/axios";
export default {
  name: "Login",
  block: "p-login",
  data() {
    return {
      name: process.env.VUE_APP_NAME,
      show: false,
      form: {
        username: process.env.NODE_ENV == "development" ? "admin" : "",
        password: process.env.NODE_ENV == "development" ? "admin123" : ""
      },
      loading: false,
      error: "",
      save: false
    };
  },
  methods: {
    ...mapMutations(["set_token"]),
    onSubmit() {
      if(this.loading) return ;
      if (!this.form.username || !this.form.password) {
        return this.$Message.warning("请输入用户名或者密码！");
      }

      this.loading = true;
      this.error = "";
      loginService
        .login(this.form)
        .then(rep => {
          if (rep) {
            this.$ls.set(
              "save",
              this.save ? this.form : "",
              new Date().valueOf() + 3600 * 24000
            );

            this.set_token("token");
            this.$ls.set(
              "token",
              rep.token,
              new Date().valueOf() + 3600 * 24000
            );
            axios.defaults.headers["X-AUTH-TOKEN"] = rep.token;
            this.$store.dispatch("common/init");
            this.$router.replace({ name: "Home" });
          } else {
            this.error = "用户名或者密码错误";
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    onMouseMove(e) {
      const width = window.screen.width / 2;
      const height = window.screen.height / 2;
      let p = null,
        h = null;
      if (width > e.clientX) {
        p = 10 - ((width - e.clientX) / width) * 10;
      } else {
        p = ((e.clientX - width) / width) * 10 + 10;
      }
      if (height > e.clientY) {
        h = 10 - ((height - e.clientY) / height) * 10;
      } else {
        h = ((e.clientY - height) / height) * 10 + 10;
      }
      $("#login-bg").css("background-position", `${p}% ${h}%`);
    }
  },
  mounted() {
    var stars = document.getElementById("stars");
    // 封装随机数方法
    const randomDistance = (max, min) => {
      const distance = Math.floor(Math.random() * (max - min + 1) + min);
      return distance;
    };
    // js随机生成流星
    for (let j = 0; j < 10; j++) {
      const newStar = document.createElement("div");
      newStar.className = "star";
      newStar.style.top = randomDistance(120, -100) + "px";
      newStar.style.left = randomDistance(1800, 800) + "px";
      stars.appendChild(newStar);
    }

    const star = document.getElementsByClassName("star");

    // 给流星添加动画延时
    for (let i = 0, len = star.length; i < len; i++) {
      star[i].style.animationDelay = i % 6 == 0 ? "0s" : i * 0.8 + "s";
    }
    this.show = true;
    const save = this.$ls.get("save") || false;
    if (save) {
      this.save = true;
      this.form.password = save.password;
      this.form.username = save.username;
    }
  }
};
</script>

<style lang="less">
.p-login {
  height: 100%;
  overflow-y: hidden;
  background: url("./images/login-bg.jpg") no-repeat;
  background-size: 120% 110%;
  transition: background-position 0.1s;
  .particles {
    height: 100%;
  }
  &__block {
    width: 1200px;
    display: flex;
    position: absolute;
    top: -10%;
    left: 50%;
    margin-left: -600px;
    height: 100%;
    .left,
    .right {
      overflow: hidden;
      align-items: center;
      justify-content: center;
      display: flex;
    }

    .right {
      width: 614px;
      position: relative;
      height: 100%;
    }
    .left {
      flex: 1;
      align-items: center;
      justify-content: center;
    }
  }

  &__logo {
    user-select: none;
    img {
      width: 542px;
    }
  }

  &__news {
    padding-top: 15px;
    li {
      a {
        font-weight: 400;
        color: rgba(210, 231, 254, 0.9);
        line-height: 32px;
        font-size: 16px;
        display: flex;
        align-items: center;
        &:hover {
          color: #fff;
        }
      }
    }
  }
  &__form {
    position: absolute;
    width: 100%;
    height: 669px;
    background: url("./images/login-box.png") no-repeat;
    background-size: 100% 100%;
    padding-top: 196px;

    h5 {
      text-align: center;
      height: 30px;
      font-size: 20px;
      font-weight: 400;
      color: rgba(4, 202, 244, 1);
      line-height: 20px;
    }

    .user,
    .password {
      height: 42px;
      background-color: #fff;
      width: 220px;
      margin: 20px auto 0 auto;
      display: flex;
      i {
        width: 47px;
        height: 100%;
        color: #999;
        font-size: 22px;
        text-align: center;
        line-height: 42px;
        border-right: 1px solid #ddd;
      }
      .ivu-input {
        height: 42px;
        border: none;
        border-radius: 0;
        font-size: 14px;
      }
    }
    .save_pwd {
      width: 220px;
      margin: 15px auto;
      .ivu-checkbox {
        color: #fff;
      }
    }
    .button {
      text-align: center;
      button {
        cursor: pointer;
        width: 220px;
        height: 42px;
        background: linear-gradient(
          90deg,
          rgba(0, 200, 224, 1),
          rgba(2, 97, 240, 1)
        );
        border-radius: 21px;
        border: none;
        color: #fff;
        font-size: 22px;
        transition: all 0.4s;
        outline: none;
        text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
        &:hover {
          background: rgba(2, 97, 240, 1);
        }
        &:active {
          background: rgba(0, 200, 224, 1);
        }
      }
    }
  }
}
@keyframes star-fall {
  0% {
    opacity: 0;
    transform: scale(0.5) translate3d(0, 0, 0);
    -webkit-transform: scale(0.5) translate3d(0, 0, 0);
    -moz-transform: scale(0.5) translate3d(0, 0, 0);
  }
  50% {
    opacity: 1;
    transform: translate3d(-200px, 200px, 0);
    -webkit-transform: translate3d(-200px, 200px, 0);
    -moz-transform: translate3d(-200px, 200px, 0);
  }
  100% {
    opacity: 0;
    transform: scale(1.2) translate3d(-300px, 300px, 0);
    -webkit-transform: scale(1.2) translate3d(-300px, 300px, 0);
    -moz-transform: scale(1.2) translate3d(-300px, 300px, 0);
  }
}
#stars {
  margin: 0 auto;
  max-width: 1600px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .star {
    display: block;
    width: 1px;
    background: transparent;
    position: relative;
    opacity: 0;
    /*过渡动画*/
    animation: star-fall 3s linear infinite;
    -webkit-animation: star-fall 3s linear infinite;
    -moz-animation: star-fall 3s linear infinite;
  }

  .star:after {
    content: "";
    display: block;
    border: 0px solid #fff;
    border-width: 0px 90px 2px 90px;
    border-color: transparent transparent transparent rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 1px 0 rgba(255, 255, 255, 0.1);
    /*变形*/
    transform: rotate(-45deg) translate3d(1px, 3px, 0);
    -webkit-transform: rotate(-45deg) translate3d(1px, 3px, 0);
    -moz-transform: rotate(-45deg) translate3d(1px, 3px, 0);
    transform-origin: 0% 100%;
    -webkit-transform-origin: 0% 100%;
    -moz-transform-origin: 0% 100%;
  }
}
</style>
