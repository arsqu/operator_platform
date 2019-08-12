<template>
  <div id="app" class="main_container">
    <!-- element-ui layout布局 -->
    <el-container class="main_box" v-if="$route.path!=='/login'">
      <div :class="['aside_box',isCollapse?'phone':'']">
        <!-- 侧边栏 -->
        <el-aside width>
          <!-- {{$route.path}} -->
          <el-menu
            router
            :default-active="$route.path"
            class="el-menu-custom"
            @select="handleSelect"
            @open="handleOpen"
            @close="handleClose"
            :collapse="isCollapse"
          >
            <!-- 菜单列表 -->
            <cusMenu :router="routes" />
          </el-menu>
        </el-aside>
      </div>
      <el-container class="main_sec">
        <!-- 页头 -->
        <el-header height>
          <div class="head_top">
            <div class="toggleAside" @click="toggleAside">
              <i :class="[!isCollapse?'el-icon-s-fold':'el-icon-s-unfold']"></i>
            </div>
            <div class="bread_crump">
              <breadcrumb :breadData="$store.state.breadData" />
            </div>
            <div class="login_info" @click="logout">登出</div>
          </div>
          <div class="head_mid">
            <div class="tagRouter">
              <tagView />
            </div>
          </div>
        </el-header>
        <!-- 页面内容 -->
        <el-main>
          <transition name="fade" mode="out-in">
            <router-view />
          </transition>
        </el-main>
        <!-- <el-footer>
          <div>
            <span>Footer</span>
          </div>
        </el-footer>-->
      </el-container>
    </el-container>
    <div v-else class="login_layout">
      <router-view />
    </div>
    <!-- element-ui -->
  </div>
</template> 

<script>
// import global from "./util/global";
const cusMenu = () => import("./components/common/menu");
const tagView = () => import("./components/common/tagView");
const breadcrumb = () => import("./components/module/breadcrumb");

export default {
  name: "App",
  data() {
    return {
      isCollapse: false, //菜单展开与收缩
      breadData: [], //面包屑
      tags: [], //路由标签
      routes: [
        //菜单
        // {
        //   name: "首页",
        //   key: "index",
        //   url: "/index",
        //   icon: "s-home"
        // },
        // {
        //   name: "场地管理",
        //   icon: "notebook-2",
        //   children: [
        //     {
        //       url: "/place/approval",
        //       name: "入住申请"
        //     },
        //     {
        //       url: "/place/placeManage",
        //       name: "场地管理"
        //     }
        //   ]
        // }
        // {
        //   name: "用户管理",
        //   icon: "user",
        //   children: [
        //     {
        //       url: "/permission/userManage",
        //       name: "用户管理"
        //     },
        //     {
        //       url: "/permission/roleManage",
        //       name: "角色管理"
        //     }
        //   ]
        // }
      ]
    };
  },
  components: {
    tagView,
    cusMenu,
    breadcrumb
  },
  created() {
    // console.log("created");
  },
  mounted() {
    // console.log("app_mounted");
    this.init();
  },
  methods: {
    init() {
      if (this.$route.path != "/login") {
        this.selTags();
        this.loadMenu();
      }
    },
    //登出
    logout() {
      this.$confirm("确认要退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.$api.signOut().then(res => {
            if (res.code == 1) {
              localStorage.removeItem("isLogin");
              this.$message("删除成功");
              this.$router.push({ path: "/login" });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    //默认选中tag
    selTags() {
      var route = this.$route,
        txt;
      // if (route.path == "/") txt = "首页";
      var opt = {
        name: route.name || txt,
        url: route.path,
        closable: true
      };
      // console.log(this.$route);
      if (route.path == "/") {
        return;
      }
      this.$store.dispatch("setTags", opt);
      this.$store.dispatch("setCurr", 0);
    },
    //加载菜单
    loadMenu() {
      //读本地存储
      var menuList = localStorage.getItem("menuList");
      // var menuList = this.routes;
      menuList = menuList ? JSON.parse(menuList) : this.$store.getters.getMenu;
      this.$set(this, "routes", menuList);
      //加载菜单
    },
    //菜单选中,添加到tags
    handleSelect(key, keyPath, e) {
      var el = e.$el;
      var opt = {
        name: el.innerText,
        url: key,
        closable: true
      };
      var tags = this.$store.getters.getTags;
      for (var i = 0; i < tags.length; i++) {
        // console.log(tags[i].name, el.innerText);
        if (tags[i].name == el.innerText) {
          this.$store.dispatch("setCurr", i);
          return;
        }
      }
      //设置标签
      this.$store.dispatch("setTags", opt);
      this.$store.dispatch("setCurr", tags.length - 1);
    },
    //菜单展开
    handleOpen(key, keyPath) {
      // console.log(this.isCollapse);
      // console.log(key, keyPath);
    },
    //菜单收缩
    handleClose(key, keyPath) {
      // console.log(this.isCollapse);
      // console.log(key, keyPath);
    },
    //测试vuex
    add() {
      this.$store.dispatch("addCount", 1);
    },
    reduce() {
      this.$store.dispatch("reduceCount", 1);
    },
    toggleAside() {
      this.isCollapse = !this.isCollapse;
      // console.log("toggle");
    }
  },
  // computed: {
  //   routes() {
  //     // this.$set(this, "routes", global.antRouter);
  //     // return global.antRouter;
  //     // console.log(global);
  //   }
  // },
  watch: {
    $route: {
      handler(to, from) {
        // console.log(global);
        // this.$set(this, "routes", global.antRouter);
        //登录时清空路由
        if (to.path == "/login") {
          this.routes = [];
          return;
        }
        if (!this.routes || this.routes.length == 0) {
          this.loadMenu();
        }
      },
      deep: true
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Arial,
    sans-serif;
}

/* 重置默认样式 */
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

/* 测试样式 */
.el-header,
.el-footer {
  background-color: #fff;
  color: #333;
  /* text-align: center; */
}

.el-footer {
  border-top: 1px solid #ddd;
}

/*fade*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

/* 登录 */
.login_layout {
  font-family: "Catamaran", sans-serif;
  font-size: 100%;
  background: -webkit-linear-gradient(
    to left top,
    #d76162,
    #d76162,
    #d76b6c,
    #fd8384
  );
  background: -moz-linear-gradient(
    to left top,
    #d76162,
    #d76162,
    #d76b6c,
    #fd8384
  );
  background: -o-linear-gradient(
    to left top,
    #d76162,
    #d76162,
    #d76b6c,
    #fd8384
  );
  background: -ms-linear-gradient(
    to left top,
    #d76162,
    #d76162,
    #d76b6c,
    #fd8384
  );
  background: linear-gradient(to left top, #d76162, #d76162, #d76b6c, #fd8384);
  min-height: 100vh;
  height: 100%;
}

/* 铺满全屏 */
.main_container {
  height: 100%;
}

.main_container .main_box {
  height: 100%;
}

/* 侧边栏 */
.main_container .aside_box {
  height: 100%;
}

.main_container .el-aside {
  color: #333;
  height: 100%;
  overflow-x: hidden;
}

/* 重置默认样式 */
.el-menu--collapse .el-menu-item span,
.el-menu--collapse .el-submenu > .el-submenu__title span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}

.el-menu--collapse .el-menu-item .el-submenu__icon-arrow,
.el-menu--collapse .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
  display: none;
}

/* 默认 */
.el-menu-custom {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}

/* 电脑端*/
.el-menu-custom:not(.el-menu--collapse) {
  width: 210px;
  border-right: 1px solid #e6e6e6;
}

/* 手机端 */
.el-menu-custom.el-menu--collapse {
  overflow: visible;
  margin-right: 0;
}

/* 内容区域 */
.el-main {
  color: #333;
  padding: 0;
}

/* 页头 */
.el-header {
  padding: 0;
  border-bottom: 1px solid #ececec;
}

.el-header .head_top {
  display: flex;
  align-items: center;
  padding-right: 20px;
  border-bottom: 1px solid #ececec;
}

.el-header .head_mid {
  padding: 5px 0 5px 10px;
}

.el-header .bread_crump {
  flex: 1;
}

.el-header .toggleAside {
  padding: 0 15px;
  cursor: pointer;
}

.el-header .el-icon-s-unfold,
.el-header .el-icon-s-fold {
  font-size: 26px;
  color: #333;
  vertical-align: sub;
}

.toggleAside:hover {
  background: #f9f9f9;
}

/* 登出 */
.el-header .login_info {
  font-size: 15px;
  color: #666;
  cursor: pointer;
  padding: 10px 20px;
  transition: 0.45s ease;
}

.el-header .login_info:hover {
  background: #d76162;
  color: #fff;
}
</style>
