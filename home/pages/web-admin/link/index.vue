<template>
  <div class="app-container links">
    <el-row class="app-header">
      <el-col :xs="24" :sm="12">
        <el-input v-model="listQuery.keyword" placeholder="请输入网站标题、地址" clearable @change="onKeywordInput" />
      </el-col>
      <el-col :xs="24" :sm="12" class="text-right">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加友链</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDeleteSelection">删除选中</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      v-el-height-adaptive-table="{bottomOffset: 80}"
      :data="linkList"
      height="233"
      border
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="Logo" width="100" align="center">
        <template #default="scope">
          <el-image class="links-list-logo" :src="scope.row.logo" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline-round" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="网站标题" prop="name" />
      <el-table-column label="网站地址">
        <template #default="scope">
          <el-link :underline="false" :href="scope.row.website" target="_blank">{{ scope.row.website }}</el-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" prop="no_order" width="60" />
      <el-table-column label="前台显示" width="120" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.is_show">显示</el-tag>
          <el-tag v-else type="info">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间" prop="addtime" width="200" />
      <el-table-column align="center" label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" plain @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchList" />

    <links-form :dialog-visible="dialogVisible" :current-id="currentId" @onConfirm="onConfirm" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import LinksForm from './components/LinksForm'
import elHeightAdaptiveTable from '@/directive/el-table'
import { multipleTable, listDialog } from '@/mixins'
import { GetList, DeleteList } from '@/api/list'

export default {
  name: 'Link',
  components: {
    Pagination,
    LinksForm
  },
  directives: {
    elHeightAdaptiveTable
  },
  mixins: [multipleTable, listDialog],
  data() {
    return {
      linkList: []
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await GetList('link', this.listQuery).then(res => {
        const { data, count } = res.data
        this.linkList = data
        this.total = count
      }).catch(() => {})
      this.listLoading = false
    },
    deleteSingle({ id }) {
      DeleteList('link', [id]).then(res => {
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
      const list = this.multipleSelection.map(item => {
        return item.id
      })
      DeleteList('link', list).then(res => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.links{
  &-list-logo{
    overflow: hidden;
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border-radius: 30px;
  }
}
</style>
