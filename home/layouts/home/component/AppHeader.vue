<template>
  <div class="header">
    <div class="header-logo hidden-sm-and-up">
      <img class="header-logo__avatar" src="/static/avatar.jpg" alt="logo">
    </div>
    <div class="header-menus">
      <span class="hidden-sm-and-down">
        <el-tooltip effect="dark" content="RSS" placement="bottom">
          <a class="header-menus__btn tl-icon" href="/rss" target="_blank">&#xe6d0;</a>
        </el-tooltip>
      </span>
      <el-tooltip effect="dark" content="站内搜索" placement="bottom">
        <i class="header-menus__btn el-icon-search" @click="handleShowSearch" />
      </el-tooltip>
      <el-tooltip effect="dark" content="侧边菜单" placement="bottom">
        <i class="header-menus__btn tl-icon" @click="toggleSidebar">&#xe6ee;</i>
      </el-tooltip>
    </div>

    <el-drawer
      title="站内搜索"
      custom-class="search-drawer"
      :visible.sync="searchVisible"
      direction="ttb"
      :append-to-body="true"
    >
      <div class="search">
        <div class="container">
          <div class="search-wrap clearfix">
            <el-select v-model="type" size="large" class="search-classify">
              <el-option label="全部" value="" />
              <el-option label="文章" value="article" />
              <el-option label="番剧" value="bangumi" />
            </el-select>
            <el-input ref="searchKeyword" v-model="keyword" class="search-input" size="large" placeholder="请输入关键字" />
            <span class="el-icon-search search__button" @click="handleSearch" />
          </div>
          <div class="search-hot">
            <p class="search-hot-header">
              <i class="tl-icon search-hot__icon">&#xe6e1;</i>
              <strong class="search-hot__title">热门推荐：</strong>
            </p>
            <a class="search-hot__link" @click="handleGoToLink('web前端')">web前端</a>
            <a class="search-hot__link" @click="handleGoToLink('二次元')">二次元</a>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchVisible: false,
      type: '',
      keyword: ''
    }
  },
  methods: {
    handleShowSearch() {
      this.searchVisible = true
      setTimeout(() => {
        this.$refs.searchKeyword.focus()
      }, 0)
    },
    toggleSidebar() {
      this.$store.dispatch('tools/toggleSideBar')
    },
    handleSearch() {
      this.$router.push({
        name: 'search',
        query: { keyword: this.keyword, type: this.type }
      })
      this.searchVisible = false
    },
    /**
     * 热门搜索跳转
     * @param {String} keyword 热门关键字
     */
    handleGoToLink(keyword) {
      this.$router.push({
        name: 'search', query: { keyword }
      })
      this.searchVisible = false
    }
  }
}
</script>
