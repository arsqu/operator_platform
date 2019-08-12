<template>
  <div class="tagView">
    <el-tag
      v-for="(item,idx) in tags"
      :class="{is_active:$store.state.curr == idx}"
      size="medium"
      :key="idx"
      :type="item.type"
      :closable="item.closable"
      @click="handleClick(item,idx)"
      @close="handleClose(idx)"
    >{{item.name}}</el-tag>
  </div>
</template>

<script>
export default {
  name: "tagView",
  data() {
    return {
      tags: []
    };
  },
  create() {
    // console.log("create");
  },
  mounted() {
    // console.log("mounted");
    this.init();
  },
  methods: {
    init() {
      this.loadTags();
    },
    getTag() {
      return this.$store.getters.getTags;
    },
    getCurr() {
      return this.$store.getters.getCurr;
    },
    //加载标签
    loadTags() {
      this.tags = this.getTag();
    },
    //选中标签
    handleClick(item, idx) {
      if (idx < 0) return;
      this.$store.dispatch("setCurr", idx);
      if (item.url) {
        this.$router.push({ path: item.url });
      }
    },
    //关闭标签
    handleClose(idx) {
      //tags会重新排序
      var tags = this.getTag();
      if (tags.length == 0) {
        return;
      }
      var curr = this.getCurr(); //当前标签下标
      if (idx == tags.length - 1) {
        this.$store.dispatch("delTag", idx);
        idx--;
        this.handleClick(tags[idx], idx);
        return;
      }
      this.$store.dispatch("delTag", idx);
      this.handleClick(tags[idx], idx);
    }
  }
};
</script>

<style scoped>
.el-tag {
  background: #fff;
  margin-right: 5px;
  color: #666;
  border-color: #ddd;
  cursor: pointer;
}

.el-tag.is_active {
  background: #d66162;
  color: #fff;
}

.el-tag.is_active:before {
  background: #fff;
  width: 8px;
  height: 8px;
  content: "";
  display: inline-block;
  border-radius: 50%;
  margin-right: 5px;
}

.tagView >>> .el-tag.is_active .el-tag__close {
  color: #fff;
}

.tagView >>> .el-tag__close:hover {
  background-color: #88919c;
  color: #fff;
}
</style>


