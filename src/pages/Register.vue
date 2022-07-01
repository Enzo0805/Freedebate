<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">注册</div>
      <el-form :model="param" :rules="rules" ref="param" class="ms-content">
        <el-form-item prop="userName">
          <el-input v-model="param.userName" placeholder="请设置用户名">
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" style="margin-top: 25px">
          <el-input
            type="password"
            placeholder="请设置密码"
            v-model="param.password"
            show-password
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="againPassword" style="margin-top: 25px">
          <el-input
            type="password"
            placeholder="请再次输入密码"
            v-model="param.againPassword"
            @keyup.enter.native="submitForm()"
            show-password
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="param.email" placeholder="请输入邮箱">
            <el-button
              slot="prepend"
              icon="el-icon-connection
"
            ></el-button>
            <el-button slot="append" @click="sendEmail" :disabled="!canClick">{{
              content
            }}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="param.code" placeholder="请输入验证码">
            <el-button
              slot="prepend"
              icon="el-icon-key
"
            ></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('param')"
            >注册</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export function checkSpecificKey(str) {
  var specialKey =
    "[`~!#$^&*()=|{}':;',\\[\\].<>?~！#￥……&*（）——|{}【】‘；：'。、？]‘'";
  for (var i = 0; i < str.length; i++) {
    if (specialKey.indexOf(str.substr(i, 1)) != -1) {
      return false;
    }
  }
  return true;
}
export default {
  name: "Register",
  data: function () {
    const pwdCheck = async (rule, value, callback) => {
      if (value.length < 6) {
        return callback(new Error("密码不能少于6位！"));
      } else if (value.length > 16) {
        return callback(new Error("密码最长不能超过16位！"));
      } else if (!checkSpecificKey(value)) {
        return callback(new Error("密码输入有误，请检查格式是否正确！"));
      } else {
        callback();
      }
    };
    // 重复密码验证
    const pwdAgainCheck = async (rule, value, callback) => {
      if (value.length < 1) {
        return callback(new Error("重复密码不能为空！"));
      } else if (this.param.password != this.param.againPassword) {
        return callback(new Error("两次输入密码不一致！"));
      } else {
        callback();
      }
    };
    return {
      content: "发送验证码",
      canClick: true,
      totalTime: "60",
      param: {
        email: "",
        password: "",
        userName: "",
        code: "",
        againPassword: "",
      },
      rules: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
        password: [{ required: true, validator: pwdCheck, trigger: "blur" }],
        againPassword: [
          { required: true, validator: pwdAgainCheck, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    sendCode() {
      this.canClick = false;
      this.content = this.totalTime + "s后重新发送";
      let clock = window.setInterval(() => {
        this.totalTime--;
        this.content = this.totalTime + "s后重新发送";
        if (this.totalTime < 0) {
          window.clearInterval(clock);
          this.content = "重新发送验证码";
          this.totalTime = 60;
          this.canClick = true; //这里重新开启
        }
      }, 1000);
    },
    sendEmail() {
      if (!this.canClick) return;
      this.canClick = false;
      axios
        .post("http://150.158.148.69:2233/sendEmail", {
          mailAddress: this.param.email,
        })
        .then((response) => {
          // console.log(response.data.data);
          if (response.data.code === "200") {
            this.$notify({
              title: "成功",
              message: "已发送验证码到您的邮箱",
              type: "success",
              offset: 90,
              duration: 2000,
            });
            this.sendCode();
          } else {
            // console.log(response.data.data);
            this.canClick = true;
            this.$notify({
              title: "失败",
              message: response.data.data,
              type: "error",
              offset: 90,
              duration: 2000,
            });
          }
        })
        .catch(function (error) {
          // console.log(error.message);
          this.$notify({
            title: "失败",
            message: error.message,
            type: "error",
            offset: 90,
            duration: 2000,
          });
          this.canClick = true;
        });
    },
    //注册的表单验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    register() {
      axios
        .post("http://150.158.148.69:2233/register", {
          mailAddress: this.param.email,
          userName: this.param.userName,
          password: this.param.password,
          code: this.param.code,
        })
        .then((response) => {
          console.log("注册的请求成功了");
          if (response.data.code == 200) {
            this.$notify({
              title: "成功",
              message: "注册成功",
              type: "success",
              offset: 90,
              duration: 2000,
            });
            this.$router.push("/");
          } else {
            this.$notify({
              title: "失败",
              message: response.data.message,
              type: "error",
              offset: 90,
              duration: 2000,
            });
          }
        })
        .catch(function (error) {
          console.log("请求失败了");
          console.log(error.message);
          this.$notify({
            title: "失败",
            message: "注册失败",
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
  height: 500px;
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
  margin-top: 10%;
}
.login-btn button {
  width: 100%;
  height: 36px;
  text-align: center;
  margin-bottom: 10px;
}
</style>