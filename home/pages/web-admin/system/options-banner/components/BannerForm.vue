<template>
  <el-dialog
    :title="dialogTitle"
    :visible="dialogVisible"
    :close-on-click-modal="false"
    width="640px"
    @open="onOpen"
    @close="handleCancel"
    @closed="onClosed"
  >

    <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="图片">
        <upload-image :file-list.sync="fileList" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="dialogLoading" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import UploadImage from '@/components/Upload/index'
import { dialogForm } from '@/mixins'
import { GetContent, CreateContent, UpdateContent } from '@/api/content'
import { getPathName } from '@/utils'

export default {
  components: {
    UploadImage
  },
  mixins: [dialogForm],
  props: {
    currentId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialogTitle: '',
      formData: {},
      fileList: [],
      fetchLoading: false,
      rules: {

      }
    }
  },
  methods: {
    onOpen() {
      if (this.currentId) {
        this.dialogTitle = '修改Banner'
        this.fetchData()
      } else {
        this.dialogTitle = '添加Banner'
      }
    },
    async fetchData() {
      this.fetchLoading = true
      await GetContent('banner', this.currentId).then(res => {
        const { imgurl } = res.data
        this.formData = res.data
        if (imgurl) {
          const { basename } = getPathName(imgurl)
          this.fileList = [{
            name: basename,
            url: imgurl
          }]
        }
      }).catch(() => {})
      this.fetchLoading = false
    },
    handleConfirm() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.dialogLoading = true

        const postData = {
          ...this.formData,
          ...{
            imgurl: this.fileList.length ? this.fileList[0].url : ''
          }
        }

        const SubmitHandler = this.currentId ? UpdateContent : CreateContent
        await SubmitHandler(postData).then(res => {
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
