import React from 'react'
import { EditOutline, FolderOutline, HomeOutline, StarOutline, SwitcherOutline, FolderOpenOutline, UserOutline, MonitorOutline } from 'utils/antdIcon'

const menu = [
  {
    path: '/admin',
    icon: <HomeOutline />,
    name: '首页',
  },
  {
    path: '/admin/article',
    icon: <SwitcherOutline />,
    name: '文章',
    children: [
      {
        path: '/admin/article/manager',
        icon: <FolderOutline />,
        name: '管理',
      },
      {
        path: '/admin/article/add',
        icon: <EditOutline />,
        name: '新增',
      },
      {
        path: '/admin/article/graph',
        icon: <StarOutline />,
        name: '图表',
      },
    ],
  },
  {
    path: '/admin/fragment',
    icon: <FolderOpenOutline />,
    name: '闲言',
    children: [
      {
        path: '/admin/fragment/manager',
        icon: <FolderOutline />,
        name: '管理',
      },
      {
        path: '/admin/fragment/add',
        icon: <EditOutline />,
        name: '新增',
      },
    ],
  },
  {
    path: '/admin/user',
    icon: <UserOutline />,
    name: '用户管理',
  },
  {
    path: '/admin/monitor',
    icon: <MonitorOutline />,
    name: '系统监控',
  },
]

export default menu
