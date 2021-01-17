import { Button, Input, Modal, BackTop, message, Switch } from 'antd'
import MdEditor from '@/components/MdEditor'
import React, { Component, useState, useEffect } from 'react'
import axios from '@/utils/axios'
import dayjs from 'dayjs'
function FragmentEdit(props) {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('panyunyi')
  function add() {
    axios
      .post('/fragment/create', {
        content,
        author
      })
      .then(res => {
        message.success('创建成功')
      })
  }
  return (
    <div className='admin-edit-article'>
      <MdEditor value={content} onChange={setContent} />
      <Button
        type='primary'
        shape='circle'
        size='large'
        className='action-icon'
        title={'发布'}
        icon={'plus'}
        onClick={() => {
          add()
        }}
      />
      <BackTop target={() => document.querySelector('.admin-content-wrap')} />
    </div>
  )
}

export default FragmentEdit
