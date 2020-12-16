<template>
  <div class="fixbar">
    <el-tooltip effect="dark" :content="live2dShow ? '关闭看板娘' : '打开看板娘'" placement="left">
      <div class="fixbar-item tl-icon" :class="live2dShow ? 'active' : ''" @click="toggleWaifu">&#xe703;</div>
    </el-tooltip>
    <el-tooltip effect="dark" :content="particleActive ? '关闭背景动画' : '打开背景动画'" placement="left">
      <div class="fixbar-item tl-icon" :class="particleActive ? 'active' : ''" @click="toggleBubble">&#xe640;</div>
    </el-tooltip>
    <el-tooltip effect="dark" content="点我坐电梯" placement="left" :disabled="backTopTips">
      <div v-show="backTopShow" class="fixbar-item tl-icon" @click="backTop">&#xe637;</div>
    </el-tooltip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { position, scrollTo } from '@/utils/scroll-to'

const REFERENCE = 200

export default {
  data() {
    return {
      backTopShow: false,
      backTopTips: false,
      scrollTop: 0
    }
  },
  computed: {
    ...mapGetters(['particleActive', 'live2dShow'])
  },
  watch: {
    scrollTop() {
      this.backTopShow = this.scrollTop > REFERENCE
    }
  },
  mounted() {
    this.scrollTop = position()
    window.addEventListener('scroll', () => {
      this.scrollTop = position()
    })
  },
  methods: {
    toggleWaifu() {
      this.$store.commit('tools/TOGGLE_LIVE2D')
    },
    toggleBubble() {
      this.$store.commit('tools/TOGGLE_PARTICLE')
    },
    backTop() {
      this.backTopTips = true
      scrollTo(0, 800, () => {
        this.backTopTips = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fixbar{
  position: fixed;
  right: 15px;
  bottom: 15px;
  z-index: 1000;
  @media (max-width:768px) {
    display: none;
  }
  .fixbar-item{
    width: 40px;
    height: 40px;
    margin-bottom: 5px;
    background-color: #fff;
    color: #606266;
    font-size: 24px;
    line-height: 40px;
    text-align: center;
    outline: none;
    user-select: none;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 0px 6px;
    border-radius: 4px;
    &:hover{
      background-color: #ecf5ff;
      color: $primary;
    }
    &.active{
      color: $primary;
    }
  }
}
</style>
