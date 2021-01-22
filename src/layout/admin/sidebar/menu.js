const menu = [
  {
    path: '/admin',
    icon: 'home',
    name: '首页',
  },
  {
    path: '/admin/article',
    icon: 'switcher',
    name: '文章',
    children: [
      {
        path: '/admin/article/manager',
        icon: 'folder',
        name: '管理',
      },
      {
        path: '/admin/article/add',
        icon: 'edit',
        name: '新增',
      },
      {
        path: '/admin/article/graph',
        icon: 'star',
        name: '图表',
      },
    ],
  },
  {
    path: '/admin/fragment',
    icon: 'switcher',
    name: '闲言',
    children: [
      {
        path: '/admin/fragment/manager',
        icon: 'folder',
        name: '管理',
      },
      {
        path: '/admin/fragment/add',
        icon: 'edit',
        name: '新增',
      },
    ],
  },
  {
    path: '/admin/user',
    icon: 'user',
    name: '用户管理',
  },
  {
    path: '/admin/monitor',
    icon: 'star',
    name: '系统监控',
  },
]

export default menu
