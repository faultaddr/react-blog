# React Blog 


[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)


React Blog

一键安装&部署的React 搭建的博客，解放双手让你只需要更改配置文件即拥有一个完美的个人技术博客！

本仓库包含以下内容：

1. 如何安装与部署博客
2. 如何配置前端页面信息
3. 如何配置后端敏感信息


## 内容列表

- [背景](#背景)
- [安装](#安装)
- [使用说明](#使用说明)
- [功能与个性化配置](#功能与个性化配置)
    - [实现功能](#实现功能)
    - [个性化配置](#个性化配置)
    - [个人信息配置](#个人信息配置)
    - [后台敏感信息配置](#后台敏感信息配置)
- [维护者](#维护者)
- [如何贡献](#如何贡献)
- [使用许可](#使用许可)

## 背景

`React Blog` 最开始是在 [alvin0216](https://github.com/alvin0216) 的项目 [alvin0216/react-blog](https://github.com/alvin0216/react-blog) 的基础上构建的，是为了修复一些已知的问题，已经加入更多的个性化元素和网站的各类安全性保障构建的，更加炫酷也更加易用。


为了搭建个人网站，首先你需要租用一个云服务器（本文中一般使用centos来代替），使用阿里云/腾讯云/AWS 来进行网站的托管。或者你可以通过Ngrok来做内网穿透将网站部署在自己的pc上。


## 安装

如果你想要部署在centos服务器上，可以直接使用我们的一键安装部署脚本：
```sh
$ sh install.sh
```
如果你想要自己安装配置，本项目使用 [node](http://nodejs.org),[npm](https://npmjs.com),[yarn](),[forever]() 请确保你在本地进行了正确的安装。

```sh
$ npm install --global yarn
$ npm install --global forever
```


## 使用说明

如果你使用了上述的一键安装脚本，后面启动时，请注意端口是否被占用：

```sh
$ yum install lsof
$ lsof -i:80
$ lsof -i:6060
```
如果存在端口占用，请结束进程或者更换端口
然后执行下列指令进行生产环境部署

```sh
$ cd src
$ yarn build
$ nohup serve -s build -l 80 &
$
$ cd server
$ forever start app.js
```

或者进行开发环境部署

```sh
$ cd src
$ nohup yarn dev
$
$ cd server
$ forever start app.js
```



## 功能与个性化配置

### 实现功能

- [x] 前台：主页 + 列表页 + 搜索页 + 分类页 + 标签页
- [x] 后台：文章管理 + 用户管理
- [x] 响应式、文章锚点导航、回到顶部、`markdown` 代码高亮、`mathjax`支持
- [x] 用户：站内用户、`github` 第三方授权登录的用户
- [x] 用户可以评论与回复、以及**邮件通知**回复的状态
- [x] `md` 文件导入导出功能！可以直接上传 `md` 文件生成文章
- [x] 私密与公开文章分离
- [x] 一键评论，无需注册
- [x] 主页背景
- [x] 文章置顶
- [x] 闲言碎语
- [x] 动态获取mailbox secret
- [x] 密码传输加密
- [x] 后台图表
- [x] 用于管理员的私密文章链接分享
- [ ] 智能推荐（关联推荐）

### 个性化配置

个性化配置是通过 ```src/config.js``` 来进行配置的

```js
import React from 'react'
import { Icon } from 'antd'
import SvgIcon from '@/components/SvgIcon'

import Href from '@/components/Href'
import MyInfo from '@/views/web/about/MyInfo'

// API_BASE_URL
export const API_BASE_URL = 'http://120.79.229.207:6060'
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
    //侧边栏友情链接
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
```
### 个人信息配置

个人信息是通过 ```src/view/web/about/index.jsx```来进行配置的
```js
import React from 'react'

// components
import { Divider, Rate, Icon, Avatar } from 'antd'
import Href from '@/components/Href'
import SvgIcon from '@/components/SvgIcon'

const skills = [
  {
    label: '具备扎实的Java功底，熟练了解各种特性',
    rate: '5'
  },
  {
    label: '具备扎实的Python功底，熟练了解各类特性',
    rate: '5'
  },
  {
    label: '具备扎实的 Javascript 基础，熟练使用 ES6+ 语法。',
    rate: 4
  },
  {
    label: '具备不那么扎实的 C++ 基础，没熟练了解各类特性',
    rate: 3
  },
  {
    label: 'Android 顶级玩家',
    rate: 5
  },
  {
    label: '熟悉 React 并理解其原理，熟悉 Vue 框架及其用法。',
    rate: 5
  },
  {
    label: '熟悉 Flask/Django 并理解其原理，熟悉各类用法。',
    rate: 5
  },
  {
    label: 'Spring 全家桶爱好者，后端中级开发者,netty/kafka/hadoop/Storm/Spark',
    rate: '3'
  },
  {
    label: '3D 轻量级玩家，openGL小菜,3D shape segmentation & 3D scene segmentation',
    rate: '3'
  },
  {
    label: '熟练使用 Webpack 打包工具，熟悉常用工程化和模块化方案。',
    rate: 4
  },
  {
    label: '熟悉 Koa、Mysql，针对需求可以做到简单的数据库设计、接口的开发与设计！',
    rate: 3
  },
  {
    label: '熟悉 HTTP 协议，缓存、性能优化、安全等，了解浏览器原理。',
    rate: 4
  },
  {
    label: '熟悉常用的算法与数据结构',
    rate: 3
  }
]

const MyInfo = () => {
  return (
    <>

      <Divider orientation='center'>关于我</Divider>

      <ul className='about-list'>
        <li>姓名：潘云逸</li>
        <li>本科： 中央财经大学（CUFE）CS</li>
        <li>硕士： 南京大学（NJU）CS</li>
        <li>
          联系方式：
          <Icon type='qq' /> 779087031
          <Divider type='vertical' />
          <SvgIcon type='iconemail' style={{ marginRight: 5, transform: 'translateY(2px)' }} />
          <a href='mailto:cuferpan@gmail.com'>cuferpan@gmail.com</a>
        </li>
        <li>工作地：上海</li>
        <li>
          友情链接博客地址：
          <Href href='http://blog.liziyang.co/'>栗子栗子</Href>
          <Divider type='vertical' />
        </li>
        <li>
          技能
          <ul>
            {skills.map((item, i) => (
              <li key={i}>
                {item.label}
                <Rate defaultValue={item.rate} disabled />
              </li>
            ))}
          </ul>
        </li>
        <li>
          其他
          <ul>
            <li>常用开发工具： idea、pycharm、vim、vscode、webstorm、git</li>
            <li>熟悉的 UI 框架： antd、element-ui</li>
            <li>具备良好的编码风格和习惯，团队规范意识，乐于分享</li>
          </ul>
        </li>
        <li>
          publication
          <ul>
            <li>ICPR 2020: Two Stage Scene Segmentation Base on Self-attention Mechanism</li>
            <li> 安徽大学学报： 图核综述 </li>
            <li> 专利： 一种基于机器学习的CME事件跟踪方法 </li>
            <li> 译著： 计算机视觉基础 </li>
          </ul>
        </li>
      </ul>
    </>
  )
}

export default MyInfo
```
### 后台敏感信息配置


后台敏感信息是通过```server\config\index.js```配置的,包括后台的启动端口，数据库的相关配置和评论的邮件通知相关配置。

```js
const devMode = process.env.NODE_ENV === 'development'
const config = {
  PORT: 6060, // 启动端口
  ADMIN_GITHUB_LOGIN_NAME: 'faultaddr', // 博主的 github 登录的账户名 user
  GITHUB: {
    client_id: '87a4f88b943adaafd44a',
    client_secret: '9494809fc485d93084452fbf8b21ba2a829bfb82',
    access_token_url: 'https://github.com/login/oauth/access_token',
    fetch_user_url: 'https://api.github.com/user', // 用于 oauth2
    fetch_user: 'https://api.github.com/user' // fetch user url https://api.github.com/users/gershonv
  },
  EMAIL_NOTICE: {
    // 邮件通知服务
    // detail: https://nodemailer.com/
    enable: true, // 开关
    transporterConfig: {
      host: 'smtp.qq.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: '779087031@qq.com', // generated ethereal user
        pass: 'f2bbfe7cf1bcb8253a65c06701fbbbbf8c910be44ecc1a430497d4879db0d71d' // generated ethereal password 授权码 而非 密码
      }
    },
    subject: 'panyunyi的博客 - 您的评论获得新的回复！', // 主题
    text: '您的评论获得新的回复！',
    WEB_HOST: 'http://www.panyunyi.cn' // email callback url
  },
  TOKEN: {
    secret: 'root', // secret is very important!
    expiresIn: '720h' // token 有效期
  },
  DATABASE: {
    database: 'test',
    user: 'root',
    password: '123456Root!',
    options: {
      host: 'localhost', // 连接的 host 地址
      dialect: 'mysql', // 连接到 mysql
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: false, // 默认不加时间戳
        freezeTableName: true // 表名默认不加 s
      },
      timezone: '+08:00'
    }
  }
}

// 部署的环境变量设置
if (!devMode) {
  console.log('env production....')

  // ==== 配置数据库
  config.DATABASE = {
    ...config.DATABASE,
    database: '', // 数据库名
    user: '', // 账号
    password: '' // 密码
  }

  // 配置 github 授权
  config.GITHUB.client_id = ''
  config.GITHUB.client_secret = ''

  // ==== 配置 token 密钥
  config.TOKEN.secret = ''

  // ==== 配置邮箱

  // config.EMAIL_NOTICE.enable = true
  config.EMAIL_NOTICE.transporterConfig.auth = {
    user: '779087031@qq.com', // generated ethereal user
    pass: 'f2bbfe7cf1bcb8253a65c06701fbbbbf8c910be44ecc1a430497d4879db0d71d' // generated ethereal password 授权码 而非 密码
  }
  config.EMAIL_NOTICE.WEB_HOST = 'https://panyunyi.cn'
}

module.exports = config

```

## 维护者

[@faultaddr](https://github.com/faultaddr)。

## 如何贡献

非常欢迎你的加入！[提一个 Issue](https://github.com/faultaddr/react-blog/issues/new) 或者提交一个 Pull Request。


React-blog 遵循 [Contributor Covenant](http://contributor-covenant.org/version/1/3/0/) 行为规范。




## 使用许可

[MIT](LICENSE) © Richard Littauer
