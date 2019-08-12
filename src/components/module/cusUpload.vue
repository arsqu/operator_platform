<template>
  <div class="upload_box">
    <div class="upload_group">
      <img :src="imgUrl" class="imgPreview" v-show="isView">
      <!-- :on-change="(file)=>{return handleChange(file,idx)}" -->
      <el-upload
        class="upload-demo"
        ref="upload"
        :list-type="listType"
        :action="action"
        :idx="idx"
        :on-preview="(file)=>{return handlePreview(file)}"
        :on-remove="(file,fileList)=>{return handleRemove(file,fileList)}"
        :on-change="(file)=>{return handleChange(file,idx)}"
        :file-list="fileList"
        :show-file-list="showFileList"
        :auto-upload="upload"
      >
        <i class="el-icon-plus avatar-uploader-icon"></i>
        <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
        <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    idx: Number,
    isView: Boolean,
    imgUrl: String,
    action: String,
    listType: String,
    upload: Boolean,
    fileList: Array,
    showFileList: Boolean,
    handlePreview: Function,
    handleRemove: Function,
    handleChange: Function
  },
  mounted() {
    // console.log(this);
  },
  methods: {
  },
  submitUpload() {
    this.$refs.upload.submit();
  }
};
</script>

<style scoped>
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}

.imgPreview {
  width: 125px;
  height: 150px;
  float: left;
}
</style>


