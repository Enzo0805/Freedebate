<template>
  <div class="header-right">
    <div class="header-user-con">
      <!-- 用户头像，根据需要自行修改图片路径 -->
      <div class="user-avator">
        <img src="../../assets/image/user.png" v-show="!isLogin" />
        <img :src="userInfo.avatar" v-show="isLogin" />
      </div>
      <!-- 用户名下拉菜单 -->
      <span class="el-link user-name" v-show="!isLogin">
        <el-row @click.native="handleRouter(1)">登录</el-row>
        <el-row style="margin: 0 10px">/</el-row>
        <el-row @click.native="handleRouter(2)">注册</el-row>
      </span>
      <el-dropdown
        class="user-name"
        trigger="click"
        v-show="isLogin"
        placement="bottom"
      >
        <span class="el-dropdown-link">
          {{ userInfo.userName }}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleRouter(3)"
            >个人中心</el-dropdown-item
          >
          <el-dropdown-item @click.native="handleRouter(4)">
            修改密码</el-dropdown-item
          >
          <el-dropdown-item divided @click.native="exitLogin()">
            退出登录</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Avatar",
  data() {
    return {};
  },
  computed: {
    ...mapState(["isLogin", "userInfo"]),
  },
  watch: {},
  methods: {
    //处理路由转发事件
    handleRouter(key) {
      switch (key) {
        case 1:
          this.$router.push("/Login");
          break;
        case 2:
          this.$router.push("/Register");
          break;
        case 3:
          this.$router.push("/personalCenter");
          break;
        case 4:
          this.$router.push("/EditPassword");
          break;
        default:
          break;
      }
    },
    exitLogin() {
      this.$confirm("确认要退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          localStorage.removeItem("userInfo");
          this.checkLogin();
          this.$notify({
            title: "成功",
            message: "退出成功",
            type: "success",
            offset: 100,
            duration: 2000,
          });
          this.$router.push("/Login");
        })
        .catch((err) => {
          console.log(err);
          this.$notify.info({
            title: "取消",
            message: "取消退出",
            offset: 100,
            duration: 1000,
          });
        });
    },
    //获取用户的信息
    checkLogin() {
      this.$store.commit("checkLogin");
      //如果是登录态，就更新一下数据
      if (this.$store.state.isLogin) {
        this.$store.dispatch("getUserInfo");
      }
    },
  },
  mounted() {
    //在登录时，mounted被执行了，会自己更新userInfo
    this.checkLogin();
  },
  beforeDestroy() {},
};
</script>

<style scoped>
.header-right {
  float: right;
  padding-right: 2%;
}
.header-user-con {
  display: flex;
  height: 60px;
  align-items: center;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.user-name {
  width: 120px;
  color: ivory;
}
.el-dropdown-link {
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>