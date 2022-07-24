<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">登录</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="param"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="account">
          <el-input v-model="param.email" placeholder="输入邮箱">
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" style="margin-top: 25px">
          <el-input
            type="password"
            placeholder="登录密码"
            v-model="param.password"
            @keyup.enter.native="submitForm()"
            show-password
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <span class="Register">
          <el-button type="text" style="float: left" @click="toOtherPages(1)"
            >立即注册</el-button
          >
          <el-button type="text" style="float: right" @click="toOtherPages(2)"
            >忘记密码</el-button
          >
        </span>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  data: function () {
    return {
      param: {
        email: "",
        password: "",
      },
      rules: {
        email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    toOtherPages(pages) {
      if (pages === 1) {
        this.$router.push("/Register");
      } else if (pages === 2) {
        this.$router.push("/EditPassword");
      }
    },
    submitForm() {
      const mailAddress = this.param.email;
      const password = String(this.param.password);
      this.$refs.param.validate((valid) => {
        if (valid) {
          this.Login(mailAddress, password);
        } else {
          this.$message.error("请输入账号和密码");
          console.log("error submit!!");
          return false;
        }
      });
    },
    Login(mailAddress, password) {
      axios
        .post("http://150.158.148.69:2233/login", {
          mailAddress,
          password,
        })
        .then((response) => {
          if (response.data.code === "200") {
            this.$notify({
              title: "成功",
              message: "登录成功",
              type: "success",
              offset: 90,
              duration: 2000,
            });
            let userInfo = JSON.parse(response.data.data);
            localStorage.setItem("userInfo", response.data.data);
            this.$store.commit("checkLogin");
            this.$bus.$emit("changeLevel", userInfo.level);
            this.$bus.$emit("checkLogin");
            this.$router.push("/");
          } else {
            this.$notify({
              title: "登录失败",
              message: response.data.message,
              type: "error",
              offset: 90,
              duration: 2000,
            });
          }
        })
        .catch(function (error) {
          this.$notify({
            title: "登录失败",
            message: error.message,
            type: "error",
            offset: 90,
            duration: 2000,
          });
        });
    },
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("../assets/image/bgp.jpg");
  background-size: cover;
}
.ms-login {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 450px;
  height: 335px;
  max-width: 90%;
  border-radius: 5px;
  background: white;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.ms-title {
  width: 100%;
  text-align: center;
  font-size: 22px;
  margin: 30px 0px 15px;
}
.ms-content {
  padding: 15px 30px;
}
.login-btn {
  margin-top: 8%;
}
.login-btn button {
  width: 100%;
  height: 36px;
  text-align: center;
  margin-bottom: 10px;
}
.Register {
  position: relative;
  margin-top: 5px;
  font-size: 14px;
}
</style>