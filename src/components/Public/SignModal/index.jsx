import React, { useState, useEffect, useRef } from 'react'

import { Input, Button, Modal, Form } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'

import { GITHUB } from '@/config'
import { save } from '@/utils/storage'

// redux
import { login, register } from '@/redux/user/actions'
import { useDispatch } from 'react-redux'

// hooks
import { useListener } from '@/hooks/useBus'

const FormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
}

function FormItem(props) {
  const { children, ...rest } = props
  return <Form.Item {...FormItemLayout} {...rest}>{children}</Form.Item>
}

function SignModal(props) {
  const dispatch = useDispatch() // dispatch hooks
  const location = useLocation() // location
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState('login')
  const [form] = Form.useForm()
  useListener('openSignModal', type => {
    form.resetFields()
    setType(type)
    setVisible(true)
  })

  function handleSubmit(e) {
    e.preventDefault()
    const action = type === 'login' ? login : register
    form.validateFields().then(values => {
      dispatch(action(values)).then(() => {
        setVisible(false) // type =  login | register
      })
    })
  }

  function githubLogin() {
    const { pathname, search } = location
    save('prevRouter', `${pathname}${search}`)
    window.location.href = `${GITHUB.url}?client_id=${GITHUB.client_id}`
  }

  // 确认密码
  function compareToFirstPassword(rule, value, callback) {
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  return (
    <Modal
      width={460}
      title={type}
      visible={visible}
      onCancel={e => setVisible(false)}
      footer={null}>
      <Form layout='horizontal' form={form}>
        {type === 'login' ? (
          <>
            <FormItem label='用户名' name='account'
              rules={[{ required: true, message: 'Username is required' }]}>
              <Input placeholder='请输入用户名' />
            </FormItem>
            <FormItem label='密码' name='password'
              rules={[{ required: true, message: 'Password is required' }]}>
              <Input placeholder='请输入密码' type='password' />
            </FormItem>
          </>
        )
          : (
            <>
              <FormItem label='用户名' name='username' rules={[{ required: true, message: 'Username is required' }]}>
                <Input placeholder='请输入用户名' />
              </FormItem>
              <FormItem label='密码' name='password' rules={[{ required: true, message: 'Password is required' }]}>
                <Input placeholder='请输入密码' type='password' />
              </FormItem>
              <FormItem label='确认密码' name='confirm' rules={[
                { required: true, message: 'Password is required' },
                { validator: compareToFirstPassword }
              ]}>
                <Input placeholder='确认密码' type='password' />
              </FormItem>
              <FormItem label='邮箱' name='email'
                rules={[
                  { type: 'email', message: 'The input is not valid E-mail!' },
                  { required: true, message: 'Please input your E-mail!' }
                ]}>
                <Input placeholder='请输入您的邮箱' />
              </FormItem>
            </>
          )}
      </Form>
      <Button type='primary' block onClick={handleSubmit}>
        {type}
      </Button>
      {GITHUB.enable && (
        <Button block icon={<GithubOutlined />} onClick={githubLogin} style={{ marginTop: 10 }}>
          github login
        </Button>
      )}
    </Modal>
  )
}

export default SignModal
