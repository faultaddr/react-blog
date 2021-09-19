import React from 'react'
import { EditOutline, FolderOutline, HomeOutline, MessageOutline, UserOutline } from 'utils/antdIcon'

export default [
  {
    icon: <HomeOutline style={{ marginRight: 15 }} />,
    title: '首页',
    link: '/home'
  },
  {
    icon: <EditOutline style={{ marginRight: 15 }} />,
    title: '归档',
    link: '/archives'
  },
  {
    icon: <FolderOutline style={{ marginRight: 15 }} />,
    title: '分类',
    link: '/categories'
  },
  {
    icon: <UserOutline style={{ marginRight: 15 }} />,
    title: '关于',
    link: '/about'
  },
  {
    icon: <MessageOutline style={{ marginRight: 15 }} />,
    title: '碎🐡',
    link: '/fragment'
  }
]
