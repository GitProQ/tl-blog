module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'think',
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [],
  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {}
}
