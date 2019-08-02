import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["windowHeight", "winHeight", "winWidth", "windowWidth"]),
    ...mapState("common", ["areas"])
  },
  methods: {
    _clone(target, data) {
      for (let d in data) {
        if (d in target) {
          target[d] = data[d];
        }
      }
      return target;
    }
  },
  mounted() {
    if (this.baseTime) clearInterval(this.baseTime);
    this.baseTime = setInterval(() => {
      if (this.busRun) {
        this.busRun.call(this);
      }
    }, 30000);
  },
  beforeDestroy() {
    clearInterval(this.baseTime);
  }
};
