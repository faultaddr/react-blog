>写在前面：
>用烦了wordpress，hexo和其他各种各样的博客框架，是时候该从桎梏中跳出，写一个自己的博客了！
>
> 我的博客 www.panyunyi.cn
>
> 博客的github地址 https://github.com/panyunyi97/react-blog
>
> 欢迎 star & pr

#### Centos 一键部署的脚本在根目录（Ubuntu的一键部署脚本还在整理中），直接

    sh install.sh
    
 即可，首次搭建时使用install.sh。
 后面再启动时，使用
 
    sh run.sh

在试图搭建一个完全属于自己且自主可控的博客之前，我使用过 wordpress 和 Hexo 等傻瓜式的博客。但这类可少量客制化的博客并不能完完全全满足我的需求，我希望我自己的博客在我手中完全可控，一丝一毫都可以被我掌握，这样才显得安心和舒适。作为一个开发者，自己的博客其实就是自己的Resume，不单单需要内容翔实，更需要样式美观可控，所以我建议大家，都自己动手搭建一个真正属于自己的博客！

在启动之前我也雄心壮志过，试图从零开始一点一点做，后来发现，成本太高而且旷日持久，所以我决定偷师github，找一个符合自己审美的React-blog进行深度改造，非常幸运的是，我找到了一个完全可用的[React Blog](https://github.com/alvin0216/react-blog)。

基于这个原始版blog，我开启了我的blog 客制化之路。

首先给大家看一下最后的成果：

![菜园子](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45408d8286f044da936cdb0a0e17ef8a~tplv-k3u1fbpfcp-zoom-1.image)

以及实现的功能一览：

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
- [ ] 智能推荐（关联推荐）

### 技术栈

- 前端 （基于 `create-react-app eject` 后的配置）

  - react v16.9.0 `hooks` + `redux` + `react-router4`
  - `marked highlight.js`
  - `webpack` 打包优化
  - `axios` 封装

- 后端 （自构建后台项目）
  - `koa2` + `koa-router`
  - `sequelize` + `mysql`
  - `jwt` + `bcrypt`
  - `nodemailer`
  - `koa-send` `archiver`
  
### 项目结构

```js
.
│
├─config                // 构建配置
├─public                // html 入口
├─scripts               // 项目脚本
└─server                // 后端
    ├─config            // 项目配置 github、email、database、token-secret 等等
    ├─controllers       // 业务控制层
    ├─middlewares       // 中间件
    ├─models            // 数据库模型
    ├─router            // 路由
    ├─utils             // 工具包
    ├─  app.js          // 后端主入口文件
    ├─  initData.js     // 初始化基础数据脚本
    └─...
│
└─src                   // 前端项目源码
   ├─assets             // 静态文件
   ├─components         // 公用组件
   ├─layout             // 布局组件
   ├─redux              // redux 目录
   ├─routes             // 路由
   ├─styles             // 样式
   ├─utils              // 工具包
   ├─views              // 视图层
   ├─  App.jsx          // 后端主入口文件
   ├─  config.js        // 项目配置 github 个人主页、个人介绍等等
   ├─  index.js         // 主入口文件
   └─...

```

## blog改造流程一览
- 页面的客制化改造
- 功能的修复与添加
- 个人信息的填充

### 页面的客制化改造
为了更加适用于自己的使用场景，对页面进行了一些客制化的改造

- 页面背景（写成了可配置可拆卸的）
此处奉上我最喜欢的这张图即封面图

- 页面动效
加上了很多博客都有的翻转滚动的小棒！是不是很棒！

### 功能的修复与添加
为了将博客所有者与阅读者隔离开，加入了role字段进行控制。

- 公开与私密文章：

  博客不单单是展示自己、记录笔记的地方，更是个人情感的树洞，是回忆编织的大网，所以肯定是需要将公开和私密的文章隔离开啦，根据用户角色鉴权来返回对应的数据。这样更好的保护了隐私，也让博客所有者穿上了自己的底裤~
  
- Markdown 编辑器 mathjax 支持
  
  因为博主是一个弱小的科研爱好者，所以写公式更是必须的啦，之前找的这个React-blog在这个功能上存在一些瑕疵，不能有效的支持mathjax，所以进行了一些改动，对 react-simplemde-editor 进行了一些简单的封装，使其支持MathJax预览，在文章显示上适用marked进行编码，使mathjax可以有效显示。
  
  具体实现
 ```js
    export const translateMarkdown2html = (plainText, isGuardXss = false) => {
    const marked_render = new marked.Renderer()
    marked_render.old_paragraph = marked_render.paragraph
    // 重写`paragraph()`方法
    marked_render.paragraph = function(text) {
      // isTeXInline - 该文本是否有行内公式
      var isTeXInline = /\$(.*)\$/g.test(text)
      // isTeXLine - 该文本是否有行间公式
      var isTeXLine = /^\$\$(\s*.*\s*)\$\$$/.test(text)

      if (!isTeXLine && isTeXInline) {
        // 如果不是行间公式，但是行内公式，则使用<span class="marked_inline_tex">包裹公式内容，消除$定界符
        text = text.replace(/(\$([^\$]*)\$)+/g, function($1, $2) {
          // 避免和行内代码冲突
          if ($2.indexOf('<code>') >= 0 || $2.indexOf('</code>') >= 0) {
            return $2
          } else {
            return '<span class=\'marked_inline_tex\'>' + $2.replace(/\$/g, '') + '</span>'
          }
        })
      } else {
        // 如果是行间公式，则使用<div class='marked_tex'>包裹公式内容，消除$$定界符
        // 如果不是LaTex公式，则直接返回原文本
        text = (isTeXLine) ? '<div class=\'marked_tex\'>' + text.replace(/\$/g, '') + '</div>' : text
      }
      // 使用渲染器原有的`paragraph()`方法渲染整段文本
      text = this.old_paragraph(text)
      return text
    }
    // 配置marked.js的渲染器为marked_render，使用highlight.js来自动高亮MarkDown中的代码

    return marked(isGuardXss ? xss(plainText) : plainText, {
      renderer: marked_render,
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false,
      highlight: function(code) {
        /*eslint no-undef: "off"*/
        return hljs.highlightAuto(code).value
      }
    })
    }
```
  
- 文章置顶
  
  置顶文章是一个必须的功能，当你有一些得意之作时，更希望它能有更高的优先级，能帮助到更多的人，所以增加了该功能
  
- 一键评论
  
  这是为了方便朋友们能够更快速的进行评论，因为让朋友们注册的话有持有密码和密码泄漏的风险，所以直接使用用户名和qq邮箱（方便拿到头像）进行快速评论即可，后台将自动注册登录该用户。

 - github登录：
   
   之前的blog中的登录方式已经被取缔了，所以更新了新的登录方式：
   
   具体可见：[github oauth2 认证](https://docs.github.com/cn/free-pro-team@latest/developers/apps/authorizing-oauth-apps)
   
- 闲言碎语：

  该模块是模拟信息流模式留给博客所有者的独立空间，可以发布心情和感受，更好地完善博客的完整功能————记录美好生活。
 
  
- 后台管理：

[![后台管理](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a68948e4b6d44a8bb5a05156b385ce6~tplv-k3u1fbpfcp-zoom-1.image)](https://imgchr.com/i/rAMKDP)

### 个人信息的填充

  把很多东西都做成了完全可配置的
  例如： 友链、头像等等，如果你不喜欢折腾，可以即插即用，部署好mysql/npm/yarn 就可以一键使用了，未来也会提供一键安装的功能。
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
          link: 'https://github.com/panyunyi97',
          icon: <Icon type='github' theme='filled' className='homepage-icon' />
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
  ```
 
### 后续功能补充（持续更新中）：
----- 2021.1.18-----

  最近偷得浮生半日闲，对一些已知的bug进行了修复，包括但不限于：
  - 明文传输密码改为两次AES加密
  - 评论文章时对qq邮箱进行了check
  - 对IMTP授权码进行了AES加密防止被盗用
  - 修复了 SimpleMDE 的CSS cdn被GFW和谐的问题，改为本地加载
  - 增加了 闲言碎语后台编辑页面
  
应很多小伙伴的要求，开放了一个测试页面，可以供大家测试使用，地址为[测试地址](http://www.panyunyi.cn:81/)

具备管理员权限的用户名为： admin

密码为：admin


>写在后面
>
>再次感谢alvin0216，我只是在前人的肩膀上摘苹果。
>
>大概的功能就是这些，已经完全能够cover日常的工作和分享需求，支持线上的markdown编辑和导入导出。
>
>希望大家都能早日拥有属于自己的博客！



