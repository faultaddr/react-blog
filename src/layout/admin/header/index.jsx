import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { loginout } from '@/redux/user/actions'

import { Button, Dropdown, Menu, Avatar } from 'antd'
import logo from '@/assets/images/avatar.jpeg'
import { DownOutlined } from '@ant-design/icons'

function AdminHeader(props) {
  const dispatch = useDispatch()
  const history = useHistory()

  const userInfo = useSelector(state => state.user)

  const menu = (
    <Menu className='menu'>
      <Menu.Item>
        <span onClick={e => history.push('/home')}>
          返回主页
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={e => {
            dispatch(loginout())
            history.push('/')
          }}>
          退出登录
        </span>
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <div>
        {/* <img src={logo} alt='pvmed' /> */}
        <span className='header-title' onClick={e => history.push('/home')}>React-Blog Manager</span>
        <Dropdown overlay={menu} className='header-dropdown'>
          <a className='ant-dropdown-link'>
            {userInfo.username} <DownOutlined />
          </a>
        </Dropdown>
      </div>
    </>
  )
}

export default AdminHeader
