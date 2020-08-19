import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'AdminApi/Public/Login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'sys/user/info',
    method: 'post',
    data: {
      token
    }
  })
}

export function getRouter(id) {
  return request({
    url: '/AdminApi/Home/GetMenuJson?id=' + id,
    method: 'get'
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
