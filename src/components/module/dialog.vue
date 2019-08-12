<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <slot/>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    title: String
  },
  methods: {}
};
</script>

<style scoped>
</style>


