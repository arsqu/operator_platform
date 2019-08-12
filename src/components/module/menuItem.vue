<template>
  <div class="menuList">
    <template v-for="(item,idx) in router">
      <el-submenu v-if="item.children&&item.children.length>0" :key="idx" :index="item.url">
        <template slot="title">
          <i v-if="item.icon" :class="'el-icon-'+item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </template>
        <cusMenu :router="item.children"/>
      </el-submenu>
      <el-menu-item v-else :index="item.url" :key="idx">
        <i v-if="item.icon" :class="'el-icon-'+item.icon"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
// import cusMenu from "./components/common/menu";
export default {
  name: "menuItem",
  data() {
    return {};
  },
  props: {
    router: {
      type: Array,
      default: []
    }
  },
  components: {
    cusMenu
  },
  mounted() {
    // console.log(this.router);
  },
  methods: {}
};
</script>


<style scoped>
</style>

