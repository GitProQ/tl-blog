<template>
  <div class="app-container">
    <el-form
      ref="form"
      v-loading="fetchLoading"
      :model="form"
      label-position="left"
      label-width="100px"
      class="form-container is-bottom"
    >
      <el-form-item class="form-title">
        App信息
      </el-form-item>
      <el-form-item label="App版本">
        <el-row>
          <el-col :xs="24" :md="12" :lg="5">
            <el-input v-model="formData.version" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="App简介">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.info" type="textarea" :rows="3" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="App图标">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item class="form-title">
        其它设置
      </el-form-item>
      <div class="stick-bottom">
        <el-button size="small" type="primary" @click="submitForm">发布</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { GetContent } from '@/api/content'

export default {
  name: 'ToolkitContent',
  data() {
    return {
      formData: {},
      imageUrl: '',
      fetchLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.fetchLoading = true
      const id = this.$route.params && this.$route.params.id
      await GetContent('toolkit', id).then(res => {
        this.formData = res.data
      }).catch(() => {})
      this.fetchLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  .is-bottom{
    margin-bottom: 75px;
  }
  .stick-bottom{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
    padding: 10px 20px;
    background-color: #fff;
    text-align: right;
    box-shadow: 0 -1px 4px rgba(0, 21, 41, 0.08);
    .el-select{
      vertical-align: middle;
      margin-right: 15px;
    }
  }
}
.avatar-uploader{
  ::v-deep .el-upload {
    overflow: hidden;
    position: relative;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    border-radius: 6px;
    &:hover {
      border-color: #409EFF;
    }
  }
  &-icon {
    width: 150px;
    height: 150px;
    color: #8c939d;
    font-size: 28px;
    line-height: 150px;
    text-align: center;
  }
}
</style>
