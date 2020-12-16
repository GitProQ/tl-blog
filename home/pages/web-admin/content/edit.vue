<template>
  <article-content
    :is-edit="true"
    :categorys="categorys"
    :category-options="categoryOptions"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleContent from './components/ArticleContent'
import { getCategoryByType } from '@/utils/index'

export default {
  name: 'ContentEdit',
  components: {
    ArticleContent
  },
  computed: {
    ...mapGetters(['categorys']),
    categoryOptions() {
      const currentType = this.$route.query.type
      const result = getCategoryByType(this.categorys, currentType)
      return result
    }
  }
}
</script>

