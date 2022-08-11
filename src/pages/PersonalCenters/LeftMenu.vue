<template>
  <div>
    <el-row class="info">
      <div class="user-avator">
        <img :src="userInfo.avatar" />
      </div>
      <el-button size="small" @click="dialogVisible = true">更改头像</el-button>
      <avatar-uploader
        :dialogVisible.sync="dialogVisible"
        @closeAvatarDialog="closeAvatarDialog"
      ></avatar-uploader>
    </el-row>
    <el-menu
      class="el-menu-vertical-demo"
      router
      :default-active="this.$route.path"
    >
      <el-menu-item index="/PersonalCenter/Collection">
        <i class="el-icon-star-on"></i>
        <span slot="title">我的收藏</span>
      </el-menu-item>
      <el-menu-item index="/PersonalCenter/MyComments">
        <i class="el-icon-s-comment"></i>
        <span slot="title">我的评论</span>
      </el-menu-item>
      <el-menu-item index="/PersonalCenter/AccountInfo">
        <i class="el-icon-s-custom"></i>
        <span slot="title">账号信息</span>
      </el-menu-item>
      <el-menu-item
        index="/PersonalCenter/UserManagement"
        v-show="this.userInfo.level === 3"
      >
        <i class="el-icon-s-management"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <!-- <el-menu-item index="/PersonalCenter/Feedback" disabled>
        <i class="el-icon-s-comment"></i>
        <span slot="title">意见反馈</span>
      </el-menu-item> -->
    </el-menu>
  </div>
</template>

<script>
import axios from "axios";
import AvatarUploader from "../AvatarUploader.vue";
import { mapState } from 'vuex';
export default {
  components: { AvatarUploader },
  name: "LeftMenu",
  data() {
    return {
      file: null,
      dialogVisible: false,
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    //获取头像文件的数据
    closeAvatarDialog(data) {
      this.uploadAvatar(data);
      this.dialogVisible = false;
    },
    uploadAvatar(avatar) {
      const formData = new FormData();
      const files = new File([avatar], "1.jpg", { type: avatar.type });
      formData.append("multipartFile", files);
      formData.append("id", this.userInfo.id);
      axios({
        method: "post",
        url: "http://150.158.148.69:2233/uploadAvatar",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          console.log(res);
          localStorage.setItem("userInfo", JSON.stringify(res.data.data));
          this.$store.commit("checkLogin");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
  },
  beforeDestroy() {},
};
</script>

<style scoped>
.info {
  margin: 0 10px 0 0;
  height: 150px;
  width: 190px;
  float: right;
  border-radius: 4px;
  background-color: #fff;
  font: bolder;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.user-avator img {
  margin: 20px auto 20px auto;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.el-menu-vertical-demo {
  width: 190px;
  margin: 10px 10px 0 0;
  float: right;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>