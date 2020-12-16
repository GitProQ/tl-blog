<template>
  <div class="app-container">
    <el-form
      ref="postForm"
      v-loading="fetchLoading"
      :model="form"
      label-position="left"
      label-width="100px"
      class="form-container"
    >
      <el-form-item class="form-title">基本信息</el-form-item>
      <el-form-item label="栏目名称" prop="name">
        <el-input v-model="formData.name" class="form-container-input" />
      </el-form-item>
      <template v-if="!isEdit">
        <el-form-item label="所属栏目">
          <el-cascader
            v-model="formData.column"
            :options="categoryOptions"
            :props="{ checkStrictly: true }"
            placeholder="请选择栏目"
            clearable
          />
        </el-form-item>
      </template>
      <el-form-item label="同级栏目排序">
        <el-input-number v-model="formData.no_order" controls-position="right" :min="0" />
        <span class="form-container-tips">数值越小越靠前</span>
      </el-form-item>
      <el-form-item label="导航栏显示">
        <el-radio-group v-model="formData.is_nav">
          <el-radio :label="0">不显示</el-radio>
          <el-radio :label="1">显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="列表排序">
        <el-select v-model="formData.list_order" placeholder="请选择">
          <el-option label="更新时间" value="1" />
          <el-option label="发布时间" value="2" />
          <el-option label="点击次数" value="3" />
          <el-option label="ID倒序" value="4" />
          <el-option label="ID顺序" value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="前台显示">
        <el-radio-group v-model="formData.is_show">
          <el-radio :label="0">不显示</el-radio>
          <el-radio :label="1">显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="form-title">
        SEO信息
      </el-form-item>
      <el-form-item label="栏目标题">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.title" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span class="form-container-tips">为空则使用SEO参数设置中设置的title构成方式</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="关键词">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.keywords" type="textarea" :rows="3" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span class="form-container-tips">多个关键词请用"|"隔开</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="简短描述">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.description" type="textarea" :rows="5" />
          </el-col>
          <el-col :xs="24" :md="12">
            <span class="form-container-tips">描述一般不超过120个字</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="form-title">
        其它设置
      </el-form-item>
      <el-form-item label="栏目修饰名称">
        <el-row>
          <el-col :xs="24" :md="12">
            <el-input v-model="formData.mark_name" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="栏目图标">
        <el-input v-model="formData.icon" />
      </el-form-item>
      <el-form-item label="栏目内容">
        <Tinymce ref="editor" v-model="formData.content" :height="350" />
      </el-form-item>
      <el-form-item class="text-right">
        <el-button type="primary" plain @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tinymce from '@/components/Tinymce'
import { GetContent, CreateContent, UpdateContent } from '@/api/content'
import { getCategoryByType } from '@/utils'

export default {
  components: {
    Tinymce
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        is_show: 1,
        is_nav: 1,
        list_order: 1
      },
      fetchLoading: false,
      confirmLoading: false,
      rules: {
        name: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['categorys']),
    categoryOptions() {
      const currentType = this.$route.query.type
      const result = getCategoryByType(this.categorys, currentType)
      return result
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
      this.formData.id = id
    }
  },
  methods: {
    async fetchData(id) {
      this.fetchLoading = true
      await GetContent('category', id).then(response => {
        const { data } = response
        this.formData = data
      }).catch(() => {})
      this.fetchLoading = false
    },
    handleSubmit() {
      this.$refs.postformData.validate(async(valid) => {
        if (valid) {
          this.confirmLoading = true

          const SubmitHander = this.isEdit ? UpdateContent : CreateContent
          await SubmitHander('category', this.formData).then(res => {
            this.$message({
              type: 'success',
              message: this.isEdit ? '更新栏目成功' : '添加栏目成功'
            })
            this.$store.commit('list/SET_UPDATELIST', 'Category')
            this.handleCancel()
          }).catch(() => {
            this.$message({
              type: 'error',
              message: this.isEdit ? '更新栏目失败' : '添加栏目失败'
            })
          })
          this.confirmLoading = false
        }
      })
    },
    /**
     * 返回列表页
     */
    handleCancel() {
      const { path } = this.$route
      this.$store.dispatch('tagsView/delView', { path }).then(() => {
        this.$router.push({ name: 'Category' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container{
  &-tips{
    margin-left: 15px;
  }
}
</style>
