import router from './index'
import util from '../util/util'
import store from '../store'
// import global from '../util/global'


var testMenu = [
  {
    name: "首页",
    key: "index",
    url: "/index",
    icon: "s-home"
  },
  {
    name: "场地管理",
    icon: "notebook-2",
    children: [
      {
        url: "/place/approval",
        name: "入住申请"
      },
      {
        url: "/place/placeManage",
        name: "场地管理"
      }
    ]
  }
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

//模拟后台菜单
var route = {
  route1: [
    {
      name: "首页",
      key: "index",
      url: "/index",
      icon: "s-home"
    },
    {
      name: "漫画管理",
      icon: "notebook-2",
      children: [
        {
          url: "/comic/comic_new",
          name: "漫画管理"
        }
      ]
    }
  ],
  route2: [
    {
      name: "首页",
      key: "index",
      url: "/index",
      icon: "s-home"
    },
    {
      name: "用户管理",
      icon: "user",
      children: [
        {
          url: "/permission/userManage",
          name: "用户管理"
        },
        {
          url: "/permission/roleManage",
          name: "角色管理"
        }
      ]
    }
  ]
}

//添加路由
function routerGo(to, next) {
  // global.antRouter = menuList;
  menuList = util.loop(menuList, []); //转换格式
  router.addRoutes(menuList);
  // console.log(global);
  next({ ...to, replace: true });
}

//移除登录信息
function clearItem() {
  var local = localStorage;
  local.removeItem("menuList"); //菜单列表
  // local.removeItem("isLoginTime");
  // local.removeItem("loginInfo");
  local.removeItem("isLogin"); //是否登陆
}

function getItem(key) {
  return localStorage.getItem(key);
}

var menuList;
router.beforeEach((to, from, next) => {
  // console.log(from, to);
  var menu; //当前路由
  var isLogin = getItem('isLogin');
  // console.log(isLogin)
  // info = getItem('loginInfo'),
  // time = getItem('isLoginTime');
  // info = info ? JSON.parse(info) : '';
  // if (isLogin && new Date().getTime() - time < 0) {
  if (isLogin) {
    // console.log('已登录且未过期');
    if (to.name === 'login') {
      // next();
      next({ path: '/index' });
    } else { //未找到路由页
      //菜单未加载
      if (!menuList) {
        // console.log('菜单未加载');
        if (!getItem('menuList')) { //菜单未生成
          // console.log('获取menuList');
          //模拟菜单数据
          // menu = route["route" + info.roleId]; //根据权限分配数据
          menu = testMenu; //默认全部菜单
          menuList = menu;
          store.dispatch("setMenu", menu); //vuex
          localStorage.setItem("menuList", JSON.stringify(menu));
          routerGo(to, next);
          //加载菜单
          // this.$api.roleMenu(Qs.stringify(res)).then(item => {
          // this.$router.addRoutes(item);
          //   this.menuList = item;
          // })
        } else { //已生成
          menuList = getItem('menuList');
          menuList = typeof menuList == 'string' ? JSON.parse(menuList) : menuList;
          routerGo(to, next);
        }
      } else {
        // console.log('刷新');
        next();
      }
    }
  } else {
    // console.log('未登录');
    menuList = null;
    clearItem();
    if (to.path != '/login') {
      next({ path: '/login' });
    } else {
      next();
    }
  }
});