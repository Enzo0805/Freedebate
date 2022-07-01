<template>
  <div class="wrap">
    <TimerAudio ref="TimerAudio" />
    <div class="Inner">
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
            @click="page = 1"
          ></el-button>
        </el-tooltip>
      </div>
      <div class="outside" v-show="page === 1">
        <div class="timer">
          <div class="mandarin">正方</div>
          <div class="time">
            {{ timers[0].minutes }}:{{ timers[0].secondsCom }}
          </div>
          <br />
          <el-button-group>
            <el-button type="primary" size="medium" @click="addTimer(0)"
              >开始</el-button
            >
            <el-button type="danger" size="medium" @click="stopTimer(0)"
              >暂停</el-button
            >
          </el-button-group>
        </div>
        <div class="middle">
          <el-row>vs</el-row>
          <el-row>自由时间</el-row>
          <br />
        </div>
        <div class="timer">
          <div class="mandarin">反方</div>
          <div class="time">
            {{ timers[1].minutes }}:{{ timers[1].secondsCom }}
          </div>
          <br />
          <el-button-group>
            <el-button type="primary" size="medium" @click="addTimer(1)"
              >开始</el-button
            >
            <el-button type="danger" size="medium" @click="stopTimer(1)"
              >暂停</el-button
            >
          </el-button-group>
        </div>
      </div>
      <div class="outside" v-show="page === 2">
        <free-debate ref="FreeDebate" />
      </div>
      <div class="pageButton">
        <el-tooltip
          class="item"
          effect="light"
          content="按 ← 键切换到上一环节"
          placement="top-start"
        >
          <el-button
            icon="el-icon-arrow-right"
            circle
            @click="page = 2"
          ></el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import FreeDebate from "../../components/TimerComponents/FreeDebate.vue";
import TimerAudio from "../../components/TimerComponents/TimerAudio.vue";
import { mapState } from "vuex";
import { debounce } from "@/common/utils";
export default {
  components: { FreeDebate, TimerAudio },
  name: "Timer",
  data() {
    return {
      page: 1,
      timers: [
        {
          minutes: 17,
          seconds: 0,
          time: null,
          flag: true,
          secondsCom: "00",
        },
        {
          minutes: 17,
          seconds: 0,
          time: null,
          flag: true,
          secondsCom: "00",
        },
      ],
    };
  },
  computed: {
    ...mapState(["isShowHeader"]),
  },
  methods: {
    changeShowHeader: debounce(function () {
      this.$store.commit("changeShowHeader");
    }, 300),
    //设置定时器规则
    setTimer(n) {
      if (this.timers[n].seconds === 0 && this.timers[n].minutes !== 0) {
        this.timers[n].seconds = 59;
        this.timers[n].minutes -= 1;
      } else if (this.timers[n].minutes === 0 && this.timers[n].seconds === 0) {
        this.$refs.TimerAudio.playAudio(2);
        this.timers[n].seconds = 0;
        window.clearInterval(this.timers[n].time);
      } else {
        this.timers[n].seconds -= 1;
        if (this.timers[n].seconds === 30 && this.timers[n].minutes === 0) {
          this.$refs.TimerAudio.playAudio(3);
        }
        if (this.timers[n].seconds === 5 && this.timers[n].minutes === 0) {
          this.$refs.TimerAudio.playAudio(1);
        }
      }
      this.updateSeconds(n);
    },
    //增加定时器
    addTimer(n) {
      if (this.timers[n].flag) {
        var _this = this;
        _this.timers[n].flag = false;
        _this.timers[n].time = window.setInterval(function () {
          _this.setTimer(n);
        }, 1000);
      }
    },
    updateSeconds(n) {
      this.timers[n].secondsCom =
        this.timers[n].seconds < 10
          ? "0" + this.timers[n].seconds
          : this.timers[n].seconds;
    },
    stopTimer(n) {
      //暂停
      clearInterval(this.timers[n].time);
      this.timers[n].flag = true;
    },
    keyboardEvents(e) {
      var keyNum = window.event ? e.keyCode : e.which; //获取被按下的键值
      if (keyNum == 37) {
        if (this.page === 2) {
          this.page--;
        }
      } else if (keyNum == 39) {
        if (this.page === 1) {
          this.page++;
        }
      } else if (keyNum === 32) {
        if (this.page === 2) {
          this.$refs.FreeDebate.switchTimers();
        }
      }
    },
  },
  created() {
    const that = this;
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
  beforeDestroy() {
    window.clearInterval(this.timers[0].time);
    window.clearInterval(this.timers[1].time);
  },
  destroyed() {
    //移除监听按键
    const that = this;
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
}
.Inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.outside {
  width: 90%;
  display: inline-block;
}
.mandarin {
  font-family: "Helvetica Neue";
  font-size: 5rem;
  color: white;
}
.middle {
  display: inline-block;
  font-family: "Helvetica Neue";
  font-size: 5rem;
  color: white;
  margin: auto;
  width: 30%;
}
.time {
  font-family: "Helvetica Neue";
  font-size: 8em;
  color: rgb(255, 255, 255);
}
.timer {
  display: inline-block;
  margin: 0 auto;
  width: 35%;
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