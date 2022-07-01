<template>
  <div class="Inner">
    <el-row>
      <el-col :span="12"
        ><el-breadcrumb
          separator-class="el-icon-arrow-right"
          style="padding-top: 12px"
        >
          <el-breadcrumb-item :to="{ path: '/BankManagement' }"
            >题库管理</el-breadcrumb-item
          >
          <el-breadcrumb-item :to="{ path: '/EditInfo' }"
            >编辑辩题</el-breadcrumb-item
          >
        </el-breadcrumb></el-col
      >
    </el-row>

    <el-descriptions direction="vertical" :column="5" border>
      <el-descriptions-item label="辩题名称" labelClassName="name">
        <el-input v-model="Info.topic" :disabled="!Info.isEdit"></el-input>
      </el-descriptions-item>
      <el-descriptions-item label="编辑类型" :span="2">
        <el-radio-group v-model="radio" :disabled="!Info.isEdit">
          <el-radio :label="3">政策</el-radio>
          <el-radio :label="6">事实</el-radio>
          <el-radio :label="9">价值</el-radio>
        </el-radio-group>
      </el-descriptions-item>
      <el-descriptions-item label="修改初始评分" :span="2">
        <el-rate
          v-model="value"
          show-score
          text-color="#ff9900"
          score-template="{value}"
          :disabled="!Info.isEdit"
        >
        </el-rate>
      </el-descriptions-item>
      <el-descriptions-item label="编辑题解" :span="2"
        ><el-input
          type="textarea"
          v-model="Info.topicInfo"
          :disabled="!Info.isEdit"
        ></el-input
      ></el-descriptions-item>
      <el-descriptions-item
        label=""
        :span="1"
        :contentStyle="{ 'text-align': 'center' }"
      >
        <el-button
          icon="el-icon-check"
          type="primary"
          size="small"
          @click.native="confirmEdit"
          v-show="Info.isEdit"
          >保存修改</el-button
        >
        <el-button
          size="small"
          type="danger"
          icon="el-icon-edit"
          @click="Info.isEdit = !Info.isEdit"
          v-show="!Info.isEdit"
          >编辑辩题</el-button
        >
      </el-descriptions-item>
    </el-descriptions>
    <el-table
      :data="tableData"
      border
      style="
        width: 100%;
        margin-top: 8px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      "
    >
      <el-table-column prop="year" label="年份" width="130">
        <template slot-scope="scope">
          <el-date-picker
            format="yyyy"
            value-format="yyyy"
            v-model="scope.row.year"
            type="year"
            :picker-options="pickerOptions"
            style="width: 100px"
            :disabled="!scope.row.isEdit"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="赛事" width="120">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.name"
            placeholder="请选择"
            filterable
            :disabled="!scope.row.isEdit"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="proponent" label="正方" width="180">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.proponent"
            :disabled="!scope.row.isEdit"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="opponent" label="反方" width="180">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.opponent"
            :disabled="!scope.row.isEdit"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="pscore" label="正方分数" width="100">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.pscore"
            :disabled="!scope.row.isEdit"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="oscore" label="反方分数" width="100">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.oscore"
            :disabled="!scope.row.isEdit"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="link" label="比赛视频链接">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.link"
            type="textarea"
            :disabled="!scope.row.isEdit"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="{}">
          <el-button type="primary" size="mini" @click="handleAdd()"
            >添加</el-button
          >
          <el-button type="primary" size="mini" @click="confirmAll(tableData)"
            >全部保存</el-button
          >
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="editContest(scope.row)"
            v-show="scope.row.isEdit"
            >保存</el-button
          >
          <el-button
            size="mini"
            v-show="!scope.row.isEdit"
            @click="changeEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click.native="deleteContest(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="fileList"
      style="
        width: 100%;
        margin-top: 8px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      "
    >
      <el-table-column prop="teamName" label="辩论队名" width="200px">
      </el-table-column>
      <el-table-column prop="uploader" label="上传者" width="200px">
      </el-table-column>
      <el-table-column prop="uploadDate" label="上传时间" width="200px">
      </el-table-column>
      <el-table-column prop="fileName" label="文件名"> </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="{}">
          <el-button
            type="primary"
            icon="el-icon-upload2"
            size="small"
            @click="uploadFile()"
            >上传新的资料</el-button
          >
          <upload-files ref="uploadFiles" />
        </template>
        <template slot-scope="scope">
          <el-button
            icon="el-icon-download"
            size="mini"
            style="margin-right: 5px"
            @click="downloadFiles(scope.row)"
            >下载</el-button
          >
          <el-popconfirm
            title="删除后将不可恢复，是否继续？"
            @confirm="deleteFile(scope.row)"
          >
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              slot="reference"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
import UploadFiles from "../components/UploadFiles.vue";
export default {
  components: { UploadFiles },
  name: "EditInfo",
  data() {
    return {
      fileList: [],
      contest: "",
      //日期选择器的限制条件
      pickerOptions: {
        //disabled为函数，返回值为布尔值，
        disabledDate: (time) => {
          let minYear = new Date().getFullYear() - 30;
          return (
            time > Date.now() ||
            time.getTime() < new Date(JSON.stringify(minYear))
          );
        },
      },
      //大赛名称
      options: [
        {
          value: "新国辩",
          label: "新国辩",
        },
        {
          value: "老友赛",
          label: "老友赛",
        },
        {
          value: "世界杯",
          label: "世界杯",
        },
        {
          value: "华夏杯",
          label: "华夏杯",
        },
        {
          value: "世锦赛",
          label: "世锦赛",
        },
        {
          value: "临潮杯",
          label: "临潮杯",
        },
        {
          value: "法辩",
          label: "法辩",
        },
        {
          value: "亚太赛",
          label: "亚太赛",
        },
        {
          value: "新国辩资格赛",
          label: "新国辩资格赛",
        },
        {
          value: "天伦杯",
          label: "天伦杯",
        },
        {
          value: "其它",
          label: "其它",
        },
      ],
      //value为评分值
      value: 5,
      //比赛的数据表
      tableData: [],
      //Info为辩题信息
      Info: "",
      //radio为单选框的值
      radio: 3,
    };
  },
  methods: {
    changeEdit(row) {
      row.isEdit = !row.isEdit;
      // console.log(row);
    },
    changeAllTopic() {
      axios
        .get(`http://150.158.148.69:2233/getAllTopic`)
        .then((response) => {
          let searchData = response.data.data;
          window.sessionStorage.setItem("tableData", searchData);
        })
        .catch(function (error) {
          console.log(error.message);
        });
    },
    //获得具体的辩题信息
    getArgumentById() {
      axios
        .post("http://150.158.148.69:2233/getArgumentById", {
          id: this.$route.query.argumentID,
        })
        .then((res) => {
          // console.log(res.data.data);
          this.Info = res.data.data;
          this.$set(this.Info, "isEdit", true);
          this.getContestInfo();
          this.getOriginalValue();
          this.getOriginalType();
        })
        .catch(function (error) {
          console.log("获得辩题信息的请求失败了", error.message);
        });
    },
    //获得初始评分
    getOriginalValue() {
      this.value = this.Info.recommendLevel;
    },
    //获得初始辩题类型
    getOriginalType() {
      if (this.Info.category === "政策") {
        this.radio = 3;
      } else if (this.Info.category === "事实") {
        this.radio = 6;
      } else {
        this.radio = 9;
      }
    },
    //获得辩题相关的比赛
    getContestInfo() {
      axios
        .post("http://150.158.148.69:2233/getByArgumentId", {
          argumentId: this.Info.id,
        })
        .then((response) => {
          // console.log("请求成功了");
          this.tableData = JSON.parse(response.data.data);
          this.tableData.forEach((item) => {
            this.$set(item, "isEdit", true);
            this.$set(item, "year", item.contestname.slice(0, 4));
            this.$set(item, "name", item.contestname.slice(4));
          });
          // console.log(this.tableData);
        })
        .catch(function (error) {
          console.log("请求失败了");
          console.log(error.message);
        });
    },
    //保存辩题改变
    confirmEdit() {
      if (this.radio == "3") {
        this.Info.category = "政策";
      } else if (this.radio == "6") {
        this.Info.category = "事实";
      } else if (this.radio == "9") {
        this.Info.category = "价值";
      }
      this.value = String(this.value);
      axios
        .post("http://150.158.148.69:2233/updateArgument", {
          id: this.Info.id,
          topic: this.Info.topic,
          topicInfo: this.Info.topicInfo,
          category: this.Info.category,
          recommendLevel: this.value,
        })
        .then((response) => {
          console.log("请求成功了");
          console.log(JSON.parse(response.data.data));
          window.sessionStorage.setItem("EditInfo", response.data.data);
          this.changeAllTopic();
        })
        .catch(function (error) {
          console.log("请求失败了");
          console.log(error.message);
        });
      this.Info.isEdit = !this.Info.isEdit;
      this.value = Number(this.value);
    },
    //对表格进行添加
    handleAdd() {
      let row = {
        year: "",
        name: "",
        proponent: "",
        opponent: "",
        pscore: "",
        oscore: "",
        link: "",
        isEdit: true,
      };
      this.tableData.push(row);
    },
    //编辑比赛信息
    editContest(row) {
      this.contest = row.year + row.name;
      if (!row.pscore) {
        row.pscore = "0";
      }
      if (!row.oscore) {
        row.oscore = "0";
      }
      row.pscore = String(row.pscore);
      row.oscore = String(row.oscore);
      if (!Object.prototype.hasOwnProperty.call(row, "contestid")) {
        axios
          .post("http://150.158.148.69:2233/addContest", {
            contestname: this.contest,
            proponent: row.proponent,
            opponent: row.opponent,
            pscore: row.pscore,
            oscore: row.oscore,
            link: row.link,
            argumentId: this.Info.id,
          })
          .then((response) => {
            console.log("添加比赛的请求成功了");
            row.isEdit = !row.isEdit;
            // console.log(JSON.parse(response.data.data).contestid);
            this.$set(
              row,
              "contestid",
              JSON.parse(response.data.data).contestid
            );
            // console.log(row);
          })
          .catch(function (error) {
            alert("比赛添加失败");
            console.log("添加比赛的请求失败了");
            console.log(error.message);
          });
      } else {
        axios
          .post("http://150.158.148.69:2233/updateContest", {
            contestname: this.contest,
            proponent: row.proponent,
            opponent: row.opponent,
            pscore: row.pscore,
            oscore: row.oscore,
            link: row.link,
            argumentId: this.Info.id,
            contestid: row.contestid,
          })
          .then(() => {
            console.log("编辑比赛的请求成功了");
            // console.log(JSON.parse(response.data.data));
            row.isEdit = !row.isEdit;
            console.log(row);
          })
          .catch(function (error) {
            console.log("编辑比赛的请求失败了");
            console.log(error.message);
          });
      }
    },
    //保存所有比赛信息
    confirmAll(data) {
      data.forEach((item) => {
        if (item.isEdit === true) {
          this.editContest(item);
        }
      });
    },
    //删除比赛信息
    deleteContest(index, row) {
      // console.log(index, tableData);
      this.$confirm("确定要删除这场比赛吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //在删除服务器端的数据后调用splice，删除数据
        if (row.contestid) {
          axios
            .post("http://150.158.148.69:2233/deleteContest", {
              contestid: row.contestid,
            })
            .then(() => {
              console.log("删除比赛的请求成功了");
              this.getByArgumentId();
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                offset: 100,
                duration: 2000,
              });
            })
            .catch(function (error) {
              console.log("删除比赛的请求失败了");
              console.log(error.message);
            });
        }
      });
    },
    uploadFile() {
      this.$refs.uploadFiles.DialogVisible = true;
      this.$refs.uploadFiles.argumentId = this.Info.id;
    },
    //获得当前辩题下所有上传的文件
    getFileById() {
      axios
        .post("http://150.158.148.69:2233/getFileById", {
          argumentId: this.$route.query.argumentID,
        })
        .then((response) => {
          this.fileList = response.data.data;
        })
        .catch(function (error) {
          console.log("获得平均分的请求失败了", error.message);
        });
    },
    //下载文件
    downloadFiles(row) {
      axios({
        method: "post",
        url: "http://150.158.148.69:2233/downloadFile",
        data: {
          filePath: row.filePath,
          fileName: row.fileName,
        },
        responseType: "Blob",
      })
        .then((res) => {
          console.log(res, row);
          this.download(row, res.data);
        })
        .catch(function (error) {
          console.log("下载文件", error.message);
        });
    },
    download(row, data) {
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(new Blob([data]));
      link.target = "_blank";
      //文件名和格式
      link.download = row.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    deleteFile(row) {
      console.log(row);
      axios({
        method: "post",
        url: "http://150.158.148.69:2233/deleteFileById",
        data: {
          fileId: row.fileId,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this, this.getFileById();
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              offset: 100,
              duration: 2000,
            });
          }
        })
        .catch(function (error) {
          console.log("删除文件", error.message);
        });
    },
  },
  mounted() {
    this.getArgumentById();
    this.getFileById();
  },
};
</script>

<style scoped>
.Inner {
  padding: 35px 170px;
}
.el-descriptions {
  margin-top: 30px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
</style>