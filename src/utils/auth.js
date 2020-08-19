import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 存储用户信息
export function setUserInfo(userInfo) {
  return Cookies.set('userInfo', userInfo)
}
// 存储一级导航类型
export function setMenuIndex(index) {
  return Cookies.set('menuTypeIndex', index)
}
// 获取一级导航类型
export function getMenuIndex() {
  return Cookies.get('menuTypeIndex')
}
