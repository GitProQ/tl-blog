/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    name: 'Home',
    path: '/admin',
    meta: { title: '首页', icon: 'dashboard' }
  },

  {
    path: '/admin/content',
    meta: { title: '内容管理', icon: 'content' },
    children: [
      {
        path: 'article',
        name: 'Article',
        meta: { title: '文章模块' }
      },
      {
        path: 'bangumi',
        name: 'Bangumi',
        meta: { title: '番剧模块' }
      },
      {
        path: 'toolkit',
        name: 'Toolkit',
        meta: { title: '小工具' }
      },
      {
        path: 'recycle',
        name: 'Recycle',
        meta: { title: '回收站', noCache: true }
      }
    ]
  },

  {
    path: '/admin/category',
    meta: { title: '栏目管理', icon: 'category' },
    children: [
      {
        path: '',
        name: 'Category',
        hidden: true,
        meta: { title: '栏目列表' }
      }
    ]
  },

  {
    path: '/admin/comment',
    meta: { title: '评论系统', icon: 'community' },
    children: [
      {
        path: '',
        name: 'Comment',
        meta: { title: '评论系统' }
      },
      {
        path: '/comment/:id',
        name: 'CommentContent',
        hidden: true,
        meta: { title: '评论详情', noCache: true }
      }
    ]
  },

  {
    path: '/admin/link',
    meta: { title: '友情链接', icon: 'member' },
    children: [
      {
        path: '',
        name: 'Link',
        meta: { title: '友情链接' }
      }
    ]
  },

  {
    path: '/admin/system',
    meta: { title: '系统管理', icon: 'system' },
    children: [
      {
        path: 'options-general',
        name: 'OptionsGeneral',
        meta: { title: '常规配置', noCache: true }
      },
      {
        path: 'options-profile',
        name: 'OptionsProfile',
        meta: { title: '个人资料', noCache: true }
      },
      {
        path: 'options-banner',
        name: 'OptionsBanner',
        meta: { title: 'Banner管理' }
      },
      {
        path: 'options-reading',
        name: 'OptionsReading',
        meta: { title: '阅读设置', noCache: true }
      }
    ]
  }
]

export default constantRoutes
