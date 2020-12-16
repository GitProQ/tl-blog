<template>
  <div class="forgot">
    <div class="forgot-background">
      <ul>
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
        <li />
      </ul>
    </div>

    <div class="forgot-header">
      <el-row>
        <el-col :span="12">
          <h2 class="forgot-header__title">找回密码</h2>
        </el-col>
        <el-col :span="12" class="text-right">
          <router-link to="/login" class="forgot-header-link">
            <span>返回登录</span>
            <i class="el-icon-right" />
          </router-link>
        </el-col>
      </el-row>
    </div>

    <div class="forgot-form">
      <template v-if="!isVerify">
        <el-form ref="checkForm" :model="checkForm" size="large" :rules="checkRules">
          <!-- 邮箱地址 -->
          <el-form-item prop="email">
            <span class="forgot-form__icon el-icon-message" />
            <el-input v-model="checkForm.email" placeholder="请输入邮箱地址" />
          </el-form-item>
          <el-form-item>
            <el-button class="forgot-form__sumbit" type="primary" :loading="codeLoading" @click="getEmailCode">找回密码</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-else>
        <el-form ref="resetForm" :model="resetForm" size="large" :rules="passwordRules">
          <!-- 邮件验证码 -->
          <el-form-item class="forgot-form-sms" prop="resetCode">
            <span class="forgot-form__icon el-icon-picture-outline-round" />
            <el-input v-model="resetForm.resetCode" placeholder="请输入邮件验证码" />
          </el-form-item>
          <!-- 新密码 -->
          <el-form-item prop="password">
            <span class="forgot-form__icon password">
              <i class="el-icon-lock" />
            </span>
            <el-input v-model="resetForm.password" type="password" placeholder="请输入新密码" />
          </el-form-item>
          <!-- 重新输入密码 -->
          <el-form-item prop="againPassword">
            <span class="forgot-form__icon password">
              <i class="el-icon-lock" />
            </span>
            <el-input v-model="resetForm.againPassword" type="password" placeholder="请再次输入新密码" />
          </el-form-item>
          <el-form-item>
            <el-button class="forgot-form__sumbit" type="primary" :loading="resetLoading" @click="resetPassword">重置密码</el-button>
          </el-form-item>
        </el-form>
      </template>
    </div>
  </div>
</template>

<script>
import { ForgotPassword, ResetPassword } from '@/api/user'

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value.length > 20) {
        callback(new Error('请输入6-20位密码'))
      } else {
        callback()
      }
    }
    const validateAgainPsw = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.password) {
        // 2次输入密码不一致
        callback(new Error('2次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      checkForm: {},
      resetForm: {},
      isVerify: false,
      codeLoading: false,
      resetLoading: false,
      checkRules: {
        email: [
          { required: true, trigger: 'blur', message: '请输入邮箱地址' },
          { type: 'email', trigger: 'change', message: '请输入正确的邮箱地址' }
        ]
      },
      resetRules: {
        resetCode: [{ required: true, trigger: 'blur', message: '请输入邮件验证码' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        againPassword: [{ required: true, trigger: 'blur', validator: validateAgainPsw }]
      }
    }
  },
  methods: {
    getEmailCode() {
      this.$refs.forgotForm.validate(async(valid) => {
        if (!valid) return
        this.codeLoading = true
        const { email } = this.forgotForm
        await ForgotPassword(email).then(res => {
          this.$message({
            message: '密码重置邮件已发送到：' + email,
            type: 'success'
          })
          this.isVerify = true
        }).catch(() => {})
        this.codeLoading = false
      })
    },
    resetPassword() {
      this.$refs.forgotForm.validate(async(valid) => {
        if (!valid) return
        this.resetLoading = true
        await ResetPassword(this.resetForm).then(res => {
          this.$message({
            message: '密码重置成功，请使用新密码登录',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push({ path: '/login' })
          }, 1000)
        })
        this.resetLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.forgot{
  position: relative;
  height: 100%;
  &-background{
    overflow: hidden;
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    li {
      display: block;
      position: absolute;
      bottom: -160px;
      width: 40px;
      height: 40px;
      background-color: rgba($color: #409EFF, $alpha: 0.2);
      list-style: none;
      animation: square 25s infinite;
      transition-timing-function: linear;
      &:nth-child(1) {
        left: 10%;
      }
      &:nth-child(2) {
        left: 20%;
        width: 80px;
        height: 80px;
        animation-delay: 2s;
        animation-duration: 17s;
      }
      &:nth-child(3) {
        left: 25%;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        background-color: rgba($color: #409EFF, $alpha: 0.3);
        animation-duration: 22s;
      }
      &:nth-child(5) {
        left: 70%;
      }
      &:nth-child(6) {
        left: 80%;
        width: 120px;
        height: 120px;
        background-color: rgba($color: #409EFF, $alpha: 0.25);
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 32%;
        width: 160px;
        height: 160px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 55%;
        width: 20px;
        height: 20px;
        animation-delay: 15s;
        animation-duration: 40s;
      }
      &:nth-child(9) {
        left: 25%;
        width: 10px;
        height: 10px;
        background-color: rgba($color: #409EFF, $alpha: 0.35);
        animation-delay: 2s;
        animation-duration: 40s;
      }
      &:nth-child(10) {
        left: 90%;
        width: 160px;
        height: 160px;
        animation-delay: 11s;
      }
    }
  }
  &-header{
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    &__title{
      color: #409EFF;
      font-size: 30px;
      font-weight: normal;
    }
    &-link{
      color: #303133;
      span{
        padding-right: 5px;
      }
      &:hover{
        color: #409EFF;
      }
    }
  }
  &-form{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 380px;
    margin-top: -100px;
    margin-left: -190px;
    @media (max-width: 576px){
      width: 100%;
      padding: 0 20px;
      left: 0;
      margin-left: 0;
    }
    &__icon{
      position: absolute;
      left: 1px;
      top: 0;
      z-index: 5;
      line-height: 40px;
      font-size: 22px;
      color: #909399;
      padding: 0 6px;
      &.phone, &.password{
        font-size: 20px;
      }
    }
    .el-input{
      ::v-deep &__inner{
        padding: 0 15px 0 35px;
      }
    }
    &-captcha{
      .el-input{
        width: calc(100% - 160px)
      }
      #captcha{
        width: 150px;
        height: 36px;
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;
        border-radius: 4px;
        overflow: hidden;
        user-select: none;
      }
    }
    &-sms{
      .el-input{
        width: calc(100% - 160px)
      }
      &__button{
        width: 150px;
        position: absolute;
        right: 0;
      }
    }
    &__sumbit{
      width: 100%;
    }
  }
}
@keyframes square {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-800px) rotate(600deg);
    opacity: 0;
  }
}
</style>
