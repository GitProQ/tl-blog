<template>
  <section class="app-main">
    <!-- 使用动态的 transition name -->
    <transition :name="transitionName" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      transitionName: 'fade-transform'
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  watch: {
    // watch $route 决定使用哪种过渡，path包含redirect则为刷新
    '$route'(to, from) {
      this.transitionName = to.path.includes('redirect') || from.path.includes('redirect') ? 'fade' : 'fade-transform'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  min-height: calc(100vh - 50px);
}
.fixed-header+.app-main {
  padding-top: 50px;
}
.hasTagsView {
  .app-main {
    /* 90 = navbar + tags-view = 50 + 40 */
    height: 100vh;
  }
  .fixed-header+.app-main {
    padding-top: 90px;
  }
}
</style>
