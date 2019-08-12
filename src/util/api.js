import fetch from './fetch'

const name = "/api/v1/";

const comUrl = {
  'login': '/api/login',
  'signOut': '/api/logout',
  "place": {
    'apply': { //场地审批
      'approval': name + 'place-apply/list',
      'approved': name + 'place-apply/check' // /{id}?status=1
    },
    'place': { //场地
      'query': name + 'place/list',
      'edit': name + 'place/edite-save'
    },
    'space': {//空间
      'query': name + 'place-space/all', //查询
      'add': name + 'place-space/add-save/0', //新增
      'edit': name + 'place-space/edite-save', //修改
      'del': name + 'place-space/del'  //删除
    },
    'plan': { //计划
      'query': name + 'place-plan/all',
      'add': name + 'place-plan/add-save/0',
      'edit': name + 'place-plan/edite-save',
      'del': name + 'place-plan/del'
    },
    'set': { //设置
      'query': name + 'place-setting/detail',
      'add': name + 'place-setting/save/0',
      'edit': name + 'place-setting/save'
    }
  },
}

function getUrl(obj, key, val) {
  return new Function('a', 'return null==' + val + '?a.' + key + ':(a.' + key + '=' + val + ',a)')(obj);
}

//登陆
function login(param, config) {
  return fetch.postData(comUrl.login, param, config);
}

function signOut(param, config) {
  return fetch.getData(comUrl.signOut, param, config);
}

function getData(key, param, config) {
  var url = getUrl(comUrl, key);
  return fetch.getData(url, param, config);
}

function postData(key, param, config) {
  var url = getUrl(comUrl, key);
  return fetch.postData(url, param, config);
}

// 接口传参 url/id 
function getDataId(key, id, config) {
  var url = getUrl(comUrl, key);
  return fetch.getData(url + '/' + id, '', config);
}

function postDataId(key, id, param, config) {
  var url = getUrl(comUrl, key);
  return fetch.postData(url + '/' + id, param, config);
}

function delDataId(key, id, config) {
  var url = getUrl(comUrl, key);
  return fetch.getData(url + '/' + id, '', config);
}

function postMedia(param, config) {
  return fetch.postFile(mediaUrl.addMedia, param, config);
}

export default {
  login, signOut, getData, postData, postMedia,
  getDataId, postDataId, delDataId
}