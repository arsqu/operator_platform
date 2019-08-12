const state = {
  test: '局部漫画数据',
  count: 0
}

const getters = {
  getData(state, key) {
    return state[key];
  }
}

const mutations = {
  changeTxt(state, txt) {
    state.test = txt;
  }
}

const actions = {
  changeTxt(context, txt) {
    context.commit('changeTxt', txt);
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}