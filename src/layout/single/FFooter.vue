<template>
  <div class="f-footer">
    <!-- <div class="f-footer__center">
      <img src="~@/assets/images/notice.png" alt="" />
      共 <strong>{{ notices.length }}</strong>
      条报警推送：
      <div class="f-footer__block">
        <ul :class="{ 'margin-top': animate }">
          <li
            v-for="(notice, index) in notices"
            :key="index"
            v-html="notice"
          ></li>
        </ul>
      </div>
    </div> -->
    <div class="f-footer__center" style="text-align:center;">
      <Icon type="ios-barcode-outline" size="24" /> &nbsp;&nbsp;版权所有 &copy;
      2019
      <strong
        ><a href="javascript:void(0)" @click="onAbout">零一训练营</a></strong
      >
    </div>
    <div class="f-footer__right">
      {{ system.version }}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "FFooter",
  computed: {
    ...mapState("common", ["me", "system"])
  },
  data() {
    return {
      notices: [
        `<b>10:00</b> 马家浜一号泵站液位超过上限，报警值：<strong>3.00 m</strong>  参考值：<b>2.30 m</b>。`,
        `<b>15:20</b> 马家浜二号泵站液位超过上限，报警值：<strong>3.20 m</strong>  参考值：<b>2.50 m</b>。`
      ],
      animate: false
    };
  },
  methods: {
    render() {
      // if (!this.timer) this.timer = setInterval(this.noticeLoop, 3000);
    },
    onAbout() {
      this.$router.push({ name: "About" });
    },
    noticeLoop() {
      this.animate = true;
      setTimeout(() => {
        this.notices.push(this.notices[0]);
        this.notices.shift();
        this.animate = false;
      }, 500);
    }
  },
  mounted() {
    this.render();
  }
};
</script>

<style lang="less">
.f-footer {
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  color: #000;
  background-color: #e0e3ef;
  border-top: 1px solid #d5d9e7;
  bottom: 0;
  left: 0;
  display: flex;
  right: 0;
  padding: 0 6px;

  &__left {
    width: 150px;
    color: #333;
  }
  &__center {
    flex: 1;
    display: flex;
    color: #333;
    align-items: center;
    img {
      width: 26px;
      height: 26px;
      margin-right: 5px;
      margin-top: -4px;
    }

    strong {
      color: #f95a54;
      margin: 0 5px;
    }
  }
  &__right {
    width: 350px;
    color: #333;
    text-align: right;
  }

  &__block {
    display: flex;
    position: relative;
    height: 30px;
    line-height: 30px;
    flex: 1;
    overflow: hidden;

    ul {
      position: absolute;
      li {
        list-style: none;
        height: 30px;
      }

      &.margin-top {
        margin-top: -30px;
        transition: all 0.5s;
      }
    }
  }
}
/*@media only screen and(max-width: 1400px) {*/
/*  .f-footer {*/
/*    height: 36px;*/
/*    line-height: 36px;*/
/*  }*/
/*}*/
</style>
