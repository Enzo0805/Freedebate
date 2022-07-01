<template>
  <div>
    <div v-show="!hasCommented" class="my-comments">
      <el-empty description="你还没有过评论..."></el-empty>
    </div>
    <div
      class="my-comments"
      v-show="hasCommented"
      v-for="(comment, index) in comments"
      :key="index"
    >
      <el-row type="flex" align="middle">
        <el-col :span="17">
          <h3 style="cursor: pointer" @click="handleInfo(comment.argument)">
            {{ comment.argument.topic }}
          </h3>
        </el-col>
        <el-col
          :span="5"
          style="margin-block-start: 1em; margin-block-end: 1em"
        >
          <el-rate
            disabled
            style="display: inline; margin-left: 30px"
            v-model="comment.score"
          ></el-rate>
        </el-col>
        <el-col
          :span="2"
          style="margin-block-start: 1em; margin-block-end: 1em"
          >{{ comment.createTime }}</el-col
        >
      </el-row>
      <el-row>
        <p style="cursor: pointer" @click="handleInfo(comment.argument)">
          {{ comment.content }}
        </p>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "MyComments",
  data() {
    return {
      comments: {},
      hasCommented: false,
    };
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem("userInfo")) || {};
    },
  },
  methods: {
    //获取当前用户的所有评论
    selectByUser() {
      axios
        .post("http://150.158.148.69:2233/selectByUser", {
          id: this.userInfo.id,
        })
        .then((res) => {
          // console.log(res.data.data);
          if (res.data.data.length) {
            this.hasCommented = true;
            this.comments = res.data.data;
          }
        })
        .catch(function (error) {
          console.log(error.message);
        });
    },
    handleInfo(argument) {
      this.$router.push({
        path: "/MoreInfo",
        query: { argumentID: argument.id },
      });
    },
  },
  mounted() {
    this.selectByUser();
  },
};
</script>

<style scoped>
.my-comments {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin: 0 120px 10px 0;
  font-size: 14px;
  text-align: left;
  padding: 10px 30px;
}
</style>