import React, { Component, Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './index.less'
import { useSelector, useDispatch } from 'react-redux'
import { login, register } from '@/redux/user/actions'
import { DISCUSS_AVATAR } from '@/config'

// methods
import axios from '@/utils/axios'
import { calcCommentsCount } from '@/utils'
import { loginout } from '@/redux/user/actions'
import useAjaxLoading from '@/hooks/useAjaxLoading'
import { save, get, remove } from '@/utils/storage'
// components
import { Comment, Avatar, Button, Divider, Input, Menu, Dropdown, message, Modal, Form } from 'antd'
import List from './list' // 评论列表
import AppAvatar from '@/components/Avatar'
import { DownOutlined, InfoCircleOutlined, GithubOutlined } from '@ant-design/icons'
import useBus from '@/hooks/useBus'

const { TextArea } = Input

const Editor = ({ username, onChange, userNameChange, emailChange, onSubmit, submitting, name, mail, value, articleId }) => (
  <div>
    {username === '' ? (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
        <Form.Item>
          <TextArea rows={1} placeholder='用户名' onChange={userNameChange} value={name} />
        </Form.Item>
        <Form.Item>
          <TextArea rows={1} placeholder='qq邮箱' onChange={emailChange} value={mail} />
        </Form.Item>
      </div>
    ) : (<div />)
    }
    <Form.Item>
      <TextArea rows={4} placeholder='说点什么...' onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <div className='controls'>
        <InfoCircleOutlined className='controls-tip-icon' />
        <span className='controls-tip'>支持 Markdown 语法</span>
        <Button className='disscus-btn' htmlType='submit' loading={submitting} onClick={onSubmit} type='primary'>
          {articleId !== -1 ? '添加评论' : '留言'}
        </Button>
      </div>
    </Form.Item>
  </div>
)
function Discuss(props) {
  const dispatch = useDispatch()
  const bus = useBus()
  let userInfo = useSelector(state => state.user)
  const { username, role } = userInfo

  const { commentList, articleId } = props
  const [value, setValue] = useState('')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [loginUser, setLoginUser] = useState(username)
  const [submitting, withLoading] = useAjaxLoading()

  const renderDropdownMenu = () => {
    return username ? (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key='loginout'>注销</Menu.Item>
      </Menu>
    ) : (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key='login'>登录</Menu.Item>
        <Menu.Item key='register'>注册</Menu.Item>
      </Menu>
    )
  }

  function handleMenuClick(e) {
    switch (e.key) {
      case 'login':
        bus.emit('openSignModal', 'login')

        break

      case 'register':
        bus.emit('openSignModal', 'register')

        break

      case 'loginout':
        dispatch(loginout())
        break

      default:
        break
    }
  }

  function checkEmailAvailable(emailString) {
    const regExp = new RegExp(/[1-9][0-9]{4,}@qq\.com/)
    if (!regExp.test(emailString)) {
      message.error('邮箱不合法')
      return false
    } else {
      message.success('邮箱满足条件')
      return true
    }
  }

  function handleSubmit() {
    if (!value) return

    if (!userInfo.username) {
      if (userInfo == null || userInfo.username === '') {
        const values = { 'username': userName, 'password': 'root', 'email': email }
        const loginValues = { 'account': userName, 'password': 'root' }
        const registerAction = register
        const loginAction = login
        if (!checkEmailAvailable(email)) {
          return
        }
        axios.get(`/user/find/${userName}`).then(res => {
          if (res.id === undefined) {
            dispatch(registerAction(values)).then(res => {
              dispatch(loginAction(loginValues)).then(res => {
                if (res) {
                  userInfo = get('userInfo')
                  setLoginUser(userInfo.username)
                  withLoading(
                    axios.post('/discuss', { articleId: props.articleId, content: value, userId: userInfo.userId })
                  ).then(res => {
                    setValue('')
                    props.setCommentList(res.rows)
                  })
                }
              })
            })
          } else {
            dispatch(loginAction(loginValues)).then(res => {
              if (res) {
                const userInfoNew = get('userInfo')
                withLoading(
                  axios.post('/discuss', { articleId: props.articleId, content: value, userId: userInfoNew.userId })
                ).then(res => {
                  setValue('')
                  props.setCommentList(res.rows)
                })
              }
            })
          }
        })
      }
    } else {
      withLoading(
        axios.post('/discuss', { articleId: props.articleId, content: value, userId: userInfo.userId })
      ).then(res => {
        setValue('')
        props.setCommentList(res.rows)
      })
    }
  }

  return (
    <div id='discuss'>
      <div className='discuss-header'>
        <span className='discuss-count'>{calcCommentsCount(commentList)}</span>
        {articleId !== -1 ? '条评论' : '条留言'}
        <span className='discuss-user'>
          <Dropdown overlay={renderDropdownMenu()} trigger={['click', 'hover']}>
            <span>
              {username || '未登录用户'} <DownOutlined />
            </span>
          </Dropdown>
        </span>
        <Divider className='hr' />
      </div>

      <Comment
        avatar={
          username ? ((userInfo.email !== undefined) && (userInfo.email !== null) ? (
            <img src={'http://q1.qlogo.cn/g?b=qq&nk=' + userInfo.email.split('@')[0] + '&s=100'} alt='头像' />
          ) : (
            <GithubOutlined theme='filled' style={{ fontSize: 40, margin: '5px 5px 0 0' }} />)
          ) : (
            userName ? (
              <img src={'http://q1.qlogo.cn/g?b=qq&nk=' + email.split('@')[0] + '&s=100'} alt='头像' />
            ) : (
              <GithubOutlined theme='filled' style={{ fontSize: 40, margin: '5px 5px 0 0' }} />
            )
          )
        }
        content={
          <Editor
            username={username}
            onChange={e => setValue(e.target.value)}
            userNameChange={e => setUserName(e.target.value)}
            emailChange={e => {
              setEmail(e.target.value)
              checkEmailAvailable(e.target.value)
            }
            }
            onSubmit={handleSubmit}
            submitting={submitting}
            name={userName}
            mail={email}
            value={value}
            articleId={articleId}
          />
        }
      />

      <List commentList={commentList} articleId={articleId} setCommentList={props.setCommentList} />
    </div>
  )
}

Discuss.propTypes = {
  commentList: PropTypes.array.isRequired
}

export default Discuss
