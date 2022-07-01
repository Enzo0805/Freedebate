<template>
  <div class="biantiku">
    <el-table
      :data="
        tableData
          .filter(
            (data) =>
              !search || data.topic.toLowerCase().includes(search.toLowerCase())
          )
          .slice((currentPage - 1) * pageSize, currentPage * pageSize)
      "
      style="width: 100%"
      stripe
      height="660.5px"
      :default-sort="{ prop: 'recommendLevel', order: 'descending' }"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="题解">
              <span>{{ props.row.topicInfo }}</span>
            </el-form-item>
            <el-form-item label="推荐等级">
              <span>{{ props.row.recommendLevel }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="题目ID" width="150px" prop="id">
      </el-table-column>
      <el-table-column label="题目名称" width="500px" prop="topic">
      </el-table-column>
      <el-table-column
        label="题目类型"
        prop="category"
        width="300px"
        :filters="[
          { text: '政策辩', value: '政策' },
          { text: '事实辩', value: '事实' },
          { text: '价值辩', value: '价值' },
        ]"
        :filter-method="filterHandler"
      >
      </el-table-column>
      <el-table-column align="left">
        <template slot="header" slot-scope="{}">
          <el-input
            v-model="search"
            prefix-icon="el-icon-search"
            placeholder="输入辩题关键字搜索"
          />
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="tableData.length"
      style="background-color: #fff"
    >
    </el-pagination>
  </div>
</template>


<script>
import axios from "axios";
export default {
  name: "BankManagement",
  data() {
    return {
      search: "",
      total: "",
      pageSize: 20,
      currentPage: 1,
      tableData: [],
      msg: "",
    };
  },
  methods: {
    //控制翻页的函数
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //编辑按钮的回调函数，跳转路由到编辑辩题页面
    handleEdit(row) {
      this.$router.push({ path: "/EditInfo", query: { argumentID: row.id } });
    },
    //删除按钮的回调函数
    handleDelete(row) {
      // console.log(index, row.id, tableData);
      this.$confirm("此操作将永久删除该辩题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //在删除服务器端的数据后调用接口，删除数据
          this.deleteArgument(row);
        })
        .catch(() => {
          this.$notify.info({
            title: "取消",
            message: "取消删除",
            offset: 100,
            duration: 1000,
          });
        });
    },
    deleteArgument(row) {
      axios
        .post("http://150.158.148.69:2233/deleteArgument", {
          id: row.id,
        })
        .then(() => {
          console.log("删除辩题的请求成功了");
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            offset: 100,
            duration: 2000,
          });
          this.getAllTopic();
        })
        .catch(function (error) {
          console.log("删除辩题的请求失败了");
          console.log(error.message);
        });
    },
    getAllTopic() {
      axios
        .get(`http://150.158.148.69:2233/getAllTopic`)
        .then((response) => {
          // console.log(JSON.parse(response.data.data));
          this.tableData = JSON.parse(response.data.data);
          let searchData = response.data.data;
          window.sessionStorage.setItem("tableData", searchData);
          this.tableData.forEach((item) => {
            item.value = item.topic;
          });
        })
        .catch(function (error) {
          console.log(error.message);
        });
    },
  },
  created() {
    this.tableData = JSON.parse(sessionStorage.getItem("tableData"));
  },
  beforeDestroy() {},
};
</script>

<style scoped>
.biantiku {
  height: 100%;
  position: relative;
}
.el-table {
  margin: 0 !important;
  padding: 0px !important;
  height: 95% !important;
}
.demo-table-expand {
  font-size: 0;
  margin-left: 58px;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 95%;
}
/* .has-gutter /deep/ {
  height: 50px;
} */
</style>