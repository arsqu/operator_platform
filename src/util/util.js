const _import = require('@/router/_import_' + process.env.NODE_ENV)//获取组件的方法

//匹配文字
function matchTxt(data, key, param) {
  if (typeof data == 'object' && typeof key == 'object') {
    var k = data[1],
      sel = data[0][k];
    return sel.map(res => {
      if (res[key[0]] == param[k]) {
        return res[key[1]];
      }
    });
  }
}

//转换路由
function loop(route, newArr) {
  route.map(res => {
    if (res.url) {
      // console.log(res.url);
      newArr.push({
        path: res.url,
        name: res.name ? res.name : '',
        component: _import(res.url)
        // component: () => () => import("@/components" + res.path + '"')
      });
    }
    if (res.children && res.children.length > 0) {
      loop(res.children, newArr);
    }
  });
  return newArr;
}

function setCookie(key, value, expire) {
  var date = new Date();
  date.setSeconds(date.getSeconds() + expire)
  document.cookie = key + "=" + escape(value) + "; expires=" + date.toGMTString()
  //console.log(document.cookie)
}

function getCookie(key) {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(key + "=")
    if (c_start != -1) {
      c_start = c_start + key.length + 1
      let c_end = document.cookie.indexOf(";", c_start)
      if (c_end == -1) c_end = document.cookie.length
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }
  return ""
}

function delCookie(key) {
  setCookie(key, "", -1);
}

export default {
  matchTxt, loop,
  setCookie, getCookie, delCookie
}