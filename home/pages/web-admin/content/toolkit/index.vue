<template>
  <div v-loading="listLoading" class="app-container webapp">
    <el-row :gutter="40" class="webapp-group">
      <el-col
        v-for="item in appList"
        :key="item.id"
        :xs="12"
        :sm="12"
        :lg="6"
        class="webapp-group-col"
      >
        <div class="webapp-group-item" @click="handleEdit(item.id)">
          <div class="webapp-group-img">
            <img :src="item.columnimg">
          </div>
          <div class="webapp-group-description">
            <p class="webapp-group__name">{{ item.name }}</p>
            <p class="webapp-gropu__info">{{ item.info }}</p>
            <p class="webapp-group__version">{{ item.version }}</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { GetList } from '@/api/list'

export default {
  name: 'Toolkit',
  data() {
    return {
      currentType: 'toolkit',
      appList: [],
      listLoading: false
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.listLoading = true
      await GetList(this.currentType).then(response => {
        const { data } = response
        this.appList = data
      }).catch(() => {})
      this.listLoading = false
    },
    handleEdit(id) {
      this.$router.push({
        name: 'AppContent',
        params: { id }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.webapp{
  &-group{
    &-col{
      margin-bottom: 30px;
    }
    &-item{
      overflow: hidden;
      position: relative;
      border-color: 1px solid #EBEEF5;
      background: #fff;
      color: #606266;
      font-size: 12px;
      box-shadow: 0 1px 5px rgba(0, 21, 41, 0.08);
      border-radius: 5px;
    }
    &-img {
      float: left;
      width: 50%;
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease-out;
      border-radius: 5px;
      img{
        width: 80%;
      }
    }
    &-description {
      float: left;
      width: 50%;
      padding: 20px;
      text-align: center;
    }
    &__name {
      padding: 15px 0 10px;
      color: #303133;
      font-size: 16px;
    }
    &__info{
      padding-bottom: 10px;
      color: #606266;
      font-size: 14px;
    }
    &__version {
      color: #909399;
      font-size: 14px;
    }
  }
}
</style>
