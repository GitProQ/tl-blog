const CompressionPlugin = require('compression-webpack-plugin')

const isPro = process.env.NODE_ENV === 'production'

module.exports = {
  buildModules: ['@nuxtjs/color-mode'],
  build: {
    babel: {
      plugins: [
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
      chunk: ({ isDev }) => isDev ? '[name].js' : 'js/chunk-[name].[contenthash:8].js',
      css: ({ isDev }) => isDev ? '[name].css' : 'css/chunk-[name].[contenthash:8].css',
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
    },
    plugins: [
      new CompressionPlugin({
        test: /.(js|css|woff|ttf)$/, // 匹配需要压缩的文件后缀 看需求
        threshold: 10240 // 大于10kb的会压缩，默认为0
      })
    ],
    publicPath: isPro ? '//cdn.timelessq.com/assets/dist/client' : '/_nuxt/' // 只需将dist/client上传cdn
  },
  buildDir: 'www/assets',
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/styles/global.scss'
  ],
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'renderer', content: 'webkit' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1,shrink-to-fit=no' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'author', content: 'Timeless' }
    ]
  },
  loading: {
    color: '#409EFF',
    failedColor: '#F56C6C',
    continuous: true
  },
  modern: isPro, // 现代模式
  modules: [
    '@nuxtjs/axios'
  ],
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/axios',
    '@/plugins/filters'
  ],
  render: {
    compressor: false // 禁用中间件压缩
    // resourceHints: false  // 添加prefetch并preload链接以加快初始页面加载时间。
  },
  srcDir: 'web/',
  telemetry: false // 关闭收集遥测数据
}
