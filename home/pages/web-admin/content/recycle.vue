<template>
  <div class="app-container">
    <el-row class="app-header">
      <el-col :xs="24" :sm="12">
        <el-select v-model="listQuery.type" clearable placeholder="请选择模块" @change="handleSelect">
          <el-option label="文章模块" value="article" />
          <el-option label="追番模块" value="bangumi" />
        </el-select>
      </el-col>
      <el-col :xs="24" :sm="12" class="text-right">
        <el-button type="danger" icon="el-icon-delete" :loading="deleteLoading" @click="handleDeleteSelection">删除</el-button>
        <el-button type="success" icon="el-icon-refresh-right" :loading="restoreLoading" @click="handleRestoreSelection">还原</el-button>
      </el-col>
    </el-row>

    <el-table
      ref="multipleTable"
      v-el-height-adaptive-table="{bottomOffset: 80}"
      v-loading="listLoading"
      :data="recycleList"
      height="233"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column label="标题" prop="title" />
      <el-table-column align="center" label="所属栏目" prop="type" width="160" :formatter="formatCategory" />
      <el-table-column align="center" label="所属模块" prop="type" width="160" :formatter="formatModuleName" />
      <el-table-column align="center" label="删除时间" prop="updatetime" width="200" />
      <el-table-column align="center" label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" :loading="scope.row.restoreLoading" @click="handleRestore(scope.row)">还原</el-button>
          <el-button type="danger" plain :loading="scope.row.deleteLoading" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import elHeightAdaptiveTable from '@/directive/el-table'
import { multipleTable } from '@/mixins'
import { GetRecycleList, RestoreRecycleList, DeleteRecyleList } from '@/api/list'

export default {
  name: 'Recycle',
  components: { Pagination },
  directives: {
    elHeightAdaptiveTable
  },
  mixins: [multipleTable],
  data() {
    return {
      recycleList: [],
      restoreLoading: false
    }
  },
  computed: {
    ...mapGetters(['categorys'])
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await GetRecycleList(this.listQuery).then(res => {
        const { count, data } = res.data
        this.recycleList = data
        this.total = count
      }).catch(() => {})
      this.listLoading = false
    },
    formatCategory(row, column, cellValue) {
      const findColumn = this.categorys.find(item => item.type === cellValue)
      return findColumn ? findColumn.name : ''
    },
    /**
     * 格式化模块名称
     * @param {Number [int]} cellValue 当前行所属模块
     */
    formatModuleName(row, column, cellValue) {
      const typeEnum = {
        article: '文章模块',
        bangumi: '追番模块',
        toolkit: '小工具',
        other: '其它模块'
      }
      return typeEnum[cellValue] || ''
    },
    handleSelect() {
      this.listQuery.page = 1
      this.fetchList()
    },
    handleRestore(row) {
      const { id, type } = row
      this.$confirm('确定要还原该内容?', '提示', {
        type: 'success'
      }).then(async() => {
        this.$set(row, 'restoreLoading', true)
        await RestoreRecycleList([{ id, type }]).then(response => {
          this.$message({
            type: 'success',
            message: '还原成功'
          })
          this.calcCurrentPage(1)
          this.fetchList()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '还原失败'
          })
        })
        this.$set(row, 'restoreLoading', false)
      })
    },
    deleteSingle({ id, type }) {
      return DeleteRecyleList([{ id, type }]).then(res => {
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
      const lists = this.multipleSelection.map(item => {
        const { id, type } = item
        return { id, type }
      })
      return DeleteRecyleList(lists).then(res => {
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
    handleRestoreSelection() {
      const listCount = this.multipleSelection.length
      this.$confirm(`此操作将还原这${listCount}条内容, 是否继续?`, '提示', {
        type: 'warning'
      }).then(async() => {
        const list = this.multipleSelection.map(item => {
          const { id, type } = item
          return { id, type }
        })
        this.restoreLoading = true
        await RestoreRecycleList(list).then(response => {
          this.$message({
            type: 'success',
            message: '还原成功'
          })
          this.calcCurrentPage(listCount)
          this.fetchList()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '还原失败'
          })
        })
        this.restoreLoading = false
      })
    }
  }
}
</script>
