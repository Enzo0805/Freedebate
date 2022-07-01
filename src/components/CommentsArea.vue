<template>
  <div>
    <el-row class="wrap" id="rate">
      <el-row class="headline">
        <h3 style="display: inline">我的短评</h3>
        <el-divider></el-divider>
      </el-row>
      <el-row :gutter="60" style="padding-bottom: 20px; font-size: 14px">
        <el-col :span="1" style="text-align: left">
          <div class="user-avator">
            <img src="../assets/image/user.png" v-show="!isLogin" />
            <img :src="userInfo.avatar" v-show="isLogin" />
          </div>
        </el-col>
        <el-col :span="22" class="comment-form">
          <span style="font-weight: 600" v-show="isCommenting || !hasCommented"
            >请为这道辩题打分：</span
          >
          <span style="font-weight: 600" v-show="hasCommented && !isCommenting"
            >你的评分是：</span
          >
          <el-rate
            :disabled="!isCommenting"
            style="display: inline"
            v-model="commentForm.score"
          ></el-rate>
          <div v-show="isCommenting || !hasCommented">
            <el-input
              style="padding-top: 15px"
              type="textarea"
              :rows="3"
              maxlength="300"
              show-word-limit
              :disabled="!isLogin"
              v-model="commentForm.content"
              @click.native="
                isLogin ? (isCommenting = true) : (isCommenting = false)
              "
            ></el-input>
            <el-button
              type="primary"
              size="mini"
              v-show="isCommenting"
              style="margin-top: 10px"
              @click="handleComment"
              >评论</el-button
            >
            <el-button
              type="danger"
              size="mini"
              v-show="isCommenting && hasCommented"
              style="margin-top: 10px"
              @click="CancelEditing"
              >取消编辑</el-button
            >
          </div>
          <div v-show="hasCommented && !isCommenting">
            <p style="padding-top: 9px">{{ commentForm.content }}</p>
            <el-button type="text" size="small" @click="isCommenting = true"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="deleteComment"
              >删除</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-row>
    <el-row class="wrap">
      <el-row class="headline">
        <h3 style="display: inline">评论</h3>
        <span style="margin-left: 1%; font-size: 13px">{{ commentNum }}</span>
        <el-divider></el-divider>
      </el-row>
      <el-empty
        description="这里暂时还没有评论..."
        v-show="!commentTexts.length"
      ></el-empty>
      <section
        v-show="commentTexts.length"
        v-for="(commentText, index) in commentTexts"
        :key="index"
        style="margin-bottom: 30px"
      >
        <el-row class="user-info">
          <el-col :span="1" style="text-align: left">
            <div class="user-avator">
              <img
                src="../assets/image/user.png"
                v-show="!commentText.fromAvatar"
              />
              <img
                :src="commentText.fromAvatar"
                v-show="commentText.fromAvatar"
              />
            </div>
          </el-col>
          <el-col :span="22" style="text-align: left; margin-left: 25px">
            <span style="margin-right: 30px; font-weight: 600">{{
              commentText.fromName
            }}</span>
            <el-rate
              style="display: inline"
              v-model="commentText.score"
              disabled
            ></el-rate>
            <span style="float: right">{{ commentText.createTime }}</span>
          </el-col>
        </el-row>
        <p class="comment-text">
          {{ commentText.content }}
        </p>
        <el-row style="text-align: left; margin-bottom: 10px">
          <el-button
            type="text"
            size="small"
            class="el-icon-dianzan"
            style="margin-right: 1%"
            :disabled="!isLogin"
            @click.once="likeComment(commentText.commentId, index)"
            >{{ commentText.likeNum }}</el-button
          >
          <el-button
            type="text"
            size="small"
            :disabled="!isLogin"
            @click="
              changeReply(
                commentText.commentId,
                commentText.fromId,
                commentText.fromName,
                0,
                index
              )
            "
            >回复</el-button
          >
        </el-row>
        <el-row
          class="reply-info"
          v-for="(reply, i) in commentText.replies"
          :key="i"
        >
          <el-col :span="1" style="text-align: left; margin: 6px 0 0 15px">
            <div class="user-avator">
              <img
                src="../assets/image/user.png"
                style="height: 30px; width: 30px"
                v-show="!reply.fromAvatar"
              />
              <img
                :src="reply.fromAvatar"
                style="height: 30px; width: 30px"
                v-show="reply.fromAvatar"
              />
            </div>
          </el-col>
          <el-col :span="22" style="margin-top: 5px">
            <el-row>
              <span style="margin-right: 5px">@{{ reply.fromName }}：回复</span>
              <span style="margin-right: 5px">@{{ reply.toName }}</span>
              <span>{{ reply.content }}</span>
            </el-row>
            <el-row style="text-align: left">
              <span style="margin-right: 2%">{{ reply.createTime }}</span>
              <el-button
                type="text"
                size="small"
                class="el-icon-dianzan"
                style="margin-right: 1%"
                :disabled="!isLogin"
                @click.once="likeReply(reply.rid, index, i)"
                >{{ reply.likeNum }}</el-button
              >
              <el-button
                type="text"
                size="small"
                style="margin-right: 2%"
                :disabled="!isLogin"
                @click="
                  changeReply(
                    reply.commentId,
                    reply.fromId,
                    reply.fromName,
                    reply.rid,
                    index
                  )
                "
                >回复</el-button
              >
              <el-popconfirm
                title="删除后将不可恢复，是否继续？"
                @confirm="deleteReply(reply.rid)"
              >
                <el-button
                  size="small"
                  type="text"
                  slot="reference"
                  v-show="reply.canDelete"
                  >删除</el-button
                >
              </el-popconfirm>
            </el-row>
          </el-col>
        </el-row>
        <el-row
          :gutter="40"
          style="font-size: 14px"
          v-show="replyNum === index"
        >
          <el-col :span="1" style="text-align: left">
            <div class="user-avator" style="padding-top: 15px">
              <img :src="userInfo.avatar" />
            </div>
          </el-col>
          <el-col :span="22" class="comment-form">
            <div>
              <el-input
                style="padding-top: 15px"
                type="textarea"
                :placeholder="replyForm.holder"
                :rows="2"
                maxlength="100"
                show-word-limit
                v-model="replyForm.content"
              ></el-input>
              <el-button
                type="primary"
                size="mini"
                style="margin-top: 10px"
                @click="addReply()"
                >评论</el-button
              >
            </div>
          </el-col>
        </el-row>
      </section>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "CommentsArea",
  data() {
    return {
      visible: false,
      commentNum: 0,
      commentForm: {
        score: 0,
        content: "",
        createTime: "",
      },
      replyForm: {
        toId: 0,
        toName: "",
        holder: "",
        content: "",
        commentId: 0,
        rid: 0,
      },
      isCommenting: false,
      hasCommented: false,
      commentTexts: [],
      replyInfos: [
        {
          name: "Enzo",
          host: "dyc大鸽子",
          date: "12-23",
          likes: 7,
          text: "脱稿和不脱稿都不会加分也不会减分，如果评委看拖不拖稿来增减印象票的分数那就不是专业竞技辩论了，你写了这么一大堆，连基本的大前提都没搞明白，还不让人回复，真是人类迷惑行为大赏行为了",
        },
        {
          name: "kk",
          host: "1111",
          date: "12-23",
          likes: 7,
          text: "测试测试测试测试测试",
        },
      ],
      replyNum: -1,
    };
  },
  computed: {
    ...mapState(["isLogin", "userInfo"]),
  },
  methods: {
    CancelEditing() {
      setTimeout(() => {
        this.isDuplicate();
        this.isCommenting = false;
      }, 150);
    },
    handleComment() {
      if (this.commentForm.score == 0) {
        this.$message("请为辩题打个分哦");
        return;
      }
      if (
        this.commentForm.content.trim() <= 5 ||
        this.commentForm.content.trim() >= 300
      ) {
        this.$message("评论需在5到300字之间");
        return;
      }
      if (!this.hasCommented) {
        this.addComment();
      } else {
        this.updateComment();
      }
    },
    addComment() {
      axios
        .post("http://150.158.148.69:2233/addComment", {
          argumentId: this.topicInfo.id,
          fromId: this.userInfo.id,
          fromName: this.userInfo.userName,
          fromAvatar: this.userInfo.avatar,
          likeNum: 0,
          content: this.commentForm.content,
          score: String(this.commentForm.score),
        })
        .then((response) => {
          // console.log(response.data.data);
          this.commentForm = response.data.data;
          this.isCommenting = false;
          this.hasCommented = true;
          this.getAllComments();
          this.$notify({
            title: "成功",
            message: "评论成功",
            type: "success",
            offset: 90,
            duration: 2000,
          });
        })
        .catch(function (error) {
          console.log("请求失败了");
          console.log(error.message);
        });
    },
    updateComment() {
      axios
        .post("http://150.158.148.69:2233/updateComment", {
          commentId: this.commentForm.commentId,
          argumentId: this.commentForm.argumentId,
          fromId: this.commentForm.fromId,
          fromName: this.commentForm.fromName,
          fromAvatar: this.userInfo.avatar,
          likeNum: this.commentForm.likeNum,
          content: this.commentForm.content,
          score: String(this.commentForm.score),
          createTime: this.commentForm.createTime,
        })
        .then(() => {
          // console.log("修改评论被调用了", response.data.data);
          this.isCommenting = false;
          this.$notify({
            title: "成功",
            message: "修改评论成功",
            type: "success",
            offset: 90,
            duration: 2000,
          });
          this.getAllComments();
        })
        .catch(function (error) {
          console.log("请求失败了");
          console.log(error.message);
        });
    },
    getInfo(Info) {
      this.topicInfo = Info;
      if (this.isLogin) {
        this.isDuplicate();
      }
      this.getCommentNum();
      this.getAllComments();
    },
    //判断该用户是否评论过此辩题
    isDuplicate() {
      axios
        .post("http://150.158.148.69:2233/isDuplicate", {
          argumentId: this.topicInfo.id,
          id: this.userInfo.id,
        })
        .then((response) => {
          // console.log(response);
          if (response.data.code === "500") {
            this.hasCommented = true;
            this.commentForm = response.data.data;
            // console.log(this.commentForm);
          } else {
            this.hasCommented = false;
          }
        })
        .catch(function (error) {
          console.log("获取重复评论的请求失败了");
          console.log(error.message);
        });
    },
    getCommentNum() {
      axios
        .post(`http://150.158.148.69:2233/getCommentNum`, {
          argumentId: this.topicInfo.id,
        })
        .then((response) => {
          // console.log(response.data.data);
          this.commentNum = response.data.data.commentNum;
        })
        .catch(function (error) {
          console.log(error.message);
        });
    },
    deleteComment() {
      this.$confirm("删除评论后将不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //在删除服务器端的数据后调用接口，删除数据
          axios
            .post(`http://150.158.148.69:2233/deleteComment`, {
              commentId: this.commentForm.commentId,
            })
            .then((response) => {
              console.log(response);
              this.hasCommented = false;
              this.commentForm.score = 0;
              this.commentForm.content = "";
              this.getAllComments();
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                offset: 100,
                duration: 2000,
              });
            })
            .catch(function (error) {
              console.log(error.message);
            });
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
    getAllComments() {
      axios
        .post(`http://150.158.148.69:2233/getReply`, {
          argumentId: this.topicInfo.id,
        })
        .then((response) => {
          // console.log(response.data.data);
          this.commentTexts = response.data.data;
          this.commentTexts.forEach((item) => {
            item.replies.forEach((i) => {
              if (i.fromId === this.userInfo.id) {
                this.$set(i, "canDelete", true);
              }
            });
          });
          // console.log(this.commentTexts);
        })
        .catch(function (error) {
          console.log(error.message);
        });
    },
    likeComment(id, index) {
      axios
        .post(`http://150.158.148.69:2233/likeComment`, {
          commentId: id,
        })
        .then((response) => {
          // console.log(response.data.data);
          this.commentTexts[index].likeNum = response.data.data.likeNum;
        })
        .catch(function (error) {
          console.log(error.message);
        });
    },
    //修改评论区的状态
    changeReply(commentId, fromId, name, rid, i) {
      if (
        this.replyNum == i &&
        this.replyForm.commentId == commentId &&
        this.replyForm.rid == rid
      ) {
        this.replyNum = i + 100000;
      } else {
        this.replyNum = i;
      }
      this.replyForm.holder = `回复@${name}`;
      this.replyForm.toId = fromId;
      this.replyForm.toName = name;
      this.replyForm.commentId = commentId;
      this.replyForm.rid = rid;
    },
    //回复评论
    addReply() {
      axios
        .post(`http://150.158.148.69:2233/addReply`, {
          commentId: this.replyForm.commentId,
          fromId: this.userInfo.id,
          fromName: this.userInfo.userName,
          fromAvatar: this.userInfo.avatar,
          toId: this.replyForm.toId,
          toName: this.replyForm.toName,
          content: this.replyForm.content,
          likeNum: 0,
        })
        .then((response) => {
          console.log(response);
          this.$notify({
            title: "成功",
            message: "回复成功",
            type: "success",
            offset: 90,
            duration: 2000,
          });
          this.replyForm.content = "";
          this.getAllComments();
        })
        .catch(function (error) {
          console.log(error.message);
        });
    },
    likeReply(rid, index, i) {
      axios
        .post(`http://150.158.148.69:2233/likeReply`, {
          rid: rid,
        })
        .then((response) => {
          // console.log(response.data);
          this.commentTexts[index].replies[i].likeNum =
            response.data.data.likeNum;
        })
        .catch(function (error) {
          console.log(error.message);
        });
    },
    deleteReply(rid) {
      axios
        .post(`http://150.158.148.69:2233/deleteReply`, {
          rid: rid,
        })
        .then(() => {
          // console.log(response.data);
          this.getAllComments();
        })
        .catch(function (error) {
          console.log(error.message);
        });
    },
  },
  mounted() {
    this.$bus.$on("getInfo", this.getInfo);
  },
  beforeDestroy() {
    this.$bus.$off("getInfo");
  },
};
</script>

<style lang="less" scoped>
.wrap {
  margin-bottom: 8px;
  padding: 20px 30px 0;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.user-avator img {
  margin: auto;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.headline {
  margin: 0 0 20px;
  text-align: left;
}
/deep/ .el-textarea__inner {
  resize: none;
}
.comment-form {
  text-align: left;
}
.el-divider--horizontal {
  margin: 10px 0;
}
.comment-text {
  padding: 0 3% 10px 0;
  font-size: 14px;
  text-align: left;
}
.user-info {
  font-size: 14px;
  padding-bottom: 10px;
  align-items: center;
  display: flex;
}
.reply-info {
  margin: 0;
  font-size: 13px;
  text-align: left;
  border-left-style: solid;
  border-color: #dcdfe6;
  border-width: 2px;
  background-color: rgb(249 250 251);
  padding: 10px 0 0 0;
}
</style>