<template>
  <div class="header-right">
    <div class="header-user-con">
      <span v-show="!isLogin">
        <span @click.native="handleRouter(1)">登录</span>
        <span style="margin: 0 10px">/</span>
        <span @click.native="handleRouter(2)">注册</span>
      </span>
      <el-dropdown v-show="isLogin" trigger="click" placement="bottom">
        <div class="user-avator">
          <img src="../../assets/image/user.png" v-show="!isLogin" />
          <img :src="userInfo.avatar" v-show="isLogin" />
          <i class="el-icon-caret-bottom el-dropdown-link"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleRouter(3)">
            <i class="el-icon-user-solid"></i> 个人中心
          </el-dropdown-item>
          <el-dropdown-item @click.native="handleRouter(4)">
            <i class="el-icon-edit"></i> 修改密码
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="exitLogin()">
            <i class="el-icon-unlock"></i> 退出登录
          </el-dropdown-item>
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
};
</script>

<style lang="scss" scoped>
.header-right {
  float: right;
  padding-right: 5%;
  color: ivory;

  .header-user-con {
    display: flex;
    height: 60px;
    align-items: center;
    justify-content: center;

    .dropdown-intro {
      margin: 0;
    }
    .user-avator {
      display: flex;
      align-items: center;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .el-dropdown-link {
        cursor: pointer;
        margin-left: 8px;
        color: ivory;
      }
    }
  }
}
</style>
