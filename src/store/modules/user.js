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
        const dataRes = response.obj

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
      getRouter(1).then(response => {
        response.obj.router = [{
          index: '1',
          path: '/',
          component: 'layout/index',
          alwaysShow: true,
          redirect: '/parkLotInfoManage',
          name: 'closeParkLot',
          meta: {
            title: '封闭停车场'
          },
          children: [{
            index: '1-1',
            path: 'parkLotInfoManage',
            component: 'parkLotInfoManage/index',
            name: 'parkLotInfoManage',
            meta: {
              title: '停车场信息管理', icon: 'user'
            },
            children: []
          },
          {
            index: '1-2',
            path: 'stateManagePath',
            component: 'stateManage/index',
            name: 'stateManage',
            meta: {
              title: '状态管理', icon: 'el-icon-s-help'
            },
            children: []
          },
          {
            index: '1-3',
            path: 'voiceBroadcastManagePatn',
            component: 'voiceBroadcastManage/index',
            name: 'voiceBroadcastManage',
            meta: {
              title: '语音播报管理', icon: 'user'
            },
            children: []
          }
          ]
        },
        {
          index: '2',
          path: '/',
          component: 'layout/index',
          alwaysShow: true,
          redirect: '/parkChargePath',
          name: 'accountRules',
          meta: {
            title: '计费规则'
          },
          children: [{
            index: '2-1',
            path: 'parkChargePath',
            component: 'parkCharge/index',
            name: 'parkCharge',
            meta: {
              title: '停车收费',
              icon: 'el-icon-s-help'
            },
            children: []
          }]
        }
        ]
        // 存储一级导航的index,为切换菜单做准备
        // setMenuIndex(response[0].index);
        resolve(response)
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
