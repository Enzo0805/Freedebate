<template>
  <div>
    <div class="Wrap">
      <el-descriptions title="账号信息" :column="1">
        <el-descriptions-item
          label="账号"
          :labelStyle="{ 'margin-top': '20px' }"
          :contentStyle="{ 'margin-top': '20px' }"
        >
          <span>{{ userInfo.account }}</span>
        </el-descriptions-item>
        <el-descriptions-item
          label="用户名"
          :labelStyle="{ 'margin-top': '15px' }"
          :contentStyle="{ 'margin-top': '15px' }"
        >
          <span v-show="userName && !isEdit[0].edit">{{ userName }}</span>
          <span v-show="!userName && !isEdit[0].edit">未填写</span>
          <span
            ><el-input
              style="width: 200px"
              v-model="userName"
              placeholder="请设置用户名"
              v-show="isEdit[0].edit"
              size="small"
            ></el-input
            ><el-button
              type="primary"
              v-show="isEdit[0].edit"
              size="small"
              style="margin-left: 10px"
              @click="updateUser(0)"
              >确认</el-button
            ><el-button
              type="danger"
              v-show="isEdit[0].edit"
              size="small"
              @click="isEdit[0].edit = false"
              >取消</el-button
            ></span
          >
          <el-button
            class="edit-button"
            type="text"
            size="medium"
            icon="el-icon-edit"
            v-show="!isEdit[0].edit"
            @click="isEdit[0].edit = true"
            >编辑</el-button
          ></el-descriptions-item
        >
        <el-descriptions-item
          label="用户类型"
          :labelStyle="{ 'margin-top': '20px' }"
          :contentStyle="{ 'margin-top': '20px' }"
          ><span v-if="userInfo.level <= 1">普通用户</span>
          <span v-if="userInfo.level === 2">管理员</span>
          <span v-if="userInfo.level === 3">超级管理员</span>
          <el-button
            class="edit-button"
            type="text"
            size="medium"
            icon="el-icon-s-custom"
            v-if="userInfo.level === 1"
            @click="handleApply()"
            >申请成为管理员</el-button
          >
        </el-descriptions-item>
        <el-descriptions-item
          label="电子邮箱"
          :labelStyle="{ 'margin-top': '15px' }"
          :contentStyle="{ 'margin-top': '15px' }"
          ><span v-show="!isEdit[1].edit">{{ userInfo.mailAddress }}</span>
          <span
            ><el-input
              style="width: 200px"
              v-model="userInfo.mailAddress"
              placeholder="请设置邮箱地址"
              v-show="isEdit[1].edit"
              size="small"
            ></el-input
            ><el-button
              type="primary"
              v-show="isEdit[1].edit"
              size="small"
              style="margin-left: 10px"
              @click="updateUser(1)"
              >确认</el-button
            ><el-button
              type="danger"
              v-show="isEdit[1].edit"
              size="small"
              @click="isEdit[1].edit = false"
              >取消</el-button
            ></span
          >
          <!-- <el-button
            type="text"
            size="medium"
            icon="el-icon-edit"
            class="edit-button"
            @click="isEdit[1].edit = true"
            v-show="!isEdit[1].edit"
            >编辑</el-button
          > -->
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="Wrap">
      <el-descriptions title="个人信息" :column="1">
        <el-descriptions-item
          label="学校"
          :labelStyle="{ 'margin-top': '15px' }"
          :contentStyle="{ 'margin-top': '15px' }"
          ><span v-show="schoolName && !isEdit[2].edit">{{ schoolName }}</span
          ><span v-show="!schoolName && !isEdit[2].edit">未填写</span>
          <span
            ><el-input
              style="width: 200px"
              v-model="schoolName"
              placeholder="请设置学校名称"
              v-show="isEdit[2].edit"
              size="small"
            ></el-input
            ><el-button
              type="primary"
              v-show="isEdit[2].edit"
              size="small"
              style="margin-left: 10px"
              @click="updateUser(2)"
              >确认</el-button
            ><el-button
              type="danger"
              v-show="isEdit[2].edit"
              size="small"
              @click="isEdit[2].edit = false"
              >取消</el-button
            ></span
          >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-edit"
            class="edit-button"
            v-show="!isEdit[2].edit"
            @click="isEdit[2].edit = true"
            >编辑</el-button
          ></el-descriptions-item
        >
        <el-descriptions-item
          label="入学年份"
          :labelStyle="{ 'margin-top': '15px' }"
          :contentStyle="{ 'margin-top': '15px' }"
          ><span v-show="grade && !isEdit[3].edit">{{ grade }}</span
          ><span v-show="!grade && !isEdit[3].edit">未填写</span>
          <span
            ><el-input
              style="width: 200px"
              v-model="grade"
              placeholder="请设置入学时间（只能为数字）"
              v-show="isEdit[3].edit"
              size="small"
            ></el-input
            ><el-button
              type="primary"
              v-show="isEdit[3].edit"
              size="small"
              style="margin-left: 10px"
              @click="updateUser(3)"
              >确认</el-button
            ><el-button
              type="danger"
              v-show="isEdit[3].edit"
              size="small"
              @click="isEdit[3].edit = false"
              >取消</el-button
            ></span
          >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-edit"
            class="edit-button"
            v-show="!isEdit[3].edit"
            @click="isEdit[3].edit = true"
            >编辑</el-button
          ></el-descriptions-item
        >
        <el-descriptions-item
          label="辩论队"
          :labelStyle="{ 'margin-top': '15px' }"
          :contentStyle="{ 'margin-top': '15px' }"
          ><span v-show="collegeName && !isEdit[4].edit">{{ collegeName }}</span
          ><span v-show="!collegeName && !isEdit[4].edit">未填写</span
          ><span
            ><el-input
              style="width: 200px"
              v-model="collegeName"
              placeholder="请设置所在辩论队"
              v-show="isEdit[4].edit"
              size="small"
            ></el-input
            ><el-button
              type="primary"
              v-show="isEdit[4].edit"
              size="small"
              style="margin-left: 10px"
              @click="updateUser(4)"
              >确认</el-button
            ><el-button
              type="danger"
              v-show="isEdit[4].edit"
              size="small"
              @click="isEdit[4].edit = false"
              >取消</el-button
            ></span
          >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-edit"
            class="edit-button"
            v-show="!isEdit[4].edit"
            @click="isEdit[4].edit = true"
            >编辑</el-button
          >
        </el-descriptions-item>
        <el-descriptions-item
          label="性别"
          :labelStyle="{ 'margin-top': '15px' }"
          :contentStyle="{ 'margin-top': '15px' }"
          ><span v-show="gender && !isEdit[5].edit">{{ gender }}</span
          ><span v-show="!gender && !isEdit[5].edit">未填写</span
          ><span
            ><el-radio-group
              v-model="gender"
              v-show="isEdit[5].edit"
              size="small"
              style="margin-left: 10px"
            >
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio> </el-radio-group
            ><el-button
              type="primary"
              v-show="isEdit[5].edit"
              size="small"
              style="margin-left: 20px"
              @click="updateUser(5)"
              >确认</el-button
            ><el-button
              type="danger"
              v-show="isEdit[5].edit"
              size="small"
              @click="isEdit[5].edit = false"
              >取消</el-button
            ></span
          >
          <el-button
            type="text"
            size="medium"
            icon="el-icon-edit"
            class="edit-button"
            v-show="!isEdit[5].edit"
            @click="isEdit[5].edit = true"
            >编辑</el-button
          ></el-descriptions-item
        >
      </el-descriptions>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import { updateUserInfo } from "../../request/api";
export default {
  name: "AccountInfo",
  data() {
    return {
      isEdit: [
        { edit: false },
        { edit: false },
        { edit: false },
        { edit: false },
        { edit: false },
        { edit: false },
      ],
      //为可修改的信息创建一个副本
      userName: "",
      schoolName: "",
      grade: 0,
      collegeName: "",
      gender: "男",
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    //为可修改的信息赋值
    setUserInfo() {
      this.userName = this.userInfo.userName;
      this.schoolName = this.userInfo.schoolName;
      this.grade = this.userInfo.grade;
      this.collegeName = this.userInfo.collegeName;
      this.gender = this.userInfo.gender;
    },
    updateUser(num) {
      this.grade = Number(this.grade);
      updateUserInfo(
        this.userName,
        this.userInfo.id,
        this.userInfo.account,
        this.userInfo.mailAddress,
        this.schoolName,
        this.collegeName,
        this.grade,
        this.gender
      )
        .then((response) => {
          // console.log(response);
          this.isEdit[num].edit = false;
          localStorage.setItem("userInfo", response.data.data);
          this.$store.commit("checkLogin");
        })
        .catch(function (error) {
          console.log("请求失败了");
          console.log(error.message);
        });
    },
    //点击申请成管理员的回调函数
    handleApply() {
      this.$confirm("确定要申请成为管理员吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.applyAdmin(this.userInfo.id, this.userInfo.level);
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
    applyAdmin(id, level) {
      axios
        .post("http://150.158.148.69:2233/applyAdmin", {
          id,
          level,
        })
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === "200") {
            this.$notify({
              title: "成功",
              message: "已申请",
              type: "success",
              offset: 90,
              duration: 2000,
            });
            this.getUserInfo();
            localStorage.setItem("userInfo", response.data.data);
          }
        })
        .catch(function (error) {
          console.log("请求失败了");
          this.$notify({
            title: "申请失败",
            message: error.message,
            type: "error",
            offset: 90,
            duration: 2000,
          });
        });
    },
  },
  mounted() {
    this.setUserInfo();
  },
};
</script>

<style scoped>
.Wrap {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  margin: 0 120px 10px 0;
  padding: 40px;
}
.edit-button {
  padding: 0;
  margin-left: 30px;
}
</style>