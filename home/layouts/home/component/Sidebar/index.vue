<template>
  <div class="aside">
    <div :class="{'aside-logo': true, 'aside-logo--collapse': isCollapse}">
      <nuxt-link to="/">
        <img class="aside-logo__img" src="/static/avatar.jpg" alt="logo">
        <p class="aside-logo__name">{{ logoTitle }}</p>
      </nuxt-link>
    </div>
    <el-scrollbar wrap-class="aside-wrap">
      <el-menu
        ref="navigation"
        background-color="#F2F6FC"
        :default-active="activeMenu"
        :collapse="isCollapse"
        class="aside-menu"
      >
        <div class="aside-item">
          <nuxt-link to="/">
            <el-menu-item index="/">
              <i class="aside-menu__icon tl-icon">&#xe76f;</i>
              <span slot="title">首页</span>
            </el-menu-item>
          </nuxt-link>
        </div>
        <sidebar-item v-for="route in menus" :key="route.path" :item="route" />
        <div class="aside-item">
          <nuxt-link to="/link">
            <el-menu-item index="/link">
              <i class="aside-menu__icon tl-icon">&#xe6f5;</i>
              <span slot="title">友情链接</span>
            </el-menu-item>
          </nuxt-link>
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: {
    SidebarItem
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'menus', 'configs']),
    logoTitle() {
      return this.configs.sitename || "Timeless's 博客"
    },
    activeMenu() {
      return this.$route.path
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
