<template>
  <div :class="[!loop?'over_hide':'menuList']">
    <template v-for="(item,idx) in router">
      <el-submenu v-if="item.children&&item.children.length>0" :key="idx" :index="Math.random()+''">
        <template slot="title">
          <i v-if="item.icon" :class="'el-icon-'+item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </template>
        <cusMenu :router="item.children" :loop="true" />
      </el-submenu>
      <template v-else>
        <!-- menu有router属性时index值等同于router-link -->
        <!-- <router-link :to="item.url" :key="idx"> -->
        <el-menu-item :index="item.url" :key="idx">
          <i v-if="item.icon" :class="'el-icon-'+item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
        <!-- </router-link> -->
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "cusMenu",
  data() {
    return {};
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    },
    router: {
      type: Array,
      default: []
    }
  },
  components: {},
  created() {
    // console.log(this.router);
  },
  mounted() {
    // console.log(this.router);
  },
  methods: {}
};
</script>

<style scoped>
.over_hide {
  overflow-y: scroll;
  height: 100%;
  overflow-x: hidden;
  margin-right: -18px;
}

.el-menu-item:hover {
  background: #f2dddd;
}

.el-menu-item.is-active {
  background: #d66162;
  color: #fff;
}
</style>