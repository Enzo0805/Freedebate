<template>
  <div class="wrap">
    <el-button class="switch" type="text" @click="changeShowHeader()">{{
      isShowHeader === false ? "展开菜单" : "收起菜单"
    }}</el-button>
    <div class="pageButton">
      <el-tooltip
        class="item"
        effect="light"
        content="按 ← 键切换到上一环节"
        placement="top-start"
      >
        <el-button
          icon="el-icon-arrow-left"
          circle
          @click="goback()"
        ></el-button>
      </el-tooltip>
    </div>
    <div class="single-timer">
      <div v-show="page === 1">
        <single-timer ref="SingleTimer1" :msg="message[0]" :SumTime="3" />
      </div>
      <div v-show="page === 2">
        <single-timer ref="SingleTimer2" :msg="message[1]" :SumTime="3" />
      </div>
      <div v-show="page === 3">
        <single-timer ref="SingleTimer3" :msg="message[2]" :SumTime="3" />
      </div>
      <div v-show="page === 4">
        <single-timer ref="SingleTimer4" :msg="message[3]" :SumTime="3" />
      </div>
      <div v-show="page === 5">
        <single-timer ref="SingleTimer5" :msg="message[4]" :SumTime="3" />
      </div>
      <div v-show="page === 6">
        <single-timer ref="SingleTimer6" :msg="message[5]" :SumTime="3" />
      </div>
      <div v-show="page === 7">
        <single-timer ref="SingleTimer7" :msg="message[6]" :SumTime="3" />
      </div>
      <div v-show="page === 8">
        <single-timer ref="SingleTimer8" :msg="message[7]" :SumTime="3" />
      </div>
      <div v-show="page === 9">
        <single-timer ref="SingleTimer9" :msg="message[8]" :SumTime="3" />
      </div>
      <div v-show="page === 10">
        <single-timer ref="SingleTimer10" :msg="message[9]" :SumTime="3" />
      </div>
      <div v-show="page === 11">
        <free-debate ref="FreeDebate" />
      </div>
      <div v-show="page === 12">
        <single-timer ref="SingleTimer12" :msg="message[10]" :SumTime="4" />
      </div>
      <div v-show="page === 13">
        <single-timer ref="SingleTimer13" :msg="message[11]" :SumTime="4" />
      </div>
    </div>
    <div class="pageButton">
      <el-tooltip
        class="item"
        effect="light"
        content="按 → 键切换到下一环节"
        placement="top-start"
      >
        <el-button
          icon="el-icon-arrow-right"
          circle
          @click="goforward()"
        ></el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { thorttle, debounce } from "@/common/utils.js";
import FreeDebate from "../../components/Timers/FreeDebate.vue";
import SingleTimer from "../../components/Timers/SingleTimer.vue";
import { mapState } from "vuex";
export default {
  components: { SingleTimer, FreeDebate },
  name: "Fengzhan",
  data() {
    return {
      message: [
        "正方开篇立论",
        "反方四辩质询",
        "反方开篇立论",
        "正方四辩质询",
        "正方二辩申论",
        "反方三辩质询",
        "反方二辩申论",
        "正方三辩质询",
        "反方三辩小结",
        "正方三辩小结",
        "反方总结陈词",
        "正方总结陈词",
      ],
      page: 1,
    };
  },
  computed: {
    ...mapState(["isShowHeader"]),
  },
  watch: {
    page(newPage, oldPage) {
      if (oldPage === 11) {
        this.$refs.FreeDebate.stopTimer();
      } else if (oldPage === 1) {
        this.$refs.SingleTimer1.stopTimer();
      } else if (oldPage === 2) {
        this.$refs.SingleTimer2.stopTimer();
      } else if (oldPage === 3) {
        this.$refs.SingleTimer3.stopTimer();
      } else if (oldPage === 4) {
        this.$refs.SingleTimer4.stopTimer();
      } else if (oldPage === 5) {
        this.$refs.SingleTimer5.stopTimer();
      } else if (oldPage === 6) {
        this.$refs.SingleTimer6.stopTimer();
      } else if (oldPage === 7) {
        this.$refs.SingleTimer7.stopTimer();
      } else if (oldPage === 8) {
        this.$refs.SingleTimer8.stopTimer();
      } else if (oldPage === 9) {
        this.$refs.SingleTimer9.stopTimer();
      } else if (oldPage === 10) {
        this.$refs.SingleTimer10.stopTimer();
      } else if (oldPage === 12) {
        this.$refs.SingleTimer12.stopTimer();
      } else if (oldPage === 13) {
        this.$refs.SingleTimer13.stopTimer();
      }
    },
  },
  methods: {
    changeShowHeader: debounce(function () {
      this.$store.commit("changeShowHeader");
    }, 300),
    goback: thorttle(function () {
      if (this.page > 1) {
        this.page--;
      }
    }, 300),
    goforward: thorttle(function () {
      if (this.page < 13) {
        this.page++;
      }
    }, 300),
    keyboardEvents(e) {
      var keyNum = window.event ? e.keyCode : e.which; //获取被按下的键值
      // console.log(e);
      // console.log(keyNum);
      if (keyNum == 37) {
        this.goback();
      } else if (keyNum == 39) {
        this.goforward();
      } else if (keyNum == 65) {
        if (this.page == 11) {
          this.$refs.FreeDebate.switchTimers();
        }
      }
    },
  },
  created() {
    let that = this;
    document.addEventListener("keydown", that.keyboardEvents);
    this.$store.commit("changeShowHeader");
  },
  mounted() {
    this.$notify.info({
      offset: 90,
      duration: 5000,
      title: "使用提示",
      dangerouslyUseHTMLString: true,
      message:
        "<strong>请按<i>F11</i>键开启全屏</strong><div>可使用键盘左右键切换环节</div><div>自由辩论环节可使用A键切换计时器</div>",
    });
  },
  destroyed() {
    //移除监听按键
    let that = this;
    document.removeEventListener("keydown", that.keyboardEvents);
  },
};
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
  background: url(../../assets/image/bgp.jpg);
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}
.single-timer {
  display: inline-block;
  width: 90%;
}
.pageButton {
  display: inline-block;
  margin: 0 auto;
  width: 5%;
}
.switch {
  position: fixed;
  z-index: 9999;
  bottom: 0;
}
</style>
