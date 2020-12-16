<template>
  <div class="app-container general">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="网站信息" name="info">
        <info :configs="configs" />
      </el-tab-pane>
      <el-tab-pane label="邮箱设置" name="email">
        <email :configs="configs" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Info from './components/Info'
import Email from './components/Email'

export default {
  name: 'OptionsGeneral',
  components: {
    Info,
    Email
  },
  data() {
    return {
      activeName: 'info'
    }
  },
  computed: {
    ...mapGetters(['configs'])
  }
}
</script>

<style lang="scss" scoped>
.general{
  ::v-deep .el-tabs {
    &__header{
      margin-bottom: 0;
    }
    &__content{
      margin-top: -1px;
    }
  }
}
</style>

