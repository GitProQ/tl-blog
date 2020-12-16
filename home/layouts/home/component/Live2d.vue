<template>
  <div v-if="isShow" ref="waifu" class="waifu" @mousedown="dragMove">
    <transition name="fade-transform" mode="out-in">
      <div v-show="tipsShow" class="waifu-tips" v-html="tips" />
    </transition>
    <canvas id="live2d" ref="live2d" width="280" height="250" class="live2d" />
    <div class="waifu-tool">
      <span ref="home" class="tl-icon" @click="navigatorToHome">&#xe76f;</span>
      <span ref="model" class="tl-icon" @click="loadOtherModel">&#xe6ed;</span>
      <span ref="textures" class="tl-icon" @click="loadOtherTexture">&#xe743;</span>
      <span ref="photo" class="tl-icon" @click="handleTakePhoto">&#xe704;</span>
      <span ref="close" class="tl-icon" @click="handleHideLive2d">&#xe602;</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
if (process.client) {
  require('@/utils/live2d')
}

export default {
  data() {
    return {
      apiurl: '//api.timelessq.com/live2d', // apiurl {string} 模型后端接口
      tips: '',
      isShow: true,
      tipsShow: false,
      mouseover: [
        {
          'selector': 'home',
          'text': ['点击前往首页，想回到上一页可以使用浏览器的后退功能哦']
        },
        {
          'selector': 'model',
          'text': ['๑乛◡乛๑ 让我的好朋友见见你']
        },
        {
          'selector': 'textures',
          'text': ['(๑¯◡¯๑) 要看看其它的衣服么']
        },
        {
          'selector': 'photo',
          'text': ['123茄子 西瓜甜不甜，宝宝萌不萌']
        },
        {
          'selector': 'close',
          'text': ['つ﹏⊂ 真的到了要分开的时候了么']
        },
        {
          'selector': 'live2d',
          'text': [
            '(๑•́ ₃ •̀๑)',
            '.^◡^.',
            'ᖗ乛◡乛ᖘ'
          ]
        }
      ],
      click: [
        '萝莉控是什么呀',
        '(๑•́ ∀ •̀๑)',
        '๑乛◡乛๑嘿嘿',
        '！⌇●﹏●⌇',
        '(ó﹏ò｡)'
      ]
    }
  },
  computed: {
    ...mapGetters(['live2dShow', 'configs']),
    modelId() { // 模型 ID
      return this.configs.live2d_model || 100
    },
    texturesId() { // 材质 ID
      return this.configs.live2d_texture || 1
    }
  },
  watch: {
    live2dShow(isShow) {
      if (isShow) {
        this.handleShowLive2d()
      } else {
        this.handleHideLive2d()
      }
    }
  },
  mounted() {
    if (this.isShow) {
      this.initModel()

      /** 开启开发者工具 */
      const re = /x/
      re.toString = function() {
        this.showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？', 3000, true)
        return ''
      }
      document.addEventListener('copy', () => {
        this.showMessage('你都复制了些什么呀，转载要记得加上出处哦', 3000, true)
      })
    }
  },
  methods: {
    dragMove(e) {
      const odiv = this.$refs.waifu // 获取目标元素
      // 算出鼠标相对元素的位置
      const disX = e.clientX - odiv.offsetLeft
      const disY = e.clientY - odiv.offsetTop
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX
        let top = e.clientY - disY

        const clientWidth = document.documentElement.clientWidth || document.body.clientWidth
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        if (left < 0) {
          left = 0
        } else if (left > clientWidth - odiv.clientWidth) {
          left = clientWidth - odiv.clientWidth
        }
        if (top < 0) {
          top = 0
        } else if (top > clientHeight - odiv.clientHeight) {
          top = clientHeight - odiv.clientHeight
        }

        // 移动当前元素
        odiv.style.left = left + 'px'
        odiv.style.top = top + 'px'

        document.body.style.userSelect = 'none'
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        document.body.style.userSelect = 'text'
      }
    },
    /**
     * 提示信息
     * @param {String} text tips信息
     * @param {Number [int]} duration 持续时间
     */
    showMessage(text, duration = 3000) {
      if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1) - 1]
      this.tips = text
      this.tipsShow = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.tipsShow = false
      }, duration)
    },
    // 初始化模型
    initModel() {
      this.loadModel(this.modelId, this.texturesId)
      this.onBrowsing()
      this.addInteraction()
    },
    /**
     * 加载指定模型
     * @param {Number [int]} modelId 模型id
     * @param {Number [int]} texturesId 材质id
     */
    loadModel(modelId, texturesId = 1) {
      window.loadlive2d(
        'live2d', `${this.apiurl}/get?id=${modelId}&texture=${texturesId}&isuseCDN=true`,
        console.log('live2d', `模型 ${modelId}-${texturesId} 加载完成`)
      )
    },
    // 更换模型
    loadOtherModel() {
      this.$axios.get(this.apiurl + '/model/switch', {
        params: {
          id: this.modelId
        }
      }).then(res => {
        const { id, message } = res.data
        if (id) {
          this.showMessage(message, 3000)
          this.loadModel(id)
        } else {
          this.showMessage('哎呀 还没有其它的小伙伴呢', 3000)
        }
      })
    },
    // 更换衣服
    loadOtherTexture() {
      this.$axios.get(this.apiurl + '/texture/random', {
        params: {
          id: this.modelId,
          texture: this.texturesId
        }
      }).then(res => {
        const { id, texture } = res.data
        if (id) {
          this.showMessage('我的新衣服好看嘛', 3000)
          this.loadModel(id, texture)
        } else {
          this.showMessage('我还没有其他衣服呢', 3000)
        }
      })
    },
    onBrowsing() {
      let text
      const SiteIndexUrl = window.location.protocol + '//' + window.location.hostname + '/' // 自动获取主页
      if (window.location.href === SiteIndexUrl) { // 如果是主页
        const now = (new Date()).getHours()
        if (now > 23 || now <= 5) {
          text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛'
        } else if (now > 5 && now <= 7) {
          text = '早上好！一日之计在于晨，美好的一天就要开始了'
        } else if (now > 7 && now <= 11) {
          text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！'
        } else if (now > 11 && now <= 14) {
          text = '中午了，工作了一个上午，现在是午餐时间！'
        } else if (now > 14 && now <= 17) {
          text = '午后很容易犯困呢，今天的运动目标完成了吗？'
        } else if (now > 17 && now <= 19) {
          text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~'
        } else if (now > 19 && now <= 21) {
          text = '晚上好，今天过得怎么样？'
        } else if (now > 21 && now <= 23) {
          text = '已经这么晚了呀，早点休息吧，晚安~'
        } else {
          text = '嗨~ 快来逗我玩吧！'
        }
      } else {
        if (document.referrer !== '') {
          const referrer = document.createElement('a')
          referrer.href = document.referrer
          const domain = referrer.hostname.split('.')[1]
          if (window.location.hostname === referrer.hostname) {
            text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>'
          } else if (domain === 'baidu') {
            text = 'Hello! 来自 百度搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&wd=')[1].split('&')[0] + '</span> 找到的我吗？'
          } else if (domain === 'so') {
            text = 'Hello! 来自 360搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&q=')[1].split('&')[0] + '</span> 找到的我吗？'
          } else if (domain === 'google') {
            text = 'Hello! 来自 谷歌搜索 的朋友<br>欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>'
          } else {
            text = 'Hello! 来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友'
          }
        } else {
          text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>'
        }
      }
      this.showMessage(text, 3000)
    },
    // 鼠标交互
    addInteraction() {
      const refs = this.$refs
      for (const key in refs) {
        refs[key].addEventListener('mouseover', () => {
          const rows = this.mouseover.find(item => item.selector === key)
          if (!rows) return
          let text = ''
          if (Array.isArray(rows.text)) {
            text = rows.text[Math.floor(Math.random() * rows.text.length + 1) - 1]
          } else {
            text = rows.text
          }
          this.showMessage(text, 3000)
        })
      }
      this.$refs.live2d.addEventListener('click', () => {
        const text = this.click[Math.floor(Math.random() * this.click.length + 1) - 1]
        this.showMessage(text, 3000, true)
      })
    },
    navigatorToHome() {
      this.$router.push({ path: '/' })
    },
    handleShowLive2d() {
      this.isShow = true
      this.$nextTick(() => {
        this.addInteraction()
        this.initModel()
        this.showMessage('锵锵锵锵~ 本宝宝又回来了', 1500)
      })
    },
    handleHideLive2d() {
      this.showMessage('愿你有一天能与重要的人重逢', 1500)
      window.setTimeout(() => {
        this.$store.commit('tools/SET_LIVE2D', false)
        this.isShow = false
      }, 1500)
    },
    handleTakePhoto() {
      this.showMessage('照好了嘛，是不是很可爱呐？', 3000)
      window.Live2D.captureName = 'Pio.png'
      window.Live2D.captureFrame = true
    }
  }
}
</script>
