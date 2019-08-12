// import Vue from 'vue'
// import Router from 'vue-router'
// Vue.use(Router);

export const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/login')
  }
  // {
  //   path: '/',
  //   redirect: '/index'
  // },
  // {
  //   path: '/index',
  //   name: '首页',
  //   component: () => import('@/components/index'),
  //   meta: {
  //     requireAuth: true
  //   }
  // },
  // {
  //   path: '/404',
  //   name: 'notFound',
  //   component: () => import('@/components/common/notFound'),
  //   meta: {
  //     requireAuth: true
  //   }
  // },
  // {
  //   path: '/permission/userManage',
  //   name: 'userManage',
  //   component: () => import('@/components/permission/userManage'),
  //   meta: {
  //     requireAuth: true
  //   }
  // },
  // {
  //   path: '/permission/roleManage',
  //   name: 'roleManage',
  //   component: () => import('@/components/permission/roleManage'),
  //   meta: {
  //     requireAuth: true
  //   }
  // },
  // {
  //   path: '/permission/ruleManage',
  //   name: 'ruleManage',
  //   component: () => import('@/components/permission/ruleManage'),
  //   meta: {
  //     requireAuth: true
  //   }
  // },
  // , {
  //   path: '/place/approval',
  //   name: 'comic_new',
  //   component: () => import('@/components/comic/placeApproval'),
  //   meta: {
  //     requireAuth: true
  //   }
  // }, {
  //   path: '/place/placeManage',
  //   name: 'comic_new',
  //   component: () => import('@/components/comic/comic_new'),
  //   meta: {
  //     requireAuth: true
  //   }
  // }
];


export default new VueRouter({
  mode: 'history',
  routes
})