import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useMediaQuery } from 'react-responsive'

// components
import { Divider, Empty, Drawer, Tag, Spin } from 'antd'
import { MenuOutlined } from '@ant-design/icons'

const title = '快速导航'

const List = props => {
  const { list, showTitle = true } = props
  return (
    <ul className='preview'>
      {showTitle && <Divider>{title}</Divider>}
      {list.map(item => (
        <li key={item.id}>
          <Link to={`/article/${item.id}`}>{item.title}</Link>
        </li>
      ))}
      <a href='https://beian.miit.gov.cn/' target='_blank'>京ICP备16068058号-1</a>
      <p></p>
      <a href='https://beian.miit.gov.cn/' target='_blank'>京ICP备16068058号-3</a>
      <p></p>
    </ul>
  )
}

/**
 * article quick link
 */
const QuickLink = props => {
  const isGreaterThan1300 = useMediaQuery({ query: '(min-width: 1300px)' })
  const { list } = props

  const [drawerVisible, setDrawerVisible] = useState(false)

  return isGreaterThan1300 ? <div className='preview'> <List list={list} />
  </div> : (
    <>
      <div className='drawer-btn' onClick={e => setDrawerVisible(true)}>
        <MenuOutlined className='nav-phone-icon' />
      </div>
      <Drawer
        title={title}
        placement='right'
        closable={false}
        onClose={e => setDrawerVisible(false)}
        visible={drawerVisible}
        getContainer={() => document.querySelector('.app-home')}>
        <List list={list} showTitle={false} />
        <a href='https://beian.miit.gov.cn/' target='_blank'>京ICP备16068058号-1</a>
        <p></p>
        <a href='https://beian.miit.gov.cn/' target='_blank'>京ICP备16068058号-3</a>
        <p></p>
      </Drawer>
    </>
  )
}

export default QuickLink

