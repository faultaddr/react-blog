import React, { Component, useState, useEffect } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Table, Tag, Switch, message, Input, Button, Popconfirm, Select, Form } from 'antd'

import axios from '@/utils/axios'

import { Link } from 'react-router-dom'
import dayjs from '@/utils/dayjs'
import download from '@/utils/download'

import useAntdTable from '@/hooks/useAntdTable'

import useBreadcrumb from '@/hooks/useBreadcrumb'

function FragmentManager(props) {
  useBreadcrumb(['碎语管理'])

  const [queryParams, setQueryParams] = useState({})
  const [batch, setBatch] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const { tableProps, updateList, onSearch } = useAntdTable({
    requestUrl: '/fragment/list',
    queryParams,
    columns: [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '作者',
        dataIndex: 'author',
      },

      {
        title: '发布时间',
        dataIndex: 'createdAt',
        sorter: (a, b) => (dayjs(a.createdAt).isBefore(b.createdAt) ? 1 : -1),
      },
      {
        dataIndex: 'id',
        title: '操作',
        render: (articleId, record) => {
          return (
            <ul className='action-list'>
              <li>
                <Link to={{ pathname: `/admin/fragment/edit/${record.id}`, state: { articleId } }}>编辑</Link>
              </li>
              <li>
                <Popconfirm
                  title='Are you sure？'
                  cancelText='No'
                  onConfirm={e => updateList(() => axios.delete(`/fragment/${articleId}`))}>
                  <a className='delete-text'>删除</a>
                </Popconfirm>
              </li>
            </ul>
          )
        },
      },
    ],
  })

  function delList() {
    axios.delete(`/fragment/list/${selectedRowKeys}`).then(() => {
      onSearch()
      setSelectedRowKeys([])
    })
  }

  const handleSubmit = values => {
    try {
      setQueryParams({ ...queryParams, ...values })
      onSearch({ ...queryParams, ...values })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const rowSelection = batch ? {
    selectedRowKeys,
    onChange: selectList => setSelectedRowKeys(selectList),
  } : null

  return (
    <div className='admin-fragment-manager'>
      {/* 检索 */}
      <Form layout='inline' onFinish={handleSubmit} style={{ marginBottom: 20 }}>
        <Form.Item label='关键词' name='keyword'>
          <Input placeholder='请输入碎语关键词' allowClear />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' style={{ marginRight: 8 }}>
            检索
          </Button>
        </Form.Item>
      </Form>

      <Table
        {...tableProps}
        rowSelection={rowSelection}
        footer={() => (
          <>
            批量操作 <Switch checked={batch} onChange={e => setBatch(prev => !prev)} style={{ marginRight: 8 }} />
            {batch && (
              <>
                <Popconfirm
                  title='Are you sure delete the fragments?'
                  onConfirm={delList}
                  // onCancel={cancel}
                  okText='Yes'
                  cancelText='No'>
                  <Button type='danger' size='small' disabled={selectedRowKeys.length === 0}>
                    批量删除
                  </Button>
                </Popconfirm>
              </>
            )}
          </>
        )}
      />
    </div>
  )
}

export default FragmentManager
