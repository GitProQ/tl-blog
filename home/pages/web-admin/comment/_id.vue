<template>
  <div v-loading="fetchLoading" class="app-container comment">
    <el-form ref="form" label-width="100px">
      <el-form-item label="昵称">
        <el-input v-model="commentForm.name" readonly />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="commentForm.email" readonly />
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker v-model="commentForm.addtime" type="datetime" readonly />
      </el-form-item>
      <el-form-item label="评论内容">
        <el-input v-model="commentForm.content" type="textarea" :rows="6" readonly />
      </el-form-item>
    </el-form>
    <div class="comment-reply">
      <Tinymce ref="editor" v-model="replyContent" :height="500" />
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { GetContent, CreateContent } from '@/api/content'

export default {
  name: 'CommentContent',
  components: {
    Tinymce
  },
  data() {
    return {
      commentForm: [],
      replyContent: '',
      fetchLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.fetchLoading = true
      const { id } = this.$route.params
      await GetContent('comment', id).then(res => {
        this.commentForm = res.data
      }).catch(() => {})
      this.fetchLoading = false
    },
    handleReplyComment() {
      const postData = {
        topic_id: this.commentForm.id,
        content: this.replyContent
      }
      CreateContent('comment', postData).then(res => {
        this.fetchData()
      })
    }
  }
}
</script>
