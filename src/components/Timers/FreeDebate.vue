<template>
  <div>
    <TimerAudio ref="TimerAudio" />
    <div class="timer">
      <div class="mandarin">正方</div>
      <div class="time">{{ timers[0].minutes }}:{{ timers[0].secondsCom }}</div>
    </div>
    <div class="middle">
      <el-row>vs</el-row>
      <el-row>自由辩论</el-row>
      <el-button-group>
        <el-tooltip
          class="item"
          effect="light"
          content="可使用A键切换计时器"
          placement="bottom"
        >
          <el-button type="primary" @click="switchTimers()">切换</el-button>
        </el-tooltip>
        <el-button type="danger" @click="stopTimer()">暂停</el-button>
      </el-button-group>
    </div>
    <div class="timer">
      <div class="mandarin">反方</div>
      <div class="time">{{ timers[1].minutes }}:{{ timers[1].secondsCom }}</div>
    </div>
  </div>
</template>

<script>
import TimerAudio from "../../components/Timers/TimerAudio.vue";
export default {
  name: "FreeDebate",
  components: { TimerAudio },
  data() {
    return {
      timers: [
        {
          minutes: 4,
          seconds: 0,
          time: null,
          flag: true,
          secondsCom: "00",
        },
        {
          minutes: 4,
          seconds: 0,
          time: null,
          flag: true,
          secondsCom: "00",
        },
      ],
    };
  },
  methods: {
    setTimer(n) {
      if (this.timers[n].seconds === 0 && this.timers[n].minutes !== 0) {
        this.timers[n].seconds = 59;
        this.timers[n].minutes -= 1;
      } else if (this.timers[n].minutes === 0 && this.timers[n].seconds === 0) {
        this.$refs.TimerAudio.playAudio(4);
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
    updateSeconds(n) {
      this.timers[n].secondsCom =
        this.timers[n].seconds < 10
          ? "0" + this.timers[n].seconds
          : this.timers[n].seconds;
    },
    //交换到另一个计时器
    switchTimers() {
      var _this = this;
      if (_this.timers[0].flag === true && _this.timers[1].flag === true) {
        _this.timers[0].flag = false;
        _this.timers[0].time = window.setInterval(function () {
          _this.setTimer(0);
        }, 1000);
      } else if (_this.timers[0].flag === false) {
        window.clearInterval(_this.timers[0].time);
        _this.timers[0].flag = true;
        _this.timers[1].flag = false;
        _this.timers[1].time = window.setInterval(function () {
          _this.setTimer(1);
        }, 1000);
      } else if (_this.timers[1].flag === false) {
        window.clearInterval(_this.timers[1].time);
        _this.timers[1].flag = true;
        _this.timers[0].flag = false;
        _this.timers[0].time = window.setInterval(function () {
          _this.setTimer(0);
        }, 1000);
      }
    },
    stopTimer() {
      //暂停
      if (this.timers[0].flag === false && this.timers[1].flag === true) {
        clearInterval(this.timers[0].time);
        this.timers[0].flag = true;
      } else if (
        this.timers[1].flag === false &&
        this.timers[0].flag === true
      ) {
        clearInterval(this.timers[1].time);
        this.timers[1].flag = true;
        this.timers[0].flag = false;
      }
    },
  },
  mounted() {},
  beforeDestroy() {
    window.clearInterval(this.timers[0].time);
    window.clearInterval(this.timers[1].time);
  },
};
</script>

<style scoped>
.mandarin {
  font-family: "Helvetica Neue";
  font-size: 5.5rem;
  color: white;
}
.middle {
  display: inline-block;
  width: 30%;
  font-family: "Helvetica Neue";
  font-size: 5rem;
  color: white;
}
.time {
  font-family: "Helvetica Neue";
  font-size: 8.5rem;
  color: rgb(255, 255, 255);
}
.timer {
  display: inline-block;
  width: 35%;
}
</style>
