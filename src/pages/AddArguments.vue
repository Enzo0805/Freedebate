<template>
  <div class="Wrap">
    <section class="Form">
      <el-steps :active="steps" finish-status="success" simple>
        <el-step title="添加辩题信息"></el-step>
        <el-step title="添加相关比赛"></el-step>
      </el-steps>
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="ruleForm"
        label-width="80px"
        label-position="right"
        v-show="steps === 0"
      >
        <el-form-item label="辩题名称" prop="name">
          <el-input v-model="ruleForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="辩题类型" prop="type">
          <el-select
            v-model="ruleForm.type"
            placeholder="请选择辩题类型"
            style="width: 100%"
          >
            <el-option label="政策辩" value="政策"></el-option>
            <el-option label="事实辩" value="事实"></el-option>
            <el-option label="价值辩" value="价值"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐程度" prop="rate">
          <el-rate v-model="ruleForm.rate"></el-rate>
        </el-form-item>
        <el-form-item label="题解" prop="explain">
          <el-input
            type="textarea"
            :rows="3"
            v-model="ruleForm.explain"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即添加</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-row>
      </el-form>
      <el-row v-show="steps === 1" class="add-matchs">
        <el-button
          type="primary"
          @click="AddMatchs()"
          style="margin-right: 20px"
          >添加相关比赛</el-button
        >
        <el-button type="text" style="align-self: flex-end" @click="steps = 0"
          >继续添加辩题</el-button
        >
      </el-row>
    </section>
  </div>
</template>

<script>
import { addArgument } from "../request/api";
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
  name: "AddArguments",
  data() {
    const validateInput = (rule, value, callback) => {
      if (!checkSpecificKey(value)) {
        callback(new Error("禁止输入特殊字符"));
      } else {
        callback();
      }
    };
    return {
      msg: "",
      steps: 0,
      ruleForm: {
        name: "",
        type: "",
        rate: null,
        explain: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入辩题名称", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
          { validator: validateInput, trigger: ["blur", "change"] },
        ],
        type: [
          { required: true, message: "请选择辩题类型", trigger: "change" },
        ],
        explain: [
          {
            min: 0,
            max: 300,
            message: "长度在 0 到 300 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //提交表单并验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addArgument(formName);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addArgument(formName) {
      let rate = String(this.ruleForm.rate);
      addArgument({
        topic: this.ruleForm.name,
        category: this.ruleForm.type,
        recommendLevel: rate,
        topicInfo: this.ruleForm.explain,
      })
        .then((response) => {
          this.msg = JSON.parse(response.data.data);
          console.log(JSON.parse(response.data.data));
          this.$notify({
            title: "成功",
            message: "辩题添加成功",
            type: "success",
            offset: 90,
            duration: 2000,
          });
          this.resetForm(formName);
          this.steps++;
        })
        .catch(function (error) {
          console.log("请求失败了");
          console.log(error.message);
        });
    },
    resetForm(formName) {
      setTimeout(() => {
        this.$refs[formName].resetFields();
      }, 300);
    },
    AddMatchs() {
      this.$router.push({
        path: "/EditInfo",
        query: { argumentID: this.msg.id },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-rate {
  padding: 12px 0 0 10px;
  text-align: left;
}
.Wrap {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.Form {
  width: 35%;
  height: auto;
  border-radius: 5px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.el-steps {
  height: 30px;
}
.el-form {
  padding: 7% 8% 5% 7%;
}
.add-matchs {
  padding: 100px 0;
}
</style>