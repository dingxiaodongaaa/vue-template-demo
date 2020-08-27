import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
// import JSEncrypt from 'jsencrypt'
import {
  filterAsyncRouter
} from '@/router/async'

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.config.productionTip = false
// 登录密码加密，暂时不需要加密，屏蔽
// Vue.prototype.$getRsaCode = function(str) { // 注册方法
//   const pubKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCEN0fhvEUjq8xoh4E7utJc/Drm2ZUoQNM/BGYBgkWBnlSOYdvs/5C5nUcwqQiC5tEFnqDoEYvUqPL5kZf6sL21SOlQKIFuPCcq14XgWatg5fSy3Gq2YZ2IUN+ARxPrdPVcAZTRdJCoOhSTED8lqLOOabZd0orai33wbM+NW0BVWQIDAQAB` // ES6 模板字符串 引用 rsa 公钥
//   const encryptStr = new JSEncrypt()
//   encryptStr.setPublicKey(pubKey) // 设置 加密公钥
//   const data = encryptStr.encrypt(str.toString()) // 进行加密
//   return data
// }

new Vue({
  router,
  store,
  mounted() {
    // 存入state
    this.$store.commit('permission/SET_ROUTES', JSON.parse(sessionStorage.getItem('state')))
    // 缓存的路由信息
    const routes = JSON.parse(sessionStorage.getItem('state'))
    if (routes === null) return
    // 判断当前路由是否被清除
    // eslint-disable-next-line eqeqeq
    const hasRoute = this.$router.options.routes.some(r => r.name == 'index')
    // 如果 缓存中有路由信息 并且 当前路由被清除
    if (routes.length && !hasRoute) {
      // 获取路由Json字符串
      var getRouter = filterAsyncRouter(routes)
      // 再次添加路由信息
      this.$router.addRoutes(getRouter)
      // 然后强制更新当前组件
      this.$forceUpdate()
      // 设置 user 图片
      this.$store.commit('user/SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
    }
  },
  render: h => h(App)
}).$mount('#app')
