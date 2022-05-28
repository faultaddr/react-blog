import React from 'react'
import {Icon} from 'antd'
import SvgIcon from '@/components/SvgIcon'

import Href from '@/components/Href'
import MyInfo from '@/views/web/about/MyInfo'
import {GithubFill} from 'utils/antdIcon'
// API_BASE_URL
export const SERVER_URL = 'http://www.panyunyi.cn'
// export const SERVER_URL = 'http://127.0.0.1'
export const API_BASE_URL = SERVER_URL + ':6060'
// export const API_BASE_URL = 'http://127.0.0.1:6060'
// project config
export const HEADER_BLOG_NAME = '菜园子' // header title 显示的名字

// === sidebar
export const SIDEBAR = {
  avatar: require('@/assets/images/avatar.jpeg'), // 侧边栏头像
  title: '种菜的小朋友', // 标题
  subTitle: 'Carpe diem', // 子标题
  // 个人主页
  homepages: {
    github: {
      link: 'https://github.com/faultaddr',
      icon: <GithubFill className='homepage-icon' />
    },
    juejin: {
      link: 'https://juejin.im/user/96412755827687',
      icon: <SvgIcon type='iconjuejin' className='homepage-icon' />
    }
  },
  friendslink: {
    lizi: {
      link: 'http://blog.liziyang.co/',
      img: 'http://blog.liziyang.co/images/pikachu.jpg',
    },
    wizchen: {
      link: 'http://blog.wizchen.com',
      img: 'https://cdn.jsdelivr.net/gh/wizcheu/content1@main/img/header.gif'
    }
  }
}

// === discuss avatar
export const DISCUSS_AVATAR = SIDEBAR.avatar // 评论框博主头像

/**
 * github config
 */
export const GITHUB = {
  enable: true, // github 第三方授权开关
  client_id: '87a4f88b943adaafd44a', // Setting > Developer setting > OAuth applications => client_id
  url: 'https://github.com/login/oauth/authorize' // 跳转的登录的地址
}

export const ABOUT = {
  avatar: SIDEBAR.avatar,
  describe: SIDEBAR.subTitle,
  discuss: true, // 关于页面是否开启讨论
  renderMyInfo: <MyInfo /> // 我的介绍 自定义组件 => src/views/web/about/MyInfo.jsx
}

// 公告 announcement
export const ANNOUNCEMENT = {
  enable: true, // 是否开启
  content: (
    <>
      个人笔记网站，请访问
      <Href href='https://www.yuque.com/zhongcaidexiaopengyou/kb'> panyunyi's note</Href>
    </>
  )
}
