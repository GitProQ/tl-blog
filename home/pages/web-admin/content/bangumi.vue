<template>
  <div class="app-container bangumi">
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
      <el-table-column label="总集数" width="180" align="center">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.total"
            controls-position="right"
            :min="0"
          />
        </template>
      </el-table-column>
      <el-table-column label="进度" width="180" align="center">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.current"
            controls-position="right"
            :min="0"
            :max="scope.row.total"
          />
        </template>
      </el-table-column>
      <el-table-column label="前台显示" width="120" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.is_show">显示</el-tag>
          <el-tag v-else type="info">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" align="center">
        <template #default="scope">
          <el-button type="success" :loading="scope.row.updateLoading" plain @click="handleUpdate(scope.row)">更新</el-button>
          <el-button type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" :loading="scope.row.deleteLoading" plain @click="handleDelete(scope.row)">删除</el-button>
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
import { UpdateContent } from '@/api/content'

export default {
  name: 'Bangumi',
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
      currentType: 'bangumi',
      list: []
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
    async handleUpdate(row) {
      const { id, total, current } = row
      this.$set(row, 'updateLoading', true)
      await UpdateContent(this.currentType, { id, total, current }).then(res => {
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
      this.$set(row, 'updateLoading', false)
    },
    handleEdit(id) {
      this.$router.push({
        name: 'ContentEdit',
        params: { id: id },
        query: { type: this.currentType }
      })
    },
    deleteSingle({ id }) {
      return DeleteList(this.currentType, [id]).then(res => {
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
      return DeleteList(this.currentType, lists).then(res => {
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
.bangumi{
  .el-image{
    display: block;
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }
}
.el-input-number--small{
  width: 100px;
  margin-right: 5px;
}
</style>
