<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      v-el-height-adaptive-table="{bottomOffset: 142}"
      v-loading="listLoading"
      :data="commentList"
      height="233"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="评论内容" prop="content" show-overflow-tooltip />
      <el-table-column align="center" label="用户" width="150" prop="username" />
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status">已审核</el-tag>
          <el-tag v-else type="info">未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布时间" width="200">
        <template #default="scope">{{ scope.row.addtime }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" @click="handleView(scope.row.id)">查看</el-button>
          <el-button type="danger" plain :loading="scope.row.deleteLoading" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row class="app-footer">
      <el-col :xs="24" class="text-right">
        <el-dropdown @command="handleChangeStatus">
          <el-button type="warning" plain :loading="changeLoading">
            状态修改<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="unaudit">未通过</el-dropdown-item>
            <el-dropdown-item command="audit">已审核</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="danger" icon="el-icon-delete" :loading="deleteLoading" @click="handleDeleteSelection">删除选中</el-button>
      </el-col>
    </el-row>

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import elHeightAdaptiveTable from '@/directive/el-table'
import { multipleTable } from '@/mixins'
import { GetList, DeleteList, UpdateList } from '@/api/list'

export default {
  name: 'Comment',
  components: { Pagination },
  directives: {
    elHeightAdaptiveTable
  },
  mixins: [multipleTable],
  data() {
    return {
      commentList: [],
      changeLoading: true
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await GetList('comment', this.listQuery).then(res => {
        const { data, count } = res.data
        this.commentList = data
        this.total = count
      }).catch(() => {})
      this.listLoading = false
    },
    handleView(id) {
      this.$router.push({
        name: 'CommentContent',
        params: { id: id }
      })
    },
    deleteSingle({ id }) {
      DeleteList('comment', [id]).then(response => {
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
      DeleteList('comment', lists).then(response => {
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
    handleChangeStatus(command) {
      if (!this.multipleSelection.length) {
        return this.$message({
          type: 'warning',
          message: 'emmmm 你未选择任何内容'
        })
      }
      this.$confirm(`确定要更新${this.multipleSelection.length}条内容?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.changeLoading = true
        const data = this.multipleSelection.map(item => {
          const { id } = item
          return { id, is_audit: command === 'unaudit' ? 0 : 1 }
        })
        await UpdateList('comment', data).then(response => {
          this.$message({
            type: 'success',
            message: `已更新${data.length}条内容`
          })
          this.fetchList()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '更新失败'
          })
        })
        this.changeLoading = false
      })
    }
  }
}
</script>
