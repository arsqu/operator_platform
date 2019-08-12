// import Vue from 'vue'
import Vuex from 'vuex'
import comic from '../components/place/placeManage'

Vue.use(Vuex)

//全局state对象
const state = {
  curr: null, //当前标签
  //路由标签
  tags: [
    // {
    //   name: '首页',
    //   url: '/index',
    //   closable: false
    // }
  ],
  count: 0,
  test: '全局变量',
  roleId: null,
  menuList: [],
  breadData: []
}

const getters = {
  getTest(state) {
    return state.test
  },
  getMenu() {
    return state.menuList
  },
  getTags() {
    return state.tags
  },
  getCurr() {
    return state.curr
  }
}

const mutations = {
  addCount(state, n = 0) {
    state.count += n;
  },
  reduceCount(state, n = 0) {
    state.count -= n;
  },
  breadcrumb(state, arr) { //面包屑导航
    state.breadData = arr;
  },
  changeTxt(state, txt) {
    state.test = txt;
  },
  setMenu(state, list) { //菜单列表
    state.menuList = list;
  },
  setCurr(state, curr) { //当前便签下标
    state.curr = curr;
  },
  setTags(state, tag) { //标签组
    state.tags.push(tag);
  },
  delTag(state, idx) { //删除当前标签
    state.tags.splice(idx, 1);
  }
}

const actions = {
  addCount(context, num) {
    context.commit('addCount', num);
  },
  reduceCount(context, num) {
    context.commit('reduceCount', num);
  },
  changeTxt(context, txt) {
    context.commit('changeTxt', txt);
  },
  setMenu(context, list) {
    context.commit('setMenu', list);
  },
  setCurr(context, curr) {
    context.commit('setCurr', curr);
  },
  setTags(context, tag) {
    context.commit('setTags', tag);
  },
  delTag(context, idx) {
    context.commit('delTag', idx);
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    comic
  }
})