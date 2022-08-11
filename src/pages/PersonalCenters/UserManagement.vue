<template>
  <div>
    <el-row class="info"
      ><el-col :span="12" class="left-info"
        ><el-row style="font-size: 18px; margin-bottom: 15px">用户管理</el-row>
        <el-row style="font-size: 10px"
          >共{{ tableData.length }}个用户</el-row
        ></el-col
      >
      <el-col :span="12" style="text-align: right; padding: 25px 30px 30px 0">
        <el-row
          ><el-button type="text" @click="selectLevel()"
            >查看管理员申请</el-button
          ><el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="getAllUser">查看全部</el-button>
        </el-row></el-col
      ></el-row
    >
    <el-row class="Wrap">
      <el-table
        :data="
          tableData.filter(
            (data) =>
              !search ||
              data.account.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
        height="540px"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="用户等级：">
                <el-input
                  v-model="props.row.level"
                  size="mini"
                  style="width: 100px; margin-right: 5px"
                ></el-input>
                <el-button
                  type="primary"
                  size="mini"
                  @click="editLevel(props.row)"
                  >保存</el-button
                >
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="userName"> </el-table-column>
        <el-table-column label="用户id" prop="id"> </el-table-column>

        <el-table-column label="用户邮箱" prop="mailAddress"> </el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="{}">
            <el-input
              v-model="search"
              size="small"
              placeholder="输入账号关键字搜索"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除用户</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "UserManagement",
  data() {
    return {
      tableData: [],
      search: "",
    };
  },
  methods: {
    getAllUser() {
      axios
        .get(`http://150.158.148.69:2233/getAllUser`)
        .then((response) => {
          // console.log(response.data.data);
          this.tableData = response.data.data;
        })
        .catch(function (error) {
          console.log(error.message);
        });
    },
    handleDelete(row) {
      console.log(row.id);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //在删除服务器端的数据后调用接口，删除数据
          axios
            .post("http://150.158.148.69:2233/deleteUser", {
              id: row.id,
            })
            .then((response) => {
              // console.log(response.data);
              if (response.data.code === "200") {
                this.$notify({
                  title: "成功",
                  message: "删除用户成功",
                  type: "success",
                  offset: 90,
                  duration: 2000,
                });
                this.getAllUser();
              }
            })
            .catch(function (error) {
              console.log("请求失败了");
              this.$notify({
                title: "添加失败",
                message: error.message,
                type: "error",
                offset: 90,
                duration: 2000,
              });
            });
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
    editLevel(row) {
      axios
        .post("http://150.158.148.69:2233/setAsAdmin", {
          id: row.id,
          level: row.level,
        })
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === "200") {
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              offset: 90,
              duration: 2000,
            });
            this.getAllUser();
          }
        })
        .catch(function (error) {
          console.log("请求失败了");
          this.$notify({
            title: "修改失败",
            message: error.message,
            type: "error",
            offset: 90,
            duration: 2000,
          });
        });
    },
    //查看管理员申请
    selectLevel() {
      this.tableData = this.tableData.filter((item) => item.level == 0);
    },
  },
  mounted() {
    this.getAllUser();
  },
};
</script>

<style scoped>
.Wrap {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin: 10px 120px 0 0;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 150px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 30px;
  margin-bottom: 0;
  width: 50%;
}
.info {
  height: 100px;
  margin-right: 120px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.left-info {
  text-align: left;
  padding: 20px 0 0 30px;
}
</style>