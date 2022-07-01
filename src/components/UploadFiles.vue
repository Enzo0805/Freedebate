<template>
  <el-dialog
    title="上传资料"
    :visible.sync="DialogVisible"
    width="30%"
    center
    top="10vh"
  >
    <el-form label-position="top" :model="form" :rules="rules" ref="form">
      <el-form-item label="上传者姓名" prop="uploader">
        <el-input v-model="form.uploader"></el-input>
      </el-form-item>
      <el-form-item label="辩论队名" prop="teamName">
        <el-input v-model="form.teamName"></el-input>
      </el-form-item>
      <el-form-item label="文件">
        <el-upload
          class="upload"
          ref="upload"
          action=""
          :on-change="upload"
          :show-file-list="true"
          :auto-upload="false"
          :limit="1"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
            ref="uploadBtn"
            style="margin-right: 20px"
          >
            选择文件
          </el-button>
          <span slot="tip" class="el-upload__tip">
            <i class="el-icon-info"></i>只能上传一个文件</span
          >
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="DialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="uploadFiles('form')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from "axios";
export default {
  name: "UploadFiles",
  data() {
    return {
      argumentId: null,
      DialogVisible: false,
      form: {
        uploader: "",
        teamName: "",
      },
      multipartFile: "",
      rules: {
        uploader: [
          { required: true, message: "请输入上传者名称", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        teamName: [
          { required: true, message: "请输入队伍名称", trigger: "blur" },
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
    upload(file) {
      this.multipartFile = file.raw;
    },
    uploadFiles(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const formData = new FormData();
          formData.append("multipartFile", this.multipartFile);
          formData.append("id", this.argumentId);
          formData.append("uploader", this.form.uploader);
          formData.append("teamName", this.form.teamName);
          axios({
            method: "post",
            url: "http://150.158.148.69:2233/uploadFile",
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
            .then(() => {
              this.DialogVisible = false;
              this.form = {};
              this.$refs.upload.clearFiles();
              this.$notify({
                title: "成功",
                message: "资料上传成功",
                type: "success",
                offset: 90,
                duration: 2000,
              });
              
            })
            .catch((err) => {
              console.log(err);
              this.$notify({
                title: "失败",
                message: err.message,
                type: "error",
                offset: 90,
                duration: 2000,
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style>
</style>