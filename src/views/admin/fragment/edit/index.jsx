import { Button, Input, Modal, BackTop, message, Switch, Icon } from 'antd'
import MdEditor from '@/components/MdEditor'
import React, { Component, useState, useEffect } from 'react'
import axios from '@/utils/axios'
import { PlusCircleFill, PlusCircleOutline } from 'utils/antdIcon'
function FragmentEdit(props) {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('panyunyi')
  const editId = parseInt(props.match.params.id)
  function fetchFragment(id) {
    axios.get(`/fragment/${id}`).then(res => {
      setContent(res.content)
    })
  }

  useEffect(() => {
    // did mounted
    if (editId) {
      fetchFragment(editId)
    } else {
    }
  }, [props.match.params])
  function add() {
    axios
      .post('/fragment/create', {
        content,
        author,
      })
      .then(res => {
        message.success('创建成功')
      })
  }
  function update() {
    axios
      .put(`/fragment/${editId}`, {
        content,
        author,
      })
      .then(res => {
        message.success('更新成功')
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
        title={editId ? '更新' : '发布'}
        icon={editId ? <PlusCircleFill /> : <PlusCircleOutline />}
        onClick={() => {
          editId ? update() : add()
        }}
      />
      <BackTop target={() => document.querySelector('.admin-content-wrap')} />
    </div>
  )
}

export default FragmentEdit
