<template>
  <div id="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="(item,idx) in breadData"
        :key="idx"
        :to="{ path: item.src }"
      >{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    breadData: {
      type: Array,
      default: []
    }
  }
};
</script>

<style scoped>
#breadcrumb >>> .el-breadcrumb__inner {
  font-weight: normal;
}

#breadcrumb >>> .el-breadcrumb__inner a {
  color: #606266;
  font-weight: normal;
}
</style>


