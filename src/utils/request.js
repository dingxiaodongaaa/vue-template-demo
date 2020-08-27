import axios from 'axios' // 请求数据
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store' // 引入 vuex 里面的数据
import {
  getToken
} from '@/utils/auth' // 使用 js-cookie 来存、取、删Token

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // api的base_url  url = base url + request url
  // withCredentials: true, // 是否允许带 cookies 这些
  timeout: 5000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做什么
    if (store.getters.token) {
      // 让请求携带token，['X-Token'] 是自定义key，请根据实际情况自行修改
      // config.headers['X-Token'] = getToken();
      // 临时设置一个登陆token
      config.headers['x-access-token'] = getToken()
    }
    return config
  },
  error => {
    // 对请求错误作出处理
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(

  response => {
    const res = response.data

    if (res.code !== '8888') {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
