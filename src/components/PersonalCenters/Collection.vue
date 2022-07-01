<template>
  <div>
    <el-col :span="3" class="LeftTable"
      ><el-table
        :data="collection"
        style="width: 100%"
        height="650px"
        :border="true"
        @row-click="handleSelect"
        :header-cell-style="{
          paddingLeft: '15px',
        }"
        :cell-style="{ paddingLeft: '15px', paddingBottom: '5px' }"
      >
        <el-table-column prop="favorites">
          <template slot="header" slot-scope="{}">
            <el-button
              type="text"
              icon="el-icon-folder-add"
              @click="centerDialogVisible = true"
              >新建收藏夹</el-button
            >
            <el-dialog
              title="新建收藏夹"
              :visible.sync="centerDialogVisible"
              width="30%"
              center
            >
              <span>
                <el-form
                  :model="ruleForm"
                  status-icon
                  :rules="rules"
                  ref="ruleForm"
                  labelPosition="top"
                >
                  <el-form-item label="收藏夹名称" prop="name">
                    <el-input
                      type="text"
                      placeholder="请输入内容"
                      v-model="ruleForm.name"
                      maxlength="20"
                      show-word-limit
                      @keyup.enter.native="submitForm('ruleForm')"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item> </el-form-item>
                </el-form>
              </span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="submitForm('ruleForm')"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
          </template>
          <template slot-scope="scope">
            <el-row
              ><el-link :underline="false" icon="el-icon-folder">{{
                scope.row.favorites
              }}</el-link></el-row
            >
            <el-row style="text-align: right; font-size: 12px"
              ><i class="el-icon-document"></i>{{ scope.row.amount }}</el-row
            >
          </template>
        </el-table-column>
      </el-table></el-col
    >
    <el-col :span="21">
      <el-row class="info">
        <el-col :span="12"
          ><el-row style="font-size: 18px; margin-bottom: 15px">{{
            collectionName
          }}</el-row>
          <el-row style="font-size: 10px"
            >共{{ tableData.length }}个内容</el-row
          ></el-col
        >
        <el-col :span="12" style="text-align: right; padding: 25px 30px 30px 0">
          <el-row v-show="!batchOperation">
            <el-button
              type="text"
              @click="handleDelete()"
              icon="el-icon-folder-delete"
              >删除收藏夹</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button
              type="text"
              @click="changeBatch()"
              icon="el-icon-scissors"
              >批量操作</el-button
            >
          </el-row>
          <el-row v-show="batchOperation">
            <el-button type="text" icon="el-icon-star-on" @click="batchCancel()"
              >取消收藏</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button
              type="text"
              @click="changeBatch()"
              icon="el-icon-arrow-left"
              >返回</el-button
            >
          </el-row>
        </el-col>
      </el-row>
      <div style="margin-right: 120px">
        <el-table
          ref="multipleTable"
          :data="
            tableData.filter(
              (data) =>
                !search ||
                data.topic.toLowerCase().includes(search.toLowerCase())
            )
          "
          @selection-change="handleSelectionChange"
          :header-cell-style="{
            paddingLeft: '20px',
          }"
          :cell-style="{ paddingLeft: '20px' }"
          style="width: 100%"
          stripe
          height="550px"
        >
          <template slot="empty">
            <el-empty description="这里暂时还没有收藏..."></el-empty>
          </template>
          <el-table-column type="selection" v-if="batchOperation" width="55">
          </el-table-column>
          <el-table-column label="题目名称" width="420px" prop="topic">
          </el-table-column>
          <el-table-column
            label="题目类型"
            prop="category"
            width="130px"
            align="center"
            :filters="[
              { text: '政策辩', value: '政策' },
              { text: '事实辩', value: '事实' },
              { text: '价值辩', value: '价值' },
            ]"
            :filter-method="filterHandler"
          >
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="{}">
              <el-input
                v-model="search"
                prefix-icon="el-icon-search"
                placeholder="输入辩题关键字搜索"
              />
            </template>
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-link"
                @click="handleInfo(scope.row)"
                style="margin-right: 10px"
                >详细信息</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-popconfirm
                title="取消收藏后将不可恢复，是否继续？"
                @confirm="cancelCollection(scope.row.collection.collectionId)"
              >
                <el-button
                  icon="el-icon-star-on"
                  slot="reference"
                  type="text"
                  style="margin-left: 10px"
                  >取消收藏</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </div>
</template>

<script>
import axios from "axios";
import { debounce } from "@/common/utils";
export default {
  name: "Collection",
  data() {
    return {
      multipleSelection: [],
      batchOperation: false,
      collection: [],
      search: "",
      tableData: [],
      collectionName: "默认收藏夹",
      centerDialogVisible: false,
      ruleForm: {
        name: "",
      },
      rules: {
        name: [
          { required: true, message: "收藏夹名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  methods: {
    //切换批量操作状态
    changeBatch: debounce(function () {
      this.batchOperation = !this.batchOperation;
    }, 200),
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //切换不同收藏夹
    handleSelect(row) {
      this.collectionName = row.favorites;
      this.getByFavorites();
      this.batchOperation = false;
    },
    //根据收藏夹名称返回辩题
    getByFavorites() {
      axios
        .post("http://150.158.148.69:2233/getByFavorites", {
          userId: JSON.parse(localStorage.getItem("userInfo")).id,
          favorites: this.collectionName,
        })
        .then((response) => {
          // console.log(JSON.parse(response.data.data));
          this.tableData = JSON.parse(response.data.data);
        })
        .catch(function (error) {
          console.log("请求失败了");
          console.log(error.message);
        });
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleInfo(row) {
      // console.log(index, row); //检验index和row
      this.$router.push({ path: "/MoreInfo", query: { argumentID: row.id } });
    },
    //获取所有现有收藏夹
    getAllFavorites() {
      axios
        .post("http://150.158.148.69:2233/listFavorites", {
          userId: JSON.parse(localStorage.getItem("userInfo")).id,
        })
        .then((response) => {
          // console.log(response.data.data);
          this.collection = response.data.data;
        })
        .catch(function (error) {
          console.log("获得收藏夹的请求失败了");
          console.log(error.message);
        });
    },
    //新建文件夹的主函数
    addFavorites() {
      axios
        .post("http://150.158.148.69:2233/collect", {
          favorites: this.ruleForm.name,
          userId: JSON.parse(localStorage.getItem("userInfo")).id,
        })
        .then(() => {
          // console.log("新建收藏夹的请求成功了");
          this.$notify({
            title: "成功",
            message: "创建成功",
            type: "success",
            offset: 90,
            duration: 2000,
          });
          this.ruleForm.name = "";
          this.getAllFavorites();
        })
        .catch(function (error) {
          this.$notify({
            title: "创建失败",
            message: error.message,
            type: "error",
            offset: 90,
            duration: 2000,
          });
          console.log(error.message);
        });
    },
    //新建收藏夹的表单验证函数
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.centerDialogVisible = false;
          this.addFavorites();
        } else {
          this.$message.error("错了哦，这是一条错误消息");
          return false;
        }
      });
    },
    //点击删除收藏夹按钮的回调函数
    handleDelete() {
      if (this.collectionName === "默认收藏夹") {
        this.$message({
          message: "不可删除默认收藏夹",
          type: "warning",
        });
        return;
      }
      this.$confirm("确认要删除该收藏夹吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // console.log("删除收藏夹被调用了");
          this.deleteFavorites();
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
    //删除收藏夹的后端接口
    deleteFavorites() {
      axios
        .post("http://150.158.148.69:2233/deleteFavorites", {
          userId: JSON.parse(localStorage.getItem("userInfo")).id,
          favorites: this.collectionName,
        })
        .then((response) => {
          // console.log(response);
          if (response.data.code === "200") {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              offset: 90,
              duration: 2000,
            });
            this.collection = [];
            this.getAllFavorites();
            this.collectionName = "默认收藏夹";
            this.getByFavorites();
          } else {
            this.$notify({
              title: "删除失败",
              message: response.data.message,
              type: "error",
              offset: 90,
              duration: 2000,
            });
          }
        })
        .catch(function (error) {
          this.$notify({
            title: "删除失败",
            message: error.message,
            type: "error",
            offset: 90,
            duration: 2000,
          });
          console.log(error.message);
        });
    },
    //取消收藏
    cancelCollection(id) {
      console.log(id);
      axios
        .post("http://150.158.148.69:2233/deleteCollection", {
          collectionId: id,
        })
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === "200") {
            this.$notify({
              title: "成功",
              message: "取消成功",
              type: "success",
              offset: 100,
              duration: 2000,
            });
            this.getByFavorites();
          }
        })
        .catch(function (error) {
          this.$notify({
            title: "取消失败",
            message: error.message,
            type: "error",
            offset: 90,
            duration: 2000,
          });
        });
    },
    //批量取消收藏
    batchCancel() {
      this.$confirm(
        `您将永久删除${this.multipleSelection.length}条收藏, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.multipleSelection.forEach((item) => {
          this.cancelCollection(item.collection.collectionId);
        });
      });
    },
  },
  mounted() {
    this.getByFavorites();
    this.getAllFavorites();
  },
};
</script>

<style scoped>
.info {
  height: 98px;
  background-color: #fff;
  font: bolder;
  margin-right: 120px;
  text-align: left;
  padding: 0 0 0 30px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
}
</style>