<template>
  <span>
    <el-dialog
      title="添加到收藏夹"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      top="20vh"
    >
      <el-table
        ref="multipleTable"
        :data="collection"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :show-header="false"
        max-height="280px"
        ><el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column>
          <template slot-scope="scope">{{ scope.row.favorites }}</template>
        </el-table-column></el-table
      >
      <span slot="footer">
        <el-row
          ><el-button
            icon="el-icon-plus"
            size="medium"
            style="width: 100%; text-align: left"
            v-show="!isNewFavorites"
            @click="isNewFavorites = true"
            >新建收藏夹</el-button
          >
          <el-tooltip
            effect="dark"
            content="点击弹窗内其他位置取消新建"
            placement="top"
            :hide-after="1000"
          >
            <el-input
              placeholder="最多输入20字"
              v-model="newFavorites"
              v-show="isNewFavorites"
              size="medium"
              maxlength="20"
              show-word-limit
              @blur="cancelAdd()"
            >
              <el-button
                type="primary"
                slot="append"
                @click="addFavorites"
                size="medium"
                >新建</el-button
              >
            </el-input>
          </el-tooltip>
          <el-divider></el-divider>
        </el-row>
        <el-button @click="centerDialogVisible = false" size="medium"
          >取 消</el-button
        >
        <el-button type="primary" @click="addCollection()" size="medium"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </span>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "AddToFavorites",
  data() {
    return {
      centerDialogVisible: false,
      //收藏夹名
      collection: [],
      //是否新建收藏夹
      isNewFavorites: false,
      //新建收藏夹名
      newFavorites: "",
      //设置多选
      multipleSelection: [],
      //要加入收藏夹的辩题信息
      addArugment: {},
    };
  },
  computed: {
    ...mapState(["isLogin"]),
  },
  methods: {
    handleAdd(row) {
      this.centerDialogVisible = true;
      this.addArugment = row;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //获取所有现有收藏夹
    getAllFavorites() {
      axios
        .post("http://150.158.148.69:2233/listFavorites", {
          userId: JSON.parse(localStorage.getItem("userInfo")).id,
        })
        .then((response) => {
          this.collection = response.data.data;
        })
        .catch(function (error) {
          console.log("获得收藏夹的请求失败了");
          console.log(error.message);
        });
    },
    //新建收藏夹
    addFavorites() {
      if (this.newFavorites.length === 0) {
        this.$message({
          message: "新建收藏夹不可为空",
          type: "warning",
        });
      } else {
        axios
          .post("http://150.158.148.69:2233/collect", {
            favorites: this.newFavorites,
            userId: JSON.parse(localStorage.getItem("userInfo")).id,
          })
          .then((response) => {
            if (response.data.code === "200") {
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                offset: 90,
                duration: 2000,
              });
              this.newFavorites = "";
              this.collection = [];
              this.getAllFavorites();
              this.isNewFavorites = false;
            }
          })
          .catch((error) => {
            this.$notify({
              title: "创建失败",
              message: error.message,
              type: "error",
              offset: 90,
              duration: 2000,
            });
            console.log(error.message);
          });
      }
    },
    //取消新建收藏夹
    cancelAdd() {
      setTimeout(() => {
        this.isNewFavorites = false;
        this.newFavorites = "";
      }, 200);
    },
    //收藏辩题
    addCollection() {
      for (let i = 0; i < this.multipleSelection.length; i++) {
        axios
          .post("http://150.158.148.69:2233/collect", {
            favorites: this.multipleSelection[i].favorites,
            userId: JSON.parse(localStorage.getItem("userInfo")).id,
            argumentId: this.addArugment.id,
          })
          .then((response) => {
            // console.log(response);
            if (response.data.code === "200") {
              this.$notify({
                title: "成功",
                message: "添加成功",
                type: "success",
                offset: 90,
                duration: 2000,
              });
              if (i === this.multipleSelection.length - 1) {
                this.centerDialogVisible = false;
                this.$refs.multipleTable.clearSelection();
              }
            } else {
              this.$notify({
                title: "添加失败",
                message: response.data.message,
                type: "error",
                offset: 90,
                duration: 2000,
              });
            }
          })
          .catch((error) => {
            this.$notify({
              title: "添加失败",
              message: error.message,
              type: "error",
              offset: 90,
              duration: 2000,
            });
            console.log(error.message);
          });
      }
    },
  },
  mounted() {
    if (this.isLogin === true) {
      this.getAllFavorites();
    }
  },
};
</script>

<style></style>
