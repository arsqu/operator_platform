<template>
  <div class="cusForm">
    <el-form :model="formData" ref="formData" label-width="100px" class="demo-formData">
      <el-form-item label="id" prop="id" v-show="false">
        <el-input v-model="formData.id"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passWord">
        <el-input v-model="formData.passWord" show-password></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="formData.roleId" :placeholder="'请选择角色'">
          <el-option v-for="(o,i) in syncOpt.roleId" :label="o.txt" :value="o.val" :key="i"></el-option>
        </el-select>
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
    console.log(this);
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

