<template>
  <div class="timer">
    <TimerAudio ref="TimerAudio" />
    <div class="mandarin">{{ mymsg }}</div>
    <br />
    <div class="time">{{ timers[0].minutes }}:{{ timers[0].secondsCom }}</div>
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
</template>

<script>
import TimerAudio from "../../components/Timers/TimerAudio.vue";
export default {
  name: "SingleTimer",
  components: { TimerAudio },
  props: ["msg", "SumTime"],
  data() {
    return {
      mymsg: this.msg,
      page: 1,
      timers: [
        {
          minutes: this.SumTime,
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
    stopTimer() {
      //暂停
      clearInterval(this.timers[0].time);
      this.timers[0].flag = true;
    },
  },
  beforeDestroy() {
    window.clearInterval(this.timers[0].time);
  },
};
</script>

<style scoped>
.timer {
  display: inline-block;
  margin: 0 auto;
}
.mandarin {
  font-family: "Helvetica Neue";
  font-size: 5em;
  color: white;
}
.time {
  font-family: "Helvetica Neue";
  font-size: 10em;
  color: rgb(255, 255, 255);
}
</style>
