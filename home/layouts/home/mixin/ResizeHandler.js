let body
if (process.client) {
  body = document.body
}
const WIDTH = 992 // refer to Bootstrap's responsive design
const MDWIDTH = 1280

export default {
  beforeMount() {
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    const isMiddleWidth = this.$_isMDwidth()
    if (isMobile) {
      this.$store.dispatch('toggleDevice', 'mobile')
    }
    if (isMiddleWidth) {
      this.$store.dispatch('tools/closeSideBar', { withoutAnimation: true })
    } else {
      this.$store.dispatch('tools/openSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    $_isMDwidth() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < MDWIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.$_isMobile()
        const isMiddleWidth = this.$_isMDwidth()

        this.$store.dispatch('toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMiddleWidth) {
          this.$store.dispatch('tools/closeSideBar', { withoutAnimation: true })
        } else {
          this.$store.dispatch('tools/openSideBar', { withoutAnimation: true })
        }
      }
    }
  }
}
