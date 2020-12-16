<template>
  <div v-loading="fetchLoading" class="app-container home">
    <div class="home-welcome">
      123
    </div>
    <el-row class="home-general" :gutter="30">
      <el-col :sm="24" :md="12" :lg="8">
        <div class="home-card">
          <h2 class="home-card__title">ENVIRONMENT</h2>
          <div class="home-card-body">
          <!-- <ul>
            <li>Nodejs：{{ version.nodeVersion }}</li>
            <li>V8：{{ version.v8Version }}</li>
            <li>Web Server：{{ version.platform }}</li>
            <li>Thinkjs：{{ version.thinkjsVersion }}</li>
            <li>Mysql：{{ version.mysqlVersion }}</li>
          </ul> -->
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="12" :lg="8" @click="navigateTo('Category')">
        <div class="home-card">
          <h2 class="home-card__title">CATEGORY</h2>
          <div class="home-card-body">
            <strong class="home-card-body__count">{{ count.category }}</strong>
            <p class="home-card-body__desc">描述</p>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="12" :lg="8" @click="navigateTo('Article')">
        <div class="home-card">
          <h2 class="home-card__title">ARTICLE</h2>
          <div class="home-card-body">
            <strong class="home-card-body__count">{{ count.article }}</strong>
            <p class="home-card-body__desc">描述</p>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="12" :lg="8" @click="navigateTo('Bangumi')">
        <div class="home-card">
          <h2 class="home-card__title">BANGUMI</h2>
          <div class="home-card-body">
            <strong class="home-card-body__count">{{ count.bangumi }}</strong>
            <p class="home-card-body__desc">描述</p>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="12" :lg="8" @click="navigateTo('Comment')">
        <div class="home-card">
          <h2 class="home-card__title">COMMENT</h2>
          <div class="home-card-body">
            <strong class="home-card-body__count">{{ count.comment }}</strong>
            <p class="home-card-body__desc">描述</p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { GetGeneral } from '@/api/home'

export default {
  name: 'Home',
  data() {
    return {
      generals: {},
      fetchLoading: false
    }
  },
  computed: {
    ...mapGetters(['userinfo']),
    version() {
      return this.generals.version || {}
    },
    count() {
      return this.generals.count || {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     * 获取运行环境、统计数据
     */
    async fetchData() {
      this.fetchLoading = true
      await GetGeneral().then(res => {
        this.generals = res.data
      }).catch(() => {})
      this.fetchLoading = false
    },
    /**
     * 跳转到对应名称的路由
     * @param {String} 路由名称
     */
    navigateTo(name) {
      this.$router.push({ name })
    }
  }
}
</script>

<style lang="scss" scoped>
.home{
  &-welcome{
    height: 150px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
  &-general{
    padding: 30px;
  }
  &-card {
    height: 280px;
    margin-bottom: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    &__title{
      display: inline-block;
      position: relative;
      margin: 10px 15px;
      padding-bottom: 5px;
      color: #409FEF;
      font-size: 26px;
      font-weight: normal;
      &:after{
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #409FEF;
      }
    }
    &-body{
      color: #606266;
    }
  }
}
</style>
