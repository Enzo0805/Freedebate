<template>
  <div class="background">
    <div class="draw-title">
      <el-row class="Roll"> roll个辩题 </el-row>
      <el-row style="width: 20%; margin: auto">
        <el-divider></el-divider>
      </el-row>
      <el-row class="title" v-show="!isShow">你们打辩论的，都是 🕊</el-row>
      <el-tooltip
        class="item"
        effect="light"
        content="点击进入辩题详情页"
        placement="bottom"
      >
        <el-row class="title" v-show="isShow" @click.native="handleInfo()">{{
          msg.topic
        }}</el-row>
      </el-tooltip>
      <el-select v-model="type" placeholder="随便来一个" style="width: 200px">
        <el-option
          v-for="item in Topics"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
        </el-option>
      </el-select>
      <el-button
        type="primary"
        style="margin-left: 5px"
        round
        @click="RollArgument()"
      >
        ROLL
      </el-button>
    </div>
    <div style="align-self: flex-end">
      <el-link href="https://beian.miit.gov.cn/" target="_blank" type="primary"
        >蜀ICP备2021032583号</el-link
      >
    </div>
  </div>
</template>

<script>
import { getRandomArgument, getArgumentByCategory } from "../request/api";
export default {
  name: "Draw",
  data() {
    return {
      type: 1,
      Topic: "",
      msg: "",
      isShow: false,
      Topics: [
        {
          value: 1,
          label: "随便来一个",
        },
        {
          value: 2,
          label: "事实辩",
        },
        {
          value: 3,
          label: "价值辩",
        },
        {
          value: 4,
          label: "政策辩",
        },
      ],
    };
  },
  methods: {
    handleInfo() {
      this.$router.push({
        path: "/MoreInfo",
        query: { argumentID: this.msg.id },
      });
    },
    RollArgument() {
      if (this.type === 1) {
        getRandomArgument()
          .then((res) => {
            this.msg = JSON.parse(res.data.data);
            this.isShow = true;
          })
          .catch(function (error) {
            console.log(error.message);
          });
      } else {
        switch (this.type) {
          case 2:
            this.Topic = "事实";
            break;
          case 3:
            this.Topic = "价值";
            break;
          case 4:
            this.Topic = "政策";
            break;
          default:
            break;
        }
        getArgumentByCategory({
          category: this.Topic,
        })
          .then((response) => {
            this.msg = JSON.parse(response.data.data);
            this.isShow = true;
          })
          .catch(function (error) {
            console.log("请求失败了");
            console.log(error.message);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.background {
  background: url(../assets/image/bgp.jpg);
  background-size: cover;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: row wrap;

  .draw-title {
    color: ivory;
    width: 100%;
    margin-top: auto;
  }
  .title {
    font-size: 2.5em;
    margin: 55px 0 79px;
    cursor: pointer;
  }
  .Roll {
    font-size: 4em;
    font-family: "Times New Roman", Times, serif;
    margin: auto;
  }
}
</style>
