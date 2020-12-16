<template>
  <category-content :is-edit="true" />
</template>

<script>
import CategoryContent from './components/CategoryContent'

export default {
  name: 'CategoryEdit',
  components: { CategoryContent }
}
</script>
