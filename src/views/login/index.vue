<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">运营管理平台</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-form-item label prop="captcha">
        <el-input
          v-model="loginForm.captcha"
          placeholder="验证码"
          prefix-icon="lj-icon-yanzhengma"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          style="float: left; width: 100%;"
          @keyup.enter.native="handleLogin"
        />
        <div class="captcha_code">
          <img ref="code" src @click="changeCode">
        </div>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { validUsername } from '@/utils/validate'
import { filterAsyncRouter } from '@/router/async'
import { resetRouter } from '@/router/index'

export default {
  name: 'Login',
  data() {
    // 用户名验证
    const validateUsername = (rule, value, callback) => {
      // if (!validUsername(value)) {
      //   callback(new Error("Please enter the correct user name"));
      // } else {
      //   callback();
      // }
      callback()
    }
    // 密码验证
    const validatePassword = (rule, value, callback) => {
      // if (value.length < 5) {
      //   callback(new Error("The password can not be less than 6 digits"));
      // } else {
      //   callback();
      // }
      callback()
    }
    // 验证码验证
    const validateCaptcha = (rule, value, callback) => {
      // if (value.length < 5) {
      //   callback(new Error("The password can not be less than 6 digits"));
      // } else {
      //   callback();
      // }
      callback()
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111',
        captcha: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        captcha: [
          { required: true, trigger: 'blur', validator: validateCaptcha }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      // 密码加密
      this.loginForm.encryptPassword = this.$getRsaCode(
        this.loginForm.password
      )
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(data => {
              // 调用store里user.js的login方法
              // this.$router.push({ path: this.redirect || "/" });
              // 获取权限列表
              this.getRouteList(1)
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取用户路由
    getRouteList(id) {
      var that = this
      this.$store
        .dispatch('user/getRouteListFn', id)
        .then(res => {
          // 存入state
          that.$store.commit('permission/SET_ROUTES', res.obj.router)
          // 存入缓存
          sessionStorage.setItem('state', JSON.stringify(res.obj.router))
          // 转换组件对象
          var getRouter = filterAsyncRouter(res.obj.router)
          // 清空之前的路由信息
          resetRouter()
          that.$router.addRoutes(getRouter)
          that.$router.push('/')
        })
        .catch(() => {
          this.loading = false
        })
    },
    getCaptchaKey() {
      const captchaKey = (function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
          c
        ) {
          return (c === 'x'
            ? (Math.random() * 16) | 0
            : 'r&0x3' | '0x8'
          ).toString(16)
        })
      })()
      return captchaKey
    },
    changeCode() {
      const captcha_key = this.getCaptchaKey()
      // uuid
      this.loginForm.uuid = captcha_key
      this.$refs.code.setAttribute(
        'src',
        this.$api.url.dev + '/captcha.jpg?uuid=' + captcha_key
      )
    }
  },
  mounted() {
    // this.changeCode();
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .captcha_code img {
    width: 180px;
    height: 45px;
    position: absolute;
    right: 1px;
    top: 1px;
  }
}
</style>
