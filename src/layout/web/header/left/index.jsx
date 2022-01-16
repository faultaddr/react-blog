import React, { useState } from 'react'
import { Dropdown, Menu, Input, message, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { useHistory, useLocation } from 'react-router-dom'

// import config
import { HEADER_BLOG_NAME } from '@/config'
import navList from '../right/navList'

// icon
import SvgIcon from '@/components/SvgIcon'
import { MenuOutlined, SearchOutlined } from '@ant-design/icons'

const HeaderLeft = props => {
  const [keyword, setKeyword] = useState('')
  const history = useHistory()

  function handleChange(e) {
    e.preventDefault()
    setKeyword(e.target.value)
  }

  function onPressEnter(e) {
    e.target.blur()
  }

  function onSubmit() {
    history.push(`/home?page=1&keyword=${keyword}`)
    setKeyword('')
  }

  function clickSearch(e) {
    e.stopPropagation()
  }

  const menu = (
    <Menu className='header-nav'>
      {navList.map(nav => (
        <Menu.Item key={nav.link}>
          <Link to={nav.link}>
            {nav.icon}
            <span className='nav-text'>{nav.title}</span>
          </Link>
        </Menu.Item>
      ))}
      <Menu.Item key={'search'}>
        <SearchOutlined />
        <Input
          className='search-input'
          onClick={clickSearch}
          value={keyword}
          onChange={handleChange}
          onPressEnter={onPressEnter}
          onBlur={onSubmit}
        />
      </Menu.Item>
    </Menu>
  )

  return (
    <div className='header-left'>
      <SvgIcon type='iconblog' style={{ color: '#055796', width: 16, height: 16, transform: 'translateY(-2px)' }} />
      <span className='blog-name' onClick={e => history.push('/home')} >{HEADER_BLOG_NAME}</span>
      <Dropdown
        overlayClassName='header-dropdown'
        trigger={['click']}
        overlay={menu}
        getPopupContainer={() => document.querySelector('.app-header .header-left')}>
        <MenuOutlined className='header-dropdown-icon' />
      </Dropdown>
    </div>
  )
}

export default HeaderLeft
