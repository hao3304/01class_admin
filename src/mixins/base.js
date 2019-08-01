import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["windowHeight", "winHeight", "winWidth", "windowWidth"]),
    ...mapState("common", ["areas"])
  },
  methods: {

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
