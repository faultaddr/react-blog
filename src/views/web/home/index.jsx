import React, { useMemo } from 'react'
import './index.less'

import { decodeQuery, translateMarkdown2html } from '@/utils'
import { HOME_PAGESIZE } from '@/utils/config'

// components
import QuickLink from './QuickLink'
import ArticleList from './List'

import { Empty, Spin } from 'antd'
import WebPagination from '@/components/Pagination'

// hooks
import useFetchList from '@/hooks/useFetchList'
import ContributionChart from './Contribution'
const Home = props => {
  const { loading, pagination, dataList } = useFetchList({
    requestUrl: '/article/list',
    queryParams: { pageSize: HOME_PAGESIZE, type: true },
    fetchDependence: [props.location.search]
  })

  const list = useMemo(() => {
    return [...dataList].map(item => {
      const index = item.content.indexOf('<!--more-->')
      item.content = translateMarkdown2html(item.content.slice(0, index))
      return item
    })
  }, [dataList])

  const { keyword } = decodeQuery(props.location.search)

  return (
    <Spin tip='Loading...' spinning={loading}>
      <div className='app-home'>
        {/* list  */}
        <ArticleList list={list} />

        {/* quick link */}
        <QuickLink list={list} />

        <ContributionChart userName='faultaddr' />

        {/* serach empty result */}
        {list.length === 0 && keyword && (
          <div className='no-data'>
            <Empty description={(
              <span>
                不存在标题/内容中含有 <span className='keyword'>{keyword}</span> 的文章！
              </span>
            )} />
          </div>
        )}

        <WebPagination
          {...pagination}
          onChange={
            (page, pageSize) => {
              document.querySelector('.app-main').scrollTop = 0 // turn to the top
              pagination.onChange(page, pageSize)
            }
          } />
      </div>
    </Spin>
  )
}

export default Home
