<template>
  <div class="cusForm">
    <el-form
      :model="formData"
      :rules="rules"
      :disabled="disabled"
      ref="formData"
      label-width="100px"
      class="demo-formData"
    >
      <!-- 表单内容 -->
      <template v-for="(item,idx) in formRule">
        <!-- 下拉框 -->
        <!-- <div :key="idx">{{item}}</div> -->
        <template v-if="item.type == 'select'">
          <el-form-item
            :label="item.label"
            :prop="item.prop"
            :key="'select_'+idx"
            v-if="!item.hide"
            v-show="!(item.isShow==!1)"
          >
            <template v-if="item.multi">
              <el-select
                v-model="formData['m_'+item.prop+'__'+item.postKey]"
                multiple
                :placeholder="'请选择'+item.label"
              >
                <el-option v-for="(o,i) in item.options" :label="o.txt" :value="o.val" :key="idx+i"></el-option>
              </el-select>
            </template>
            <el-select v-else v-model="formData[item.prop]" :placeholder="'请选择'+item.label">
              <el-option v-for="(o,i) in item.options" :label="o.txt" :value="o.val" :key="idx+i"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <!-- 标签组件 -->
        <template v-else-if="item.type == 'tags'">
          <el-form-item
            v-if="!item.hide"
            v-show="!(item.isShow==!1)"
            :label="item.label"
            :prop="item.prop"
            :key="'tags_'+idx"
          >
            <el-tag
              class="el-tag--light"
              v-for="(t,i) in formData['m_'+item.prop]"
              :key="i"
              :type="!disabled?'':'info'"
              :closable="!disabled"
              @close="item.handleClose(idx,t)"
            >{{t}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="item.inputVisible"
              @keyup.enter.native="item.handleInputConfirm(idx)"
              @blur="item.handleInputConfirm(idx)"
              v-model="item.inputValue"
              size="small"
              ref="saveTagInput"
            ></el-input>
            <el-button
              v-else-if="!disabled"
              class="button-new-tag"
              size="small"
              @click="item.showInput(idx)"
            >+ New Tag</el-button>
          </el-form-item>
        </template>
        <!-- 上传组件 -->
        <template v-else-if="item.type == 'avatar'">
          <el-form-item
            :label="item.label"
            class="resetImg"
            :prop="item.prop"
            :key="idx"
            v-if="!item.hide"
            v-show="!(item.isShow==!1)"
          >
            <!-- 图片上传 -->
            <!-- 测试图片 -->
            <!--  -->
            <cusUpload
              :showFileList="item.showFileList"
              :action="item.action||''"
              :fileList="item.fileList"
              :idx="idx"
              :imgUrl="item.imgUrl||''"
              :listType="item.listType"
              :upload="item.upload"
              :isView="item.isView"
              :handlePreview="item.handlePreview"
              :handleRemove="item.handleRemove"
              :handleChange="item.handleChange"
            />
          </el-form-item>
        </template>
        <!-- 日期选择组件 -->
        <template v-else-if="item.type == 'datePicker'">
          <el-form-item
            :prop="item.prop"
            :key="idx"
            :label="item.label"
            v-if="!item.hide"
            v-show="!(item.isShow==!1)"
          >
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="formData[item.prop]"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </template>
        <!-- 默认样式 -->
        <template v-else>
          <el-form-item
            :label="item.label"
            v-if="!item.hide"
            v-show="!(item.isShow==!1)"
            :prop="item.prop"
            :key="idx"
          >
            <el-input :type="item.type" v-model="formData[item.prop]"></el-input>
          </el-form-item>
        </template>
      </template>
    </el-form>
    <!-- </el-checkbox-group> -->
    <!-- <el-radio-group v-model="formData[item.prop]">
            <el-radio v-for="r in item.checkList" :label="r.id" :key="r.id">{{r.title}}</el-radio>
    </el-radio-group>-->
    <!-- <el-form-item :label="item.label" :prop="item.prop" :key="idx">
          <el-radio-group v-model="formData[item.prop]">
            <el-radio v-for="r in ['线上品牌商赞助','线下场地免费']" :label="r" :key="r"></el-radio>
          </el-radio-group>
    </el-form-item>-->

    <!-- <el-form-item :label="item.label" :prop="item.prop" :key="idx">
          <el-checkbox-group v-model="formData[item.prop]">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
    </el-form-item>-->
    <!-- <el-form-item>
      <el-button type="primary" @click="submitForm('formData')">立即创建</el-button>
      <el-button @click="reBack()">返回</el-button>
      <el-button @click="resetForm('formData')">重置</el-button>
    </el-form-item>-->
    <!--
    <el-form-item label="活动时间" required>
      <el-col :span="11">
        <el-form-item prop="date1">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="formData.date1"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col class="line" :span="2">-</el-col>
      <el-col :span="11">
        <el-form-item prop="date2">
          <el-time-picker placeholder="选择时间" v-model="formData.date2" style="width: 100%;"></el-time-picker>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="即时配送" prop="delivery">
      <el-switch v-model="formData.delivery"></el-switch>
    </el-form-item>
    <el-form-item label="特殊资源" prop="resource">
      <el-radio-group v-model="formData.resource">
        <el-radio label="线上品牌商赞助"></el-radio>
        <el-radio label="线下场地免费"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('formData')">立即创建</el-button>
      <el-button @click="resetForm('formData')">重置</el-button>
    </el-form-item>
    -->
    <!-- 表单操作 -->
    <!-- <el-form-item> -->
    <div class="cusBtn el-form-item__content">
      <template v-for="(item,idx) in formBtn">
        <!-- (file)=>{return handleChange(file,idx)} -->
        <el-button :type="item.type||'primary'" @click="item.func" :key="idx">{{item.inner}}</el-button>
      </template>
    </div>
    <!-- </el-form-item> -->
  </div>
</template>

<script>
import cusUpload from "./cusUpload";
export default {
  data() {
    return {
      checkbox: {
        box: []
      },
      rules: {
        /*
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
        */
      },
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ]
    };
  },
  mounted() {
    // console.log(this);
  },
  components: {
    cusUpload
  },
  props: {
    //生成规则
    disabled: Boolean,
    formRule: {
      type: Array,
      default() {
        return [];
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
    // this.formData = Object.assign({}, this.formData);
    // console.log(this.formData);
  },
  methods: {
    //返回上一层
    /*
    reBack() {
      //与父组件通信,切换table与form的显示隐藏
      this.$emit("reBack", true);
    },
    //提交到服务器
    submitForm(formName) {
      console.log(this.formData);
      return;
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
    */
  }
};
</script>

<style scoped>
.resetImg >>> .el-form-item__content {
  line-height: 0;
}

/* 标签间距 */
.el-tag--light {
  margin-left: 0px;
}
.el-tag--light + .el-tag--light {
  margin-left: 10px;
}

.input-new-tag {
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


