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

    <el-form ref="form" v-loading="fetchLoading" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="网站标题" prop="webname">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="网站地址" prop="weburl">
        <el-input v-model="formData.website" />
      </el-form-item>
      <el-form-item label="网站logo" prop="weblogo">
        <el-input v-model="formData.logo" />
      </el-form-item>
      <el-form-item label="网站描述">
        <el-input v-model="formData.description" type="textarea" rows="3" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="formData.no_order" controls-position="right" />
      </el-form-item>
      <el-form-item label="状态修改">
        <el-select v-model="formData.is_show">
          <el-option label="前台隐藏" :value="0" />
          <el-option label="前台显示" :value="1" />
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="dialogLoading" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dialogForm } from '@/mixins'
import { GetContent, CreateContent, UpdateContent } from '@/api/content'

export default {
  mixins: [dialogForm],
  props: {
    currentId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formData: {},
      fetchLoading: false,
      rules: {
        webname: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
        weburl: [
          { required: true, message: '请输入网站地址', trigger: 'blur' },
          { type: 'url', message: '请输入正确的地址', trigger: 'change' }
        ],
        weblogo: [{ type: 'url', message: '请输入正确的地址', trigger: 'change' }]
      }
    }
  },
  methods: {
    onOpen() {
      this.formData = {
        is_show: 1
      }
      this.dialogTitle = this.currentId ? '编辑友链' : '添加友链'
      this.currentId && this.fetchData()
    },
    async fetchData() {
      this.fetchLoading = true
      await GetContent('link', this.currentId).then(res => {
        this.formData = res.data
      }).catch(() => {})
      this.fetchLoading = false
    },
    handleConfirm() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.dialogLoading = true

        const SubmitHandler = this.currentId ? UpdateContent : CreateContent
        await SubmitHandler(this.formData).then(res => {
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
