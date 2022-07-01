<template>
  <div id="app">
    <el-container>
      <el-header v-show="isShowHeader">
        <my-header />
        <Avatar />
      </el-header>
      <el-main>
        <keep-alive
          :include="['Draw', 'Bank', 'BankManagement', 'PersonalCenter']"
        >
          <router-view />
        </keep-alive>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Avatar from "./components/Headers/Avatar.vue";
import MyHeader from "./components/Headers/MyHeader.vue";
import { mapState } from "vuex";
export default {
  name: "App",
  computed: {
    ...mapState(["isShowHeader"]),
  },
  components: {
    MyHeader,
    Avatar,
  },
};
</script>

<style>
.el-menu {
  border-bottom: none !important;
  float: left;
}
.el-menu--horizontal > .el-menu-item {
  font-size: 14px;
  width: 82px;
}
.el-header,
.el-footer {
  background-color: #365374;
  color: #333;
  text-align: center;
  line-height: 60px;
  padding: 0px;
}
.el-main {
  text-align: center;
  padding: 0px;
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.el-container {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}
</style>
