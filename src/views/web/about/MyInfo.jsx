import React from 'react'

// components
import { Divider, Rate, Avatar } from 'antd'
import Href from '@/components/Href'
import SvgIcon from '@/components/SvgIcon'
import { QqOutline } from 'utils/antdIcon'

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
          <QqOutline /> 779087031
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
