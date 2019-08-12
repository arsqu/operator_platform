// import Vue from 'vue'
import axios from 'axios'
import router from './router' //常规路由
import global from './util/global' //全局变量
import routeMap from './router/permission' //权限路由
import store from './store' //vuex
import './assets/css/common.css' //公共样式
// import Element from 'element-ui' //全局引入
// import ElementUI from './util/elementUI' //局部引入
import ElementUI from 'element-ui' //局部引入
// import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/resetui.css' //重置样式
import api from './util/api'  //接口地址
import util from './util/util' //公共方法
import App from './App'
import 'default-passive-events'
// import { Message } from 'element-ui';

Vue.config.productionTip = false


// axios.defaults.baseURL = '/api'
axios.defaults.baseURL = process.env.API_BASE;
axios.defaults.withCredentials = true;
/**.create({
  baseURL: process.env.API_BASE,
  withCredentials: true,
  // timeout: 10000 
}); */

//数据响应拦截
axios.interceptors.response.use(response => {
  if (response.data.code == 401) {
    router.replace({
      path: '/login'
      //登录成功后跳入浏览的当前页面
      // query: {redirect: router.currentRoute.fullPath}
    })
  }
  return response;
}, err => {
  console.log(err, err.response);
  if (err.response) {
    switch (err.response.status) {
      case 401:
        localStorage.removeItem('isLogin');
        router.replace({
          path: '/login'
          //登录成功后跳入浏览的当前页面
          // query: {redirect: router.currentRoute.fullPath}
        })
    }
    return Promise.reject(err);
  }
});

Vue.prototype.$axios = axios;
Vue.prototype.$api = api //接口地址
Vue.prototype.$util = util //通用方法

// console.log(router);

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})