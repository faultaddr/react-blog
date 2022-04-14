# React Blog 


[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)


For chinese , you can visit this [中文](https://github.com/faultaddr/react-blog/blob/main/README.zh-CN.md)

One-click installation & deployment of the React blog, freeing your hands so that you only need to change the configuration file to have a perfect personal technical blog!

This ReadMe file contains the following:

1. How to install and deploy a blog
2. How to configure front-end page information
3. How to configure sensitive back-end information


## Table of Contents

- [Background](#Background)
- [Install](#Install)
- [Usage](#Usage)
- [Features and Personalized Configuration](#Features-and-Personal-Configuration)
     - [Features](#Features)
     - [Personalized Configuration](#Personalized-Configuration)
     - [Personalized Information Configuration](#Personalized-Information-Configuration)
     - [Background sensitive information configuration](#Background-sensitive-information-configuration)
- [Maintainer](#Maintainer)
- [Contributing](#Contributing)
- [License](License)

## Background

`React Blog` was originally built on the basis of project [alvin0216/react-blog](https://github.com/alvin0216/react-blog) which was created by [alvin0216](https://github.com/alvin0216) , In order to fix some known issues and add more personalized elements, Last but no Least, I have added various security guarantees of the website, making it more cool and easier to use.


In order to build a personal website, you first need to rent a cloud server (centos is generally used instead in this article), and use Alibaba Cloud/Tencent Cloud/AWS to host the website. Or you can use Ngrok to do intranet penetration and deploy the website on your PC.


## Install

If you want to deploy on the Centos server, you can directly use our one-click installation deployment script:
```sh
$ sh install.sh
```
If you want to install and configure yourself, use [node](http://nodejs.org),[npm](https://npmjs.com),[yarn](),[forever]() for this project. Please make sure You have performed the correct installation locally.

```sh
$ npm install --global yarn
$ npm install --global forever
```


## Usage

If you use the one-click installation script mentioned above, please pay attention to whether the port is occupied when starting later:

```sh
$ yum install lsof
$ lsof -i:80
$ lsof -i:6060
```
If there is port occupation, please end the process or change the port

Then execute the following instructions for production deployment

```sh
$ cd src
$ yarn build
$ nohup serve -s build -l 80 &
$
$ cd server
$ forever start app.js
```

Or for development environment deployment

```sh
$ cd src
$ nohup yarn dev
$
$ cd server
$ forever start app.js
```



## Features and Personal Configuration

### Features

- [x] Front Desk: Homepage + List Page + Search Page + Category Page + Tab Page
- [x] Backstage: article management + user management
- [x] Responsive, article anchor navigation, back to top, `markdown` code highlighting, `mathjax` support
- [x] Users: users on the site, users authorized to log in by a third-party `github`
- [x] Users can comment and reply, as well as the status of **mail notification** reply
- [x] `md` file import and export function! You can directly upload the `md` file to generate an article
- [x] Separation of private and public articles
- [x] One-click comment without registration
- [x] Homepage background
- [x] Top of article
- [x] Gossip
- [x] Get the mailbox secret dynamically
- [x] Password transmission encryption
- [x] Background chart
- [x] Share Link for the admain to manage the visiablity of the private article
- [ ] Smart Recommendation (Related Recommendation)

### Personalized Configuration

Personalized configuration is configured through ```src/config.js```

```js
import React from 'react'
import { Icon } from 'antd'
import SvgIcon from '@/components/SvgIcon'

import Href from '@/components/Href'
import MyInfo from '@/views/web/about/MyInfo'
import {GithubFill} from 'utils/antdIcon'
// API_BASE_URL
export const API_BASE_URL = 'http://120.79.229.207:6060'
// export const API_BASE_URL = 'http://127.0.0.1:6060'
// project config
export const HEADER_BLOG_NAME = '菜园子' // header title 

// === sidebar
export const SIDEBAR = {
    avatar: require('@/assets/images/avatar.jpeg'), // sidebar image
    title: '种菜的小朋友', // title
    subTitle: 'Carpe diem', // subtitle
    // personal website
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
    //frindslink in sidebar
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
export const DISCUSS_AVATAR = SIDEBAR.avatar // your default avatar in comment line
/**
 * github config
 */
export const GITHUB = {
    enable: true, // github 第三方授权开关
    client_id: '87a4f88b943adaafd44a', // Setting > Developer setting > OAuth applications => client_id
    url: 'https://github.com/login/oauth/authorize' // github auth page
}

export const ABOUT = {
    avatar: SIDEBAR.avatar,
    describe: SIDEBAR.subTitle,
    discuss: true, // open the comment function on 'about me' page 
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
### Personalized Information Configuration

Personal information is configured through ```src/view/web/about/index.jsx```
```js
import React from 'react'

// components
import { Divider, Rate, Icon, Avatar } from 'antd'
import Href from '@/components/Href'
import SvgIcon from '@/components/SvgIcon'
// rate is the star
// label is your skills
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
        <li>Name：潘云逸</li>
        <li>Bachelor： 中央财经大学（CUFE）CS</li>
        <li>Master： 南京大学（NJU）CS</li>
        <li>
          Contact me：
          <Icon type='qq' /> 779087031
          <Divider type='vertical' />
          <SvgIcon type='iconemail' style={{ marginRight: 5, transform: 'translateY(2px)' }} />
          <a href='mailto:cuferpan@gmail.com'>cuferpan@gmail.com</a>
        </li>
        <li>Work Base：ShangHai</li>
        <li>
          friends link：
          <Href href='http://blog.liziyang.co/'>栗子栗子</Href>
          <Divider type='vertical' />
        </li>
        <li>
          skills
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
          others
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
### Background sensitive information configuration


Sensitive information in the background is configured through ``server\config\index.js``, including the startup port of the background, the configuration of the database, and the configuration of the email notification of comments.

```js
const devMode = process.env.NODE_ENV === 'development'
const config = {
  PORT: 6060, // start port
  ADMIN_GITHUB_LOGIN_NAME: 'faultaddr', // your github name
  GITHUB: {
    client_id: '87a4f88b943adaafd44a',
    client_secret: '9494809fc485d93084452fbf8b21ba2a829bfb82',
    access_token_url: 'https://github.com/login/oauth/access_token',
    fetch_user_url: 'https://api.github.com/user', // 用于 oauth2
    fetch_user: 'https://api.github.com/user' // fetch user url https://api.github.com/users/gershonv
  },
  EMAIL_NOTICE: {
    // mail notification
    // detail: https://nodemailer.com/
    enable: true, // switcher
    transporterConfig: {
      host: 'smtp.qq.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: '779087031@qq.com', // generated ethereal user
        pass: 'f2bbfe7cf1bcb8253a65c06701fbbbbf8c910be44ecc1a430497d4879db0d71d' // generated ethereal password 
      }
    },
    subject: 'panyunyi的博客 - 您的评论获得新的回复！', // subject for the notification mail
    // main content of the mail
    text: '您的评论获得新的回复！',
    WEB_HOST: 'http://www.panyunyi.cn' // email callback url
  },
  TOKEN: {
    secret: 'root', // secret is very important!
    expiresIn: '720h' // token exist time
  },
  DATABASE: {
    database: 'test',
    user: 'root',
    password: '123456Root!',
    options: {
      host: 'localhost', //  host ip
      dialect: 'mysql', // sql dilect
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: false, // timestamps is set to 'off' default
        freezeTableName: true // table name not add s in default
      },
      timezone: '+08:00'
    }
  }
}

// production env configuration
if (!devMode) {
  console.log('env production....')

  // ==== configure database
  config.DATABASE = {
    ...config.DATABASE,
    database: '', // database name
    user: '', // user name
    password: '' // password
  }

  // configure github auth
  config.GITHUB.client_id = ''
  config.GITHUB.client_secret = ''

  // ==== configure token secret key
  config.TOKEN.secret = ''

  // ==== configure mailbox

  // config.EMAIL_NOTICE.enable = true
  config.EMAIL_NOTICE.transporterConfig.auth = {
    user: '779087031@qq.com', // generated ethereal user
    pass: 'f2bbfe7cf1bcb8253a65c06701fbbbbf8c910be44ecc1a430497d4879db0d71d' // generated ethereal password 
  }
  config.EMAIL_NOTICE.WEB_HOST = 'https://panyunyi.cn'
}

module.exports = config

```

## Maintainers

[@faultaddr](https://github.com/faultaddr)。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=faultaddr/react-blog&type=Date)](https://star-history.com/#bytebase/star-history&Date)

## Contributing

Feel free to dive in! [open an issue](https://github.com/faultaddr/react-blog/issues/new) or submit PRs.


React-blog follows the  [Contributor Covenant](http://contributor-covenant.org/version/1/3/0/) Code of Conduct.


## License

[MIT](LICENSE) © Yunyi Pan
