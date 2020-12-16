<template>
  <div class="info">
    <el-form
      ref="form"
      :model="formData"
      label-position="left"
      label-width="100px"
      class="form-container"
    >
      <el-form-item label="网站名称">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.sitename" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="网站关键词">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.keywords" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">多个关键词请用竖线|隔开，建议3到4个关键词。</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="网站描述">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.description" type="textarea" :rows="5" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span style="margin-left:15px;">网站描述建议80到120个字符。</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="标题格式">
        <el-radio-group v-model="formData.seo_title_type">
          <el-radio label="1">内容标题</el-radio>
          <el-radio label="2">内容标题 + 网站关键词</el-radio>
          <el-radio label="3">内容标题 + 网站名称</el-radio>
          <el-radio label="4">内容标题 + 网站关键词 + 网站名称</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="网站logo">
        <upload-image :file-list="formData.weblogo" />
      </el-form-item>
      <el-form-item label="工信备案">
        <el-input v-model="formData.icp_beian" />
      </el-form-item>
      <el-form-item label="公网安备">
        <el-input v-model="formData.police_beian" />
      </el-form-item>
      <el-form-item label="沉寂模式">
        <el-switch v-model="formData.is_silent " />
      </el-form-item>
      <el-form-item label="Live2d模型">
        <el-input v-model="formData.live2d_model" />
      </el-form-item>
      <el-form-item label="Live2d材质">
        <el-input v-model="formData.live2d_texture" />
      </el-form-item>
      <el-form-item class="text-right">
        <el-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import UploadImage from '@/components/Upload/index'

export default {
  components: {
    UploadImage
  },
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
    const { sitename, siteurl, keywords, description, seo_title_type, logo, icp_beian, police_beian, live2d_model, live2d_texture } = this.configs
    this.formData = { sitename, siteurl, keywords, description, seo_title_type, logo, icp_beian, police_beian, live2d_model, live2d_texture }
  },
  methods: {
    async handleSubmit() {
      this.confirmLoading = true
      await this.$store.dispatch('config/updateConfigs', this.form).then(() => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.info{
  .el-radio{
    display: block;
    padding: 10px 0;
  }
}
</style>
