import axios from 'axios'

// get
function getData(url, params) {
  return new Promise((resolve, reject) => {
    // console.log(url, params)
    axios.get(url, { params }).then(response => {
      resolve(response.data);
    }).catch(err => {
      reject(err);
    })
  })
}

// post
function postData(url, data, config) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, config).then(response => {
      resolve(response.data);
    }).catch(err => {
      reject(err);
    })
  })
}

//postFile
function postFile(url, param, config) {
  return new Promise((resolve, reject) => {
    axios.post(url, param, config).then(response => {
      resolve(response);
    }).catch(err => {
      reject(err);
    })
  })
}

export default {
  getData,
  postData,
  postFile
}