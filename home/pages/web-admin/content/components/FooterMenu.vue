<template>
  <el-row class="app-footer">
    <el-col :xs="24" :sm="12">
      <el-cascader
        v-model="targetCategory"
        :options="categoryOptions"
        :props="{
          checkStrictly: true,
          emitPath: false
        }"
        placeholder="请选择所移动到的栏目"
        clearable
      />
      <el-button type="warning" :loading="moveLoading" @click="handleMove">确定</el-button>
    </el-col>
    <el-col :xs="24" :sm="12" class="text-right">
      <el-dropdown @command="handleChangeStatus">
        <el-button type="warning" plain :loading="changeLoading">
          状态修改<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="show">前台显示</el-dropdown-item>
          <el-dropdown-item command="hide">前台隐藏</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="danger" icon="el-icon-delete" :loading="deleteLoading" @click="handleDeleteSelection">删除选中</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    categoryOptions: {
      type: Array,
      default: () => []
    },
    deleteLoading: {
      type: Boolean,
      default: false
    },
    multipleSelection: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      targetCategory: [],
      moveLoading: false,
      changeLoading: false
    }
  },
  methods: {
    handleDeleteSelection() {
      this.$emit('onDelateEelection')
    },
    handleMove() {
      const listCount = this.multipleSelection.length
      if (!listCount) {
        return this.$message('请先选择数据，再进行操作')
      }
      this.$confirm(`确定要将${listCount}条内容移动到该栏目`, '提示', {
        type: 'warning'
      }).then(async() => {
        const passData = this.multipleSelection.map(item => {
          const { id } = item
          return { id, category: this.targetCategory }
        })
        this.moveLoading = true
        await this.$parent.handleUpdateSelection(passData)
        this.moveLoading = false
      })
    },
    handleChangeStatus(command) {
      const listCount = this.multipleSelection.length
      if (!listCount) {
        return this.$message('请先选择数据，再进行操作')
      }
      this.$confirm(`确定要更新${listCount}条内容?`, '提示', {
        type: 'warning'
      }).then(async() => {
        const passData = this.multipleSelection.map(item => {
          const { id } = item
          return { id, is_show: command === 'hide' ? 0 : 1 }
        })
        this.changeLoading = true
        await this.$parent.handleUpdateSelection(passData)
        this.changeLoading = false
      })
    }
  }
}
</script>
