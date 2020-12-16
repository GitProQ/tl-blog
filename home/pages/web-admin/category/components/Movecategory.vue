<template>
  <el-dialog
    title="移动栏目"
    :visible="dialogVisible"
    :close-on-click-modal="false"
    width="640px"
    @open="onOpen"
    @close="handleCancel"
    @closed="onClosed"
  >
    <el-form ref="form" :model="formData" :rules="rules">
      <el-form-item label="移动到" prop="category">
        <el-cascader
          v-model="formData.category"
          :options="categoryOptions"
          :props="{
            checkStrictly: true,
            emitPath: false
          }"
          placeholder="请选择栏目"
          clearable
        />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="dialogLoading" @click="handleConfirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dialogForm } from '@/mixins'
import { getCategoryByType } from '@/utils'
import { UpdateContent } from '@/api/content'

export default {
  mixins: [dialogForm],
  props: {
    currentRow: {
      type: Object,
      default: () => {}
    },
    categorys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {},
      rules: {
        category: [{ required: true, message: '请选择栏目', trigger: 'change' }]
      }
    }
  },
  computed: {
    categoryOptions() {
      const { type } = this.currentRow
      return getCategoryByType(this.categorys, type)
    }
  },
  methods: {
    onOpen() {

    },
    handleConfirm() {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.dialogLoading = true
        const postData = {
          id: this.currentRow.id,
          category_id: this.formData.category
        }
        await UpdateContent('category', postData).then(res => {

        }).catch(() => {

        })
        this.dialogLoading = false
      })
    }
  }
}
</script>
