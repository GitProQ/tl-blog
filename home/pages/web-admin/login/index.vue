<template>
  <div class="login">
    <el-form
      ref="loginForm"
      size="large"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="left"
      @submit.native.prevent
    >
      <h1 class="login-form__title">Welcome Home</h1>
      <el-form-item prop="username">
        <span class="login-form-label">
          <i class="el-icon-user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          tabindex="1"
          auto-complete="on"
          clearable
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="login-form-label">
          <i class="el-icon-lock" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item class="login-form-captcha" prop="captcha">
        <span class="login-form-label">
          <i class="el-icon-picture-outline-round" />
        </span>
        <el-input
          ref="captcha"
          v-model="loginForm.captcha"
          placeholder="验证码"
          tabindex="3"
          clearable
          @keyup.enter.native="handleLogin"
        />
        <!-- svg图片验证码 -->
        <div v-loading="captchaLoading" class="login-form-captcha__svg" @click="fetchCaptcha" v-html="svgCaptcha" />
      </el-form-item>
      <!-- session有效期：不记录为1天，记录为15天 -->
      <el-form-item class="login-form-remember">
        <el-checkbox v-model="loginForm.remember">记住登录状态</el-checkbox>
        <router-link class="login-form-forgot" to="/forgot">忘记密码?</router-link>
      </el-form-item>
      <el-button class="login-form-submit" :loading="loginLoading" type="primary" size="large" native-type="submit" @click="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { GetCaptcha } from '@/api/common'

export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value.length > 20) {
        callback(new Error('请输入6-20位密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        remember: true
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      svgCaptcha: '',
      loginLoading: false,
      captchaLoading: false,
      passwordType: 'password'
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
  created() {
    this.fetchCaptcha()
  },
  methods: {
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 请求接口svg图片验证码
    async fetchCaptcha() {
      this.loginForm.captcha = ''
      // SVG二维码参数
      const svgOptions = {
        width: 150,
        height: 38,
        fontSize: 36
      }
      this.captchaLoading = true
      await GetCaptcha(svgOptions).then(response => {
        this.svgCaptcha = response.data
      }).catch(() => {})
      this.captchaLoading = false
    },
    handleLogin() {
      this.$refs.loginForm.validate(async(valid) => {
        if (valid) {
          this.loginLoading = true
          await this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {})
          this.loginLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  position: relative;
  width: 100%;
  height: 100%;
  background: url(~@/assets/login-background.svg) no-repeat center;
  background-size: cover;
  &-form{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 380px;
    height: 350px;
    margin-top: -210px;
    margin-left: -190px;
    @media (max-width: 576px){
      width: 100%;
      padding: 0 20px;
      left: 0;
      margin-left: 0;
    }
    .el-input{
      ::v-deep input{
        padding-left: 40px;
        &:focus{
          border-color: #409EFF;
        }
      }
    }
    &__title{
      height: 50px;
      margin-bottom: 30px;
      color: #606266;
      font: normal 32px/50px eafont,Hiragino Sans GB,Hiragino Sans GB W3,Microsoft YaHei;
      text-align: center;
    }
    &-label{
      position: absolute;
      left: 0;
      top: 0;
      z-index: 5;
      width: 40px;
      color: #909399;
      font-size: 24px;
      text-align: center;
    }
    &-captcha{
      ::v-deep .el-input{
        &__inner{
          padding-right: 180px;
        }
        &__suffix {
          right: 155px;
        }
      }
      &__svg{
        overflow: hidden;
        position: absolute;
        right: 1px;
        top: 1px;
        width: 150px;
        height: 38px;
        border-left: 1px solid #DCDFE6;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        cursor: pointer;
      }
    }
    &-remember{
      position: relative;
      ::v-deep .el-form-item__content{
        line-height: 19px;
      }
    }
    &-forgot{
      position: absolute;
      right: 0;
      color: #606266;
      &:hover{
        color: #409EFF;
      }
    }
    &-submit{
      width: 100%;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 0;
    color: #909399;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
  }
}
</style>
