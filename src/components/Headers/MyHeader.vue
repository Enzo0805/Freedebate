<template>
  <div>
    <div class="logo">
      <img height="40px" src="../../assets/image/header.jpg" />
    </div>
    <el-menu
      :default-active="this.$route.path"
      router
      class="el-menu-demo"
      mode="horizontal"
      text-color="#fff"
      background-color="#365374"
      active-text-color="#fff"
    >
      <el-menu-item index="/Draw">抽题</el-menu-item>
      <el-submenu index="2">
        <template slot="title">计时器</template>
        <el-menu-item index="/Xinguobian">新国辩</el-menu-item>
        <el-menu-item index="/Fengzhan">凤展</el-menu-item>
      </el-submenu>
      <el-menu-item index="/Bank">辩题库</el-menu-item>
      <el-submenu index="4" v-show="isAdmin">
        <template slot="title">管理题库</template>
        <el-menu-item index="/BankManagement">编辑题库</el-menu-item>
        <el-menu-item index="/AddArguments">添加辩题</el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="Input">
      <el-autocomplete
        class="inline-input"
        v-model="search"
        :fetch-suggestions="querySearch"
        placeholder="输入辩题关键字搜索"
        :trigger-on-focus="false"
        @select="handleSelect"
        prefix-icon="el-icon-search"
      ></el-autocomplete>
    </div>
  </div>
</template>

<script>
import { getAllTopic } from "../../request/api";
import { mapState } from "vuex";
export default {
  name: "MyHeader",
  data() {
    return {
      activeIndex: "1",
      search: "",
      tableData: [],
      msg: "",
      isLevel: 0,
    };
  },
  computed: {
    ...mapState(["isAdmin"]),
  },
  methods: {
    querySearch(queryString, cb) {
      var tableData = this.tableData;
      var results = queryString
        ? tableData.filter(this.createFilter(queryString))
        : tableData;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (searchData) => {
        return (
          searchData.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        );
      };
    },
    getAllArgument() {
      getAllTopic()
        .then((response) => {
          // console.log(JSON.parse(response.data.data));
          this.tableData = JSON.parse(response.data.data);
          window.sessionStorage.setItem("tableData", response.data.data);
          this.tableData.forEach((item) => {
            item.value = item.topic;
          });
        })
        .catch(function (error) {
          console.log(error.message);
        });
    },
    handleSelect(item) {
      // console.log(item);
      this.$router.push({ path: "/MoreInfo", query: { argumentID: item.id } });
      this.search = "";
    },
    //获得用户的信息
    getUserInfo() {
      this.$store.commit("checkLogin");
    },
  },
  mounted() {
    this.getUserInfo();
    this.getAllArgument();
  },
  beforeDestroy() {},
};
</script>

<style scoped>
.logo {
  float: left;
  margin: 0;
  width: 15%;
  padding-top: 10px;
}
.el-menu-menu {
  background-color: #f7f1f1;
  border-bottom: none !important;
  float: left;
}
.inline-input {
  margin-left: 5%;
  float: left;
  display: flex;
  width: 20%;
}
</style>