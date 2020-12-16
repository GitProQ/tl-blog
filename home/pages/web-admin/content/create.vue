<template>
  <article-content :is-edit="false" :category-options="categoryOptions" :current-category="currentCategory" />
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleContent from './components/ArticleContent'
import { getCategoryByType } from '@/utils'

export default {
  name: 'ContentCreate',
  components: {
    ArticleContent
  },
  computed: {
    ...mapGetters(['categorys']),
    categoryOptions() {
      const currentType = this.$route.query.type
      const result = getCategoryByType(this.categorys, currentType)
      return result
    },
    currentCategory() {
      const category = this.$route.query && +this.$route.query.category
      return category
    }
  }
}
</script>

