<template>
  <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="formData.username" />
    </el-form-item>
    <el-form-item label="昵称">
      <el-input v-model="formData.nickname" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="formData.email" />
    </el-form-item>
    <el-form-item label="最后登录时间">
      <el-date-picker
        v-model="formData.login_time"
        type="datetime"
        readonly
      />
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input v-model="formData.password" />
    </el-form-item>
    <el-form-item label="再次输入密码" prop="againPassword">
      <el-input v-model="formData.asginPassword" />
    </el-form-item>
    <el-form-item class="text-right">
      <el-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { UpdateAdminInfo } from '@/api/user'

export default {
  name: 'OptionsProfile',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value && value.length < 6) {
        callback(new Error('密码不能少于8位'))
      } else {
        callback()
      }
    }
    const validateAgainPassword = (rule, value, callback) => {
      if (value !== this.formData.againPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      formData: {},
      fetchLoading: false,
      rules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        email: [
          { required: true, trigger: 'blur', message: '请输入邮箱地址' },
          { type: 'email', trigger: 'change', message: '请输入正确的邮箱地址' }
        ],
        password: [{ trigger: 'blur', validator: validatePassword }],
        againPassword: [{ trigger: 'blur', validator: validateAgainPassword }]
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id
      this.fetchData()
    }
  },
  methods: {
    fetchData() {

    },
    handleSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.dialogLoading = true

        await UpdateAdminInfo(this.formData).then(res => {
          this.$message({
            type: 'success',
            message: this.isEdit ? '更新成功' : '添加成功'
          })
          this.$emit('onConfirm', true)
        }).catch(() => {
          this.$message({
            type: 'error',
            message: this.isEdit ? '更新失败' : '添加失败'
          })
        })
        this.dialogLoading = false
      })
    }
  }
}
</script>
