<template>
  <div class="login-wrap">
    <div class="ms-login">
      <el-steps :active="steps" finish-status="success" simple>
        <el-step title="验证身份"></el-step>
        <el-step title="修改密码"></el-step>
        <el-step title="改密成功"></el-step>
      </el-steps>
      <el-form
        :model="mail"
        :rules="mailRules"
        ref="mail"
        label-width="0px"
        class="ms-content"
        v-show="steps === 0"
      >
        <el-form-item prop="mailAddress">
          <el-input
            v-model="mail.mailAddress"
            placeholder="请输入账号绑定的邮箱"
          >
            <el-button slot="prepend" icon="el-icon-connection"></el-button>
            <el-button
              slot="append"
              @click="verifyMailAddress"
              :disabled="!canClick"
              >{{ content }}</el-button
            >
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="mail.code" placeholder="请在三分钟内输入验证码">
            <el-button slot="prepend" icon="el-icon-key"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="verifyIdentity">下一步</el-button>
        </div>
      </el-form>
      <el-form
        :model="param"
        :rules="rules"
        ref="param"
        label-width="0px"
        class="ms-content"
        v-show="steps === 1"
      >
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请设置新密码"
            v-model="param.password"
            show-password
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            type="password"
            placeholder="请重复密码"
            v-model="param.checkPass"
            @keyup.enter.native="submitForm('param')"
            show-password
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('param')"
            >确认修改</el-button
          >
        </div>
      </el-form>
      <div v-show="steps === 2" class="ms-content">
        <div style="font-size: 24px">修改密码成功，请重新登录</div>
        <el-button
          type="primary"
          size="medium"
          style="margin-top: 70px"
          @click="toLogin"
          >重新登录</el-button
        >
      </div>
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
  name: "EditPassWord",
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
      steps: 0,
      mail: {
        mailAddress: "",
        code: "",
      },
      mailRules: {
        email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
      },
      param: {
        password: "",
        checkPass: "",
      },
      rules: {
        password: [{ required: true, validator: pwdCheck, trigger: "blur" }],
        againPassword: [
          { required: true, validator: pwdAgainCheck, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //发送验证码的间隔为60s
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
    //验证账号绑定的邮箱
    verifyMailAddress() {
      if (!this.canClick) return;
      axios
        .post("http://150.158.148.69:2233/verifyMailAddress", {
          mailAddress: this.mail.mailAddress,
        })
        .then(() => {
          console.log("发送验证码的请求成功了");
          this.$notify({
            title: "成功",
            message: "已发送验证码到您的邮箱",
            type: "success",
            offset: 90,
            duration: 2000,
          });
          this.sendCode();
        })
        .catch(function (error) {
          console.log("请求失败了");
          console.log(error.message);
          this.$notify({
            title: "失败",
            message: "验证码发送失败",
            type: "error",
            offset: 90,
            duration: 2000,
          });
        });
    },
    //验证账号
    verifyIdentity() {
      axios
        .post("http://150.158.148.69:2233/verifyIdentity", {
          mailAddress: this.mail.mailAddress,
          code: this.mail.code,
        })
        .then(() => {
          console.log("验证账号的请求成功了");
          // console.log(response.data);
          this.$notify({
            title: "成功",
            message: "账号验证成功",
            type: "success",
            offset: 90,
            duration: 2000,
          });
          this.sendCode();
          this.steps = 1;
        })
        .catch(function (error) {
          console.log("请求失败了");
          console.log(error.message);
          this.$notify({
            title: "身份验证失败",
            message: error.message,
            type: "error",
            offset: 90,
            duration: 2000,
          });
        });
    },
    //提交修改密码的表单函数
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.resetPassword();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetPassword() {
      axios
        .post("http://150.158.148.69:2233/resetPassword", {
          mailAddress: this.mail.mailAddress,
          password: this.param.password,
        })
        .then((response) => {
          console.log("修改密码的请求成功了");
          console.log(response.data);
          this.$notify({
            title: "成功",
            message: "修改密码成功",
            type: "success",
            offset: 90,
            duration: 2000,
          });
          this.steps = 2;
        })
        .catch(function (error) {
          console.log("请求失败了");
          console.log(error.message);
          this.$notify({
            title: "失败",
            message: error.message,
            type: "error",
            offset: 90,
            duration: 2000,
          });
        });
    },
    toLogin() {
      this.$router.push("/Login");
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
  width: 500px;
  height: 360px;
  border-radius: 5px;
  background: white;
  overflow: hidden;
}
.el-steps {
  height: 30px;
  margin-bottom: 30px;
}
.ms-content {
  padding: 40px 50px;
}
.login-btn {
  margin-top: 30px;
}
.login-btn button {
  width: 100%;
  height: 36px;
  text-align: center;
  margin-bottom: 10px;
}
</style>