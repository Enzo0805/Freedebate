<template>
  <div class="wrap">
    <el-row type="flex" class="Inner">
      <el-col :span="5">
        <left-menu />
      </el-col>
      <el-col :span="19">
        <keep-alive
          :include="[
            'AccountInfo',
            'Collection',
            'MyComments',
            'UserManagement',
          ]"
        >
          <router-view />
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LeftMenu from "../components/PersonalCenters/LeftMenu.vue";
export default {
  components: { LeftMenu },
  name: "PersonalCenter",
  data() {
    return {};
  },
};
</script>

<style scoped>
.wrap {
  position: relative;
  background-size: cover;
}
.Inner {
  margin-top: 20px;
}
</style>