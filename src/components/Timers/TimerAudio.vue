<template>
  <div>
    <audio
      src="../../assets/audio/timeout.mp3"
      controls="controls"
      hidden
      ref="timeout"
    ></audio>
    <audio
      src="../../assets/audio/hint.mp3"
      controls="controls"
      hidden
      ref="hint"
    ></audio>
    <audio
      src="../../assets/audio/countdown.mp3"
      controls="controls"
      hidden
      ref="countdown"
    ></audio>
    <audio
      src="../../assets/audio/end.mp3"
      controls="controls"
      hidden
      ref="end"
    ></audio>
  </div>
</template>

<script>
export default {
  name: "TimerAudio",
  methods: {
    playAudio(type) {
      if (type === 1) {
        this.$refs.countdown.play();
      } else if (type === 2) {
        this.$refs.end.play();
      } else if (type === 3) {
        this.$refs.hint.play();
      } else if (type === 4) {
        this.$refs.timeout.play();
      }
    },
  },
};
</script>

<style>
</style>