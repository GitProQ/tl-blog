const isPro = process.env.NODE_ENV === 'production'

module.exports = {
  mode: 'universal',
  modern: isPro,
  srcDir: 'home/',
  offline: true,
  telemetry: false,
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'renderer', content: 'webkit' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1,shrink-to-fit=no' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'author', content: 'Timeless' }
    ]
  },
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/styles/global.scss'
  ],
  loading: {
    color: '#409EFF',
    failedColor: '#F56C6C',
    continuous: true
  },
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/axios'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: false,
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    scss: ['@/styles/variables.scss']
  },
  build: {
    transpile: [/^element-ui/],
    publicPath: isPro ? '//cdn.timelessq.com/assets/dist/client' : '/_nuxt/', // 只需将dist/client上传cdn
    babel: {
      'plugins': [
        [
          'component',
          {
            'libraryName': 'element-ui',
            'styleLibraryName': 'theme-chalk'
          }
        ],
        [
          'prismjs',
          {
            'languages': ['markup', 'css', 'javascript', 'json', 'bash', 'less', 'php', 'sql'],
            'plugins': ['show-language', 'highlight-keywords', 'toolbar'],
            'css': false
          }
        ]
      ]
    },
    extractCSS: true,
    filenames: {
      app: ({ isDev }) => isDev ? '[name].js' : 'js/app.[contenthash:8].js',
      chunk: ({ isDev }) => isDev ? '[name].js' : 'js/chunk-[chunkhash:8].[contenthash:8].js',
      css: ({ isDev }) => isDev ? '[name].css' : 'css/chunk-[chunkhash:8].[contenthash:8].css',
      img: ({ isDev }) => isDev ? '[path][name].[ext]' : 'img/[name].[contenthash:8].[ext]',
      font: ({ isDev }) => isDev ? '[path][name].[ext]' : 'fonts/[name].[contenthash:8].[ext]'
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          commons: false,
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            minChunks: 2,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          element: {
            name: 'element', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than vendor and app or it will be packaged into vendor or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          }
        }
      },
      runtimeChunk: false
    }
  },
  buildDir: 'www/assets',
  render: {
    compressor: false
    // resourceHints: false
  }
}
