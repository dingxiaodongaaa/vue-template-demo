import {
  login,
  logout,
  getRouter,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  setUserInfo,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'
import { data } from 'autoprefixer'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // 登录请求
  login({
    commit
  }, userInfo) {
    // const { username, password, } = userInfo
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const dataRes = response.data

        commit('SET_TOKEN', dataRes.token)
        setToken(dataRes.token)
        setUserInfo(response.user)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {
          data
        } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const {
          name
        } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户路由
  getRouteListFn({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getRouter().then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出系统
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        // 清除缓存的路由
        sessionStorage.removeItem('state')
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
