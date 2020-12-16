<template>
  <div class="app-container reading">
    <el-form
      ref="form"
      :model="formData"
      label-position="left"
      label-width="100px"
      class="form-container"
    >
      <el-form-item label="图片裁剪方式">
        <el-radio-group v-model="formData.thumb_kind">
          <el-radio label="0">填充(保留长宽比,通过裁剪/剪切以确保图像覆盖两个提供的尺寸)</el-radio>
          <el-radio label="1">包含(保留长宽比,包含两个提供的尺寸)</el-radio>
          <el-radio label="2">拉伸(忽略输入的宽高比，并拉伸到两个提供的尺寸)</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生成预览">
        <el-image
          class="reading-preview"
          src="https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg"
          :fit="fit"
        />
      </el-form-item>
      <el-form-item class="form-title">文章模块</el-form-item>
      <el-form-item label="宽度">
        <el-input v-model="formData.thumb_article_x" class="form-container-input" />
      </el-form-item>
      <el-form-item label="高度">
        <el-input v-model="formData.thumb_article_y" class="form-container-input" />
      </el-form-item>
      <el-form-item label="列表数量">
        <el-input-number v-model="formData.list_article" :min="1" controls-position="right" />
      </el-form-item>

      <el-form-item class="form-title">追番模块</el-form-item>
      <el-form-item label="宽度">
        <el-input v-model="formData.thumb_bangumi_x" class="form-container-input" />
      </el-form-item>
      <el-form-item label="高度">
        <el-input v-model="formData.thumb_bangumi_y" class="form-container-input" />
      </el-form-item>
      <el-form-item label="列表数量">
        <el-input-number v-model="formData.list_bangumi" :min="1" controls-position="right" />
      </el-form-item>
      <el-form-item class="text-right">
        <el-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'OptionsReading',
  data() {
    return {
      formData: {},
      confirmLoading: false
    }
  },
  computed: {
    ...mapGetters(['configs']),
    fit() {
      const fit = +this.formData.thumb_kind
      const fitEnum = ['cover', 'contain', 'fill']
      return fitEnum[fit] || 'none'
    }
  },
  created() {
    const { thumb_kind, thumb_article_x, thumb_article_y, thumb_bangumi_x, thumb_bangumi_y, list_article, list_bangumi } = this.configs
    this.formData = { thumb_kind, thumb_article_x, thumb_article_y, thumb_bangumi_x, thumb_bangumi_y, list_article, list_bangumi }
  },
  methods: {
    async handleSubmit() {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.reading{
  .el-radio {
    display: block;
    padding: 10px 0;
  }
  &-preview {
    width: 180px;
    height: 120px;
  }
}
</style>
