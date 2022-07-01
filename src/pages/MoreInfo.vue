<template>
  <div class="Inner">
    <el-row>
      <el-col :span="12"
        ><el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/Bank' }"
            >辩题库</el-breadcrumb-item
          >
          <el-breadcrumb-item :to="{ path: '/MoreInfo' }"
            >辩题信息</el-breadcrumb-item
          >
        </el-breadcrumb></el-col
      >
    </el-row>
    <el-row class="header">
      <el-col :span="24" class="left-info">
        <el-row
          type="flex"
          style="font-size: 20px; margin-bottom: 30px; align-items: center"
        >
          <el-col :span="16" style="margin-left: 15px">
            {{ topicInfo.topic }}
          </el-col>
          <el-col :span="8" class="right-info">
            <el-button
              type="text"
              icon="el-icon-star-off"
              style="margin-left: 20px"
              @click="AddToFavorites(topicInfo)"
              :disabled="!isLogin"
              >收藏辩题</el-button
            >
            <add-to-favorites ref="AddFavorites" />
            <el-divider direction="vertical"></el-divider>
            <el-button
              type="text"
              icon="el-icon-data-line"
              @click="jumpToRate()"
              :disabled="!isLogin"
              >给辩题评分</el-button
            >
          </el-col>
        </el-row>
        <el-row style="font-size: 14px; align-items: center" type="flex">
          <div style="display: inline">
            <el-row style="font-weight: bold; margin-bottom: 8px">
              <el-divider
                direction="vertical"
                style="padding-bottom: 8px"
              ></el-divider>
              <span>辩题类型</span>
            </el-row>
            <el-row style="padding-left: 16px"
              >{{ topicInfo.category }}辩</el-row
            >
          </div>
          <div style="display: inline; margin-left: 5%">
            <el-row style="font-weight: bold; margin-bottom: 8px"
              ><el-divider
                direction="vertical"
                style="padding-bottom: 5px"
              ></el-divider
              ><span>相关比赛</span> </el-row
            ><el-row style="padding-left: 16px"
              >{{ tableData.length }}场</el-row
            >
          </div>
          <div style="display: inline; margin-left: 5%">
            <el-row style="font-weight: bold; margin-bottom: 8px">
              <el-divider
                direction="vertical"
                style="padding-bottom: 5px; margin-right: 7px"
              ></el-divider>
              <span>收藏人数</span>
            </el-row>
            <el-row style="padding-left: 16px">{{ collectNum }}人</el-row>
          </div>
          <div style="margin-left: auto; margin-right: 45px">
            <el-rate
              v-model="value"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            >
            </el-rate>
          </div> </el-row
      ></el-col>
    </el-row>
    <el-descriptions
      direction="vertical"
      :column="6"
      border
      v-if="topicInfo.topicInfo"
    >
      <el-descriptions-item label="题解" :span="6">
        {{ topicInfo.topicInfo }}
      </el-descriptions-item>
    </el-descriptions>
    <el-table
      :data="tableData"
      border
      style="width: 100%; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
    >
      <el-table-column prop="contestname" label="赛事" width="230">
      </el-table-column>
      <el-table-column prop="proponent" label="正方" width="230">
      </el-table-column>
      <el-table-column prop="opponent" label="反方" width="230">
      </el-table-column>
      <el-table-column prop="score" label="比分" width="230"> </el-table-column>
      <el-table-column prop="link" label="比赛链接">
        <template slot-scope="scope">
          <el-link
            :href="scope.row.link"
            type="primary"
            :underline="false"
            target="_blank"
            >视频链接</el-link
          >
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-loading="Loading"
      :data="fileList"
      style="
        width: 100%;
        margin-top: 8px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      "
      empty-text="还没有人上传过文件..."
    >
      <el-table-column prop="teamName" label="辩论队名"> </el-table-column>
      <el-table-column prop="uploader" label="上传者"> </el-table-column>
      <el-table-column prop="uploadDate" label="上传时间"> </el-table-column>
      <el-table-column label="文件下载">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-download"
            type="text"
            @click="downloadFiles(scope.row)"
          >
            {{ scope.row.fileName }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 8px">
      <comments-area id="rate" />
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import AddToFavorites from "../components/AddToFavorites.vue";
import CommentsArea from "../components/CommentsArea.vue";
export default {
  components: { CommentsArea, AddToFavorites },
  name: "MoreInfo",
  data() {
    return {
      value: 5,
      topicInfo: "",
      tableData: [],
      ratingDialogVisible: false,
      rating: null,
      collectNum: 0,
      fileList: [],
      Loading: false,
    };
  },
  computed: {
    ...mapState(["isLogin"]),
  },
  methods: {
    //根据辩题id获取辩题相关信息
    getArgumentById() {
      axios
        .post("http://150.158.148.69:2233/getArgumentById", {
          id: this.$route.query.argumentID,
        })
        .then((res) => {
          // console.log(res.data.data);
          this.topicInfo = res.data.data;
          sessionStorage.setItem("msg", JSON.stringify(this.topicInfo));
          this.getContestInfo();
          this.$bus.$emit("getInfo", this.topicInfo);
        })
        .catch(function (error) {
          console.log("获得辩题信息的请求失败了", error.message);
        });
    },
    AddToFavorites(info) {
      this.$refs.AddFavorites.handleAdd(info);
    },
    countCollectors() {
      axios
        .post("http://150.158.148.69:2233/countCollectors", {
          argumentId: this.$route.query.argumentID,
        })
        .then((response) => {
          this.collectNum = response.data.data.collectNum;
        })
        .catch(function (error) {
          console.log("获得收藏人数的请求失败了", error.message);
        });
    },
    //把recommendLevel绑定到value上，获取平均分
    getAverageScore() {
      axios
        .post("http://150.158.148.69:2233/getAverage", {
          argumentId: this.$route.query.argumentID,
        })
        .then((response) => {
          // console.log(response.data);
          this.value = response.data.data.recommendLevel;
        })
        .catch(function (error) {
          console.log("获得平均分的请求失败了", error.message);
        });
    },
    //根据辩题id获取相应比赛信息
    getContestInfo() {
      axios
        .post("http://150.158.148.69:2233/getByArgumentId", {
          argumentId: this.topicInfo.id,
        })
        .then((response) => {
          // console.log(response);
          this.tableData = JSON.parse(response.data.data);
          for (let index = 0; index < this.tableData.length; index++) {
            if (
              this.tableData[index].pscore == "0" &&
              this.tableData[index].oscore == "0"
            ) {
              this.tableData[index].score = "无";
            } else {
              this.tableData[index].score =
                this.tableData[index].pscore +
                " : " +
                this.tableData[index].oscore;
            }
          }
        })
        .catch(function (error) {
          console.log("获得辩题相关比赛的请求失败了", error.message);
        });
    },
    //跳转到评论部分
    jumpToRate() {
      setTimeout(() => {
        document.getElementById("rate").scrollIntoView();
      }, 100);
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
      this.Loading = true;
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
          this.Loading = false;
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
  },
  mounted() {
    this.getArgumentById();
    this.getAverageScore();
    this.countCollectors();
    this.getFileById();
  },
};
</script>

<style scoped>
.Inner {
  padding: 35px 170px;
}
.el-descriptions {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
}
.header {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 30px 0 8px 0;
}
.left-info {
  text-align: left;
  padding: 20px 30px;
}
.right-info {
  text-align: right;
  padding-right: 15px;
}
.rating {
  text-align: left;
}
</style>