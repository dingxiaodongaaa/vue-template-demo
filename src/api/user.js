import request from '@/utils/request'
// 登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
// 获取个人信息
export function getInfo(token) {
  return request({
    url: 'sys/user/info',
    method: 'post',
    data: {
      token
    }
  })
}
// 请求菜单
export function getRouter() {
  return request({
    url: '/sys/menu/nav/menuList',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: 'sys/logout',
    method: 'post'
  })
}
// 获取所有菜单列表
export function getAuthMenu(token) {
  return request({
    url: 'http://47.104.7.222:9822/sys/menu/nav/menuList',
    method: 'post',
    params: {
      token
    }
  })
}
