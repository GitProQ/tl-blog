<template>
  <div class="web-info">
    <el-form
      ref="form"
      :model="formData"
      label-position="left"
      label-width="100px"
      class="form-container"
    >
      <el-form-item>
        发件箱设置（站内所有邮件均由此邮箱发送，如会员密码找回邮件等）
      </el-form-item>
      <el-form-item label="发件人">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.email_person" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">所显示的发件人名称</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="邮箱账号">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.email_username" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">用于发送邮件的邮箱账号</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="邮箱Auth">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.email_auth" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">用于发送邮件的邮箱Auth码，一般不用邮箱登录密码</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="邮箱主机">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.email_host" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">如QQ邮箱为smtp.qq.com</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="发送端口">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.email_port" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">用于邮件发送端口（TLS一般为25，SSL一般为465）</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="发送方式">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-radio v-model="formData.email_way" label="1">SSL服务方式</el-radio>
            <el-radio v-model="formData.email_way" label="0">TLS服务方式</el-radio>
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">SSL方式465端口发件,TLS方式为其它端口</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="text-right">
        <el-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    configs: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {},
      confirmLoading: false
    }
  },
  created() {
    const { email_person, email_username, email_auth, email_host, email_port, email_way } = this.configs
    this.formData = { email_person, email_username, email_auth, email_host, email_port, email_way }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        await this.$store.dispatch('config/updateConfigs', this.formData).then(() => {
          this.$message({
            type: 'success',
            message: '更新成功'
          })
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '更新失败'
          })
        })
        this.confirmLoading = false
      })
    }
  }
}
</script>
