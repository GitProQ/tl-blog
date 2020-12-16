<template>
  <div class="app-container blog">
    <header-menu
      :category-options="categoryOptions"
      :current-type="currentType"
      @onSearchKeyword="handleSearchTitle"
      @onColumnChange="handleChangeColumn"
    />
    <el-table
      ref="multipleTable"
      v-el-height-adaptive-table="{bottomOffset: 142}"
      v-loading="listLoading"
      :data="list"
      height="233"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="图片" width="150" align="center">
        <template #default="scope">
          <el-image :src="scope.row.imgurl" fit="contain" lazy scroll-container=".el-table__body-wrapper">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline-round" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" />
      <el-table-column label="访问量" prop="hits" width="100" align="center" />
      <el-table-column class-name="status-col" label="前台展示" width="120" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.is_show">显示</el-tag>
          <el-tag v-else type="info">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="200" prop="updatetime" align="center" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" plain :loading="scope.row.deleteLoading" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <footer-menu
      :category-options="categoryOptions"
      :delete-loading="deleteLoading"
      :multiple-selection="multipleSelection"
    />

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HeaderMenu from './components/HeaderMenu'
import FooterMenu from './components/FooterMenu'
import Pagination from '@/components/Pagination'
import elHeightAdaptiveTable from '@/directive/el-table'
import { multipleTable } from '@/mixins'
import { getCategoryByType } from '@/utils'
import { GetList, DeleteList, UpdateList } from '@/api/list'

export default {
  name: 'Article',
  components: {
    HeaderMenu,
    FooterMenu,
    Pagination
  },
  directives: {
    elHeightAdaptiveTable
  },
  mixins: [multipleTable],
  data() {
    return {
      currentType: 'article',
      list: null
    }
  },
  computed: {
    ...mapGetters(['categorys', 'updateRoute']),
    categoryOptions() {
      const result = getCategoryByType(this.categorys, this.currentType)
      return result
    }
  },
  watch: {
    async updateRoute(val) {
      if (val === this.currentType) {
        await this.fetchList()
        this.$store.commit('list/SET_UPDATELIST', '')
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await GetList(this.currentType, this.listQuery).then(res => {
        const { data, count } = res.data
        this.list = data
        this.total = count
      }).catch(() => {})
      this.listLoading = false
    },
    handleEdit(id) {
      this.$router.push({
        name: 'ContentEdit',
        params: { id: id },
        query: { type: this.currentType }
      })
    },
    deleteSingle({ id }) {
      DeleteList(this.currentType, [id]).then(response => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.calcCurrentPage(1)
        this.fetchList()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      })
    },
    deleteSelection(listCount) {
      const lists = this.multipleSelection.map(item => item.id)
      DeleteList(this.currentType, lists).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.calcCurrentPage(listCount)
        this.fetchList()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      })
    },
    handleUpdateSelection(data) {
      return UpdateList(this.currentType, data).then(res => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.fetchList()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '更新失败'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.blog{
  .el-image{
    display: block;
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }
}
</style>
