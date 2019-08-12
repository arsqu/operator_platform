<template>
  <div class="cusForm">
    <el-form :model="formData" ref="formData" label-width="100px" class="demo-formData">
      <el-form-item label="id" prop="id" v-show="false">
        <el-input v-model="formData.id"></el-input>
      </el-form-item>
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="formData.roleName"></el-input>
      </el-form-item>
    </el-form>
    <!-- 表单操作 -->
    <div class="cusBtn el-form-item__content">
      <template v-for="(item,idx) in formBtn">
        <el-button :type="item.type||'primary'" @click="item.func" :key="idx">{{item.inner}}</el-button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      select: {}
    };
  },
  mounted() {
    // console.log(this);
  },
  components: {},
  props: {
    formData: {
      type: Object,
      default() {
        return {};
      }
    },
    //异步下拉
    syncOpt: {
      type: Object,
      default() {
        return {};
      }
    },
    //按钮表单
    formBtn: {
      type: Array,
      default() {
        return [];
      }
    },
    tableData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>
/* 按钮间距 */

.cusBtn {
  margin-left: 100px;
}

@media screen and (max-width: 750px) {
  .cusBtn {
    margin-left: 30px;
  }
}
</style>

