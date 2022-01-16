import React, { useState, useEffect, Fragment } from 'react'
import './index.less'

import { ARCHIVES_PAGESIZE } from '@/utils/config'

// methods
import { groupBy } from '@/utils'

// components
import { Timeline, Spin } from 'antd'
import { Link } from 'react-router-dom'
import WebPagination from '@/components/Pagination'

// hooks
import useFetchList from '@/hooks/useFetchList'
import { ClockCircleOutlined } from '@ant-design/icons'
function MsgSort(obj) {
  obj.sort((a, b) => {
    const t1 = new Date(Date.parse(a.createdAt.replace(/-/g, '/')))
    const t2 = new Date(Date.parse(b.createdAt.replace(/-/g, '/')))
    return t2.getTime() - t1.getTime()
  })
  return obj
}
function Archives(props) {
  const { dataList, loading, pagination } = useFetchList({
    requestUrl: '/article/list',
    queryParams: {
      pageSize: ARCHIVES_PAGESIZE,
      type: true
    },
    fetchDependence: [props.location.pathname, props.location.search]
  })
  const list = groupBy(dataList, item => item.createdAt.slice(0, 4)) // 按年份排序
  list.map((d, i) => (MsgSort(d)))
  return (
    <div className='app-archives'>
      <Spin tip='Loading...' spinning={loading} delay={500}>
        <Timeline>
          {list.map((d, i) => (
            <Fragment key={i}>
              {i === 0 && (
                <Timeline.Item>
                  <span className='desc'>{`共计 ${pagination.total} 篇文章`}</span>
                  <br />
                  <br />
                </Timeline.Item>
              )}

              <Timeline.Item style = {{ background: 'transparent'}} dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />} color='red'>
                <div className='year'>
                  {d[0]['createdAt'].slice(0, 4)}
                  ...
                </div>
                <br />
              </Timeline.Item>

              {d.map(item => (
                <Timeline.Item key={item.id}>
                  <span style={{ fontSize: '13px', marginRight: '16px' }}>{item.createdAt.slice(5, 10)}</span>
                  <Link to={`/article/${item.id}`}>{item.title}</Link>
                </Timeline.Item>
              ))}
            </Fragment>
          ))}
        </Timeline>

        <WebPagination {...pagination} style={{ float: 'initial', marginTop: 10 }} />
      </Spin>
    </div>
  )
}

export default Archives
