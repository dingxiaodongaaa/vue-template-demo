import router from './router'
// eslint-disable-next-line no-unused-vars
import store from './store'
import {
  // eslint-disable-next-line no-unused-vars
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
// import { replace } from 'core-js/fn/symbol'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // 白名单

// 路由守卫
router.beforeEach(async(to, from, next) => {
  // to: Route: 即将要进入的目标路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。 执行效果依赖 next 方法的调用参数
  // 进度条开始
  NProgress.start()
  // 根据路由元信息设置页面标题
  document.title = getPageTitle(to.meta.title)
  // 确定用户是否已登录
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      next()
      // 不需要权限校验 暂时去掉
      // const hasGetUserInfo = store.getters.name
      // if (hasGetUserInfo) {
      //   next()
      // } else {
      //   try {
      //     // 获取用户信息
      //     // 权限列表必须是一个数组 例如: ['admin'] 或者 ['developer','editor']
      //     const {
      //       roles
      //     } = await store.dispatch('user/getInfo')
      //     const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
      //     router.addRoutes(accessRoutes)

      //     next({
      //       ...to,
      //       replace: true // 设置replace:true，这样导航就不会留下历史记录
      //     })
      //   } catch (error) {
      //     // 删除 token 并转到登录页面重新登录
      //     await store.dispatch('user/resetToken')
      //     Message.error(error || 'Has Error')
      //     next(`/login?redirect=${to.path}`)
      //     NProgress.done()
      //   }
      // }
    }
  } else {
    /* 没有 token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接进入
      next()
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面.
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
