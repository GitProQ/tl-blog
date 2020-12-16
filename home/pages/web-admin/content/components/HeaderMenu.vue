<template>
  <el-row class="app-header">
    <el-col :xs="24" :sm="12">
      <el-cascader
        v-model="selectedCategory"
        class="app-header-select"
        :options="categoryOptions"
        :props="{
          checkStrictly: true,
          emitPath: false
        }"
        placeholder="请选择栏目"
        clearable
        @change="onColumnChange"
      />
      <el-input
        v-model="keyword"
        placeholder="请输入关键字"
        clearable
        style="width:220px"
        @input="handleSearch"
      >
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
    </el-col>
    <el-col :xs="24" :sm="12" class="text-right">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加内容</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { debounce } from 'lodash-es'

export default {
  props: {
    categoryOptions: {
      type: Array,
      default: () => []
    },
    currentType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keyword: '',
      selectedCategory: null
    }
  },
  methods: {
    handleAdd() {
      this.$router.push({
        name: 'ContentCreate',
        query: { type: this.currentType, category: this.selectedCategory }
      })
    },
    onColumnChange() {
      this.$emit('onColumnChange', {
        category: this.selectedCategory
      })
    },
    handleSearch: debounce(function() {
      this.$emit('onSearchKeyword', this.keyword)
    }, 500)
  }
}
</script>
