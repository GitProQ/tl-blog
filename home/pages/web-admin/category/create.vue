<template>
  <category-content :is-edit="false" />
</template>

<script>
import CategoryContent from './components/CategoryContent'

export default {
  name: 'CategoryCreate',
  components: { CategoryContent }
}
</script>
