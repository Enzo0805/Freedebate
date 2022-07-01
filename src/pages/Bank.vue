<template>
  <div class="biantiku">
    <el-table
      :data="
        showedData.filter(
          (data) =>
            !search || data.topic.toLowerCase().includes(search.toLowerCase())
        )
      "
      @sort-change="sort_change"
      style="width: 100%"
      height="660.5px"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="题解：">
              <span v-show="props.row.topicInfo">{{
                props.row.topicInfo
              }}</span>
              <span v-show="!props.row.topicInfo">无</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="题目类型"
        prop="category"
        width="150px"
        :filters="[
          { text: '政策辩', value: '政策' },
          { text: '事实辩', value: '事实' },
          { text: '价值辩', value: '价值' },
        ]"
        :filter-method="filterHandler"
      >
      </el-table-column>
      <el-table-column label="题目名称" width="500px" prop="topic">
      </el-table-column>
      <el-table-column
        label="推荐等级"
        width="200px"
        prop="recommendLevel"
        sortable="custom"
      >
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="{}">
          <el-autocomplete
            style="width: 500px"
            placeholder="请输入赛事时间+简称（如2019新国辩）"
            :fetch-suggestions="querySearch"
            @select="handleSelect"
            v-model="auto"
            v-show="select == 1"
          >
            <el-select
              v-model="select"
              slot="prepend"
              placeholder="请选择类型"
              style="width: 130px"
            >
              <el-option label="按赛事搜索" value="1"></el-option>
              <el-option label="按辩题搜索" value="2"></el-option>
            </el-select>
          </el-autocomplete>
          <el-input
            placeholder="输入辩题关键字搜索"
            v-model="search"
            class="input-with-select"
            v-show="select == 2"
          >
            <el-select
              v-model="select"
              slot="prepend"
              placeholder="请选择类型"
              style="width: 130px"
            >
              <el-option label="按大赛搜索" value="1"></el-option>
              <el-option label="按辩题搜索" value="2"></el-option>
            </el-select>
          </el-input>
        </template>
        <template slot-scope="scope">
          <el-button
            @click="handleInfo(scope.row)"
            type="text"
            style="margin-right: 20px"
            icon="el-icon-link"
            >详细信息</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            icon="el-icon-star-off"
            style="margin-left: 20px"
            @click="AddToFavorites(scope.row)"
            :disabled="!isLogin"
            >收藏辩题</el-button
          >
          <add-to-favorites ref="AddFavorites" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="tableData.length"
      style="background-color: #fff"
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from "axios";
import AddToFavorites from "../components/AddToFavorites.vue";
import { mapState } from "vuex";
export default {
  components: { AddToFavorites },
  name: "Bank",
  data() {
    return {
      //总共的辩题数
      total: "",
      //每页展示的辩题数
      pageSize: 20,
      //现在的页面
      currentPage: 1,
      //辩题数据（未排序）
      tableData: [],
      //排序后展示的数据
      showedData: [],
      //点击行的信息
      msg: "",
      //搜索栏的选择器
      select: "1",
      //按辩题名称搜索时的内容
      search: "",
      //按大赛搜索时的内容
      auto: "",
      //匹配的赛事名称
      matchNames: [],
    };
  },
  computed: {
    ...mapState(["isLogin"]),
  },
  watch: {
    auto(newValue) {
      if (newValue == "") {
        this.tableData = JSON.parse(sessionStorage.getItem("tableData"));
      }
    },
    tableData: {
      handler() {
        this.showedData = this.tableData.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        );
      },
      immediate: true,
    },
  },
  methods: {
    //显示翻页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.showedData = this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    //过滤器函数
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //获得点击行的信息，跳转到相应辩题详情页
    handleInfo(row) {
      // console.log(index, row);
      this.$router.push({ path: "/MoreInfo", query: { argumentID: row.id } });
    },
    sort_change(column) {
      // column是个形参，具体查看element-ui文档
      this.currentPage = 1; // return to the first page after sorting
      this.tableData = this.tableData.sort(
        this.sortFun(column.prop, column.order === "ascending")
      );
      this.showedData = this.tableData.slice(0, this.pageSize); // 排序完显示到第一页
    },
    sortFun(attr, rev) {
      //第一个参数传入info里的prop表示排的是哪一列，第二个参数是升还是降排序
      if (rev == undefined) {
        rev = 1;
      } else {
        rev = rev ? 1 : -1;
      }
      return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
          return rev * -1;
        }
        if (a > b) {
          return rev * 1;
        }
        return 0;
      };
    },
    //获得现有的大赛的名称
    getAllContestname() {
      axios
        .get(`http://150.158.148.69:2233/getAllContestname`)
        .then((response) => {
          // console.log(JSON.parse(response.data.data));
          let names = JSON.parse(response.data.data);
          for (let i = 0; i < names.length; i++) {
            let row = {
              value: "",
            };
            this.matchNames.push(row);
            this.matchNames[i].value = names[i];
          }
        })
        .catch(function (error) {
          console.log(error.message);
        });
    },
    querySearch(queryString, cb) {
      var matchNames = this.matchNames;
      var results = queryString
        ? matchNames.filter(this.createFilter(queryString))
        : matchNames;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (match) => {
        return (
          match.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        );
      };
    },
    //根据大赛名搜索辩题
    handleSelect(item) {
      axios
        .post("http://150.158.148.69:2233/sortArguments", {
          contestname: item.value,
        })
        .then((response) => {
          this.tableData = JSON.parse(response.data.data);
        })
        .catch(function (error) {
          console.log("请求失败了");
          console.log(error.message);
        });
    },
    AddToFavorites(row) {
      this.$refs.AddFavorites.handleAdd(row);
    },
  },
  mounted() {
    this.tableData = JSON.parse(sessionStorage.getItem("tableData"));
    this.getAllContestname();
  },
  beforeDestroy() {},
};
</script>

<style  scoped>
.biantiku {
  height: 100%;
}
.el-table {
  margin: 0 !important;
  padding: 0 !important;
  height: 95% !important;
}
.demo-table-expand {
  margin-left: 58px;
}
.demo-table-expand .el-form-item {
  margin-bottom: 0;
  width: 95%;
}
.el-divider {
  margin: 15px 0 15px;
}
</style>