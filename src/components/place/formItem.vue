<template>
  <div class="cusForm">
    <!-- :inline="true" -->
    <el-form
      :model="formData"
      :disabled="disabled"
      :loading="loading"
      :select="select"
      :formRule="formRule"
      :syncOpt="syncOpt"
      :rules="rules"
      ref="formData"
      label-width="100px"
      class="demo-formData"
    >
      <template v-for="(item,idx) in formRule">
        <el-form-item :label="item.label" :prop="item.prop" :key="idx">
          <!-- custom type -->
          <template v-if="'slot'=== item.type">
            <slot :name="'form-' + item.prop" />
          </template>
          <!-- textarea -->
          <el-input
            v-else-if="'textarea' == item.type"
            type="textarea"
            autosize
            v-model="formData[item.prop]"
          ></el-input>
          <!-- number -->
          <el-input v-else-if="'number' == item.type" v-model.number="formData[item.prop]"></el-input>
          <!-- select -->
          <template v-else-if="'select' == item.type">
            <el-select v-model="formData[item.prop]" :placeholder="item.label">
              <!-- async select -->
              <template v-if="item.async">
                <el-option
                  v-for="(o,i) in syncOpt[item.prop]"
                  :label="o.txt"
                  :value="o.val"
                  :key="i"
                ></el-option>
              </template>
              <!-- def select -->
              <template v-else>
                <el-option
                  v-for="(o,i) in select[item.prop]"
                  :label="o.txt"
                  :value="o.val"
                  :key="i"
                ></el-option>
              </template>
            </el-select>
          </template>
          <!-- multi select -->
          <el-select
            v-else-if="'multi-select' == item.type"
            v-model="formData[item.prop]"
            multiple
            :placeholder="'请选择'+item.label"
          >
            <el-option v-for="(o,i) in syncOpt[item.prop]" :label="o.txt" :value="o.val" :key="i"></el-option>
          </el-select>
          <!-- datePicker -->
          <el-date-picker
            v-else-if="'datePicker' == item.type"
            type="date"
            v-model="formData[item.prop]"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyyMMdd"
          ></el-date-picker>
          <!-- datesPicker -->
          <el-date-picker
            v-else-if="'datesPicker' == item.type"
            type="dates"
            v-model="formData[item.prop]"
            placeholder="选择一个或多个日期"
            value-format="yyyyMMdd"
          ></el-date-picker>
          <!-- timePicker -->
          <el-time-select
            v-else-if="'timePicker' == item.type"
            v-model="formData[item.prop]"
            :picker-options="{
              start: '01:30',
              step: '00:15',
              end: '23:00'
            }"
            placeholder="选择时间"
          ></el-time-select>
          <!-- default -->
          <el-input v-else v-model="formData[item.prop]"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <!-- formBtn -->
    <div class="cusBtn el-form-item__content">
      <template v-for="(item,idx) in formBtn">
        <el-button
          :type="item.type||'primary'"
          :loading="item.key == 'post'&& loading"
          @click="item.func(item.param)"
          :key="idx"
        >{{item.inner}}</el-button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: "",
      inputVisible: false //标签
    };
  },
  components: {},
  props: {
    //生成规则
    disabled: Boolean,
    loading: Boolean,
    select: {
      type: Object,
      default() {
        return {};
      }
    },
    rules: {
      type: Object,
      default() {
        return {};
      }
    },
    formRule: {
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
    //填充数据
    formData: {
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
    }
  },
  mounted() {
    this.transferBox = this.formRule;
    // console.log(this.formRule);
  },
  methods: {}
};
</script>

<style scoped>
.resetImg >>> .el-form-item__content {
  line-height: 0;
}

.avatar {
  width: 150px;
  height: 150px;
  display: block;
}

/* 图片 */

.cusForm >>> .resetImg {
  min-height: 150px;
}

.cusForm >>> .resetImg {
  position: relative;
}

.cusForm >>> .resetImg:after {
  content: "";
  display: block;
  clear: both;
}

.cusForm >>> .imgPreview {
  width: 128px;
  float: left;
}

/* .cusForm >>> .upload-demo { */
/* float: left;
  left: 128px;
  position: absolute;
  top: 50%;
  margin-top: -74px; */
/* } */

.img_view img {
  width: 12%;
}

/* 标签间距 */
.cusForm >>> .el-tag--light + .el-tag--light {
  margin-left: 10px;
}

.cusForm >>> .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

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