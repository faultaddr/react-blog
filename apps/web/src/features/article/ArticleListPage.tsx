import { Card, Tag, Space, Empty, Pagination, Input, Spin } from 'antd'
import { EyeOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { trpc } from '../../trpc'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

export function ArticleListPage() {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const pageSize = 10

  const { data, isLoading } = trpc.article.list.useQuery({
    page,
    pageSize,
    keyword: keyword || undefined,
  })

  const articles = data?.items || []
  const total = data?.total || 0

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Input.Search
          placeholder="搜索文章"
          allowClear
          enterButton="搜索"
          size="large"
          onSearch={(value) => {
            setKeyword(value)
            setPage(1)
          }}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : articles.length === 0 ? (
        <Empty description="暂无文章" />
      ) : (
        <div className="space-y-4">
          {articles.map((article: any) => (
            <Link key={article.id} to={`/article/${article.id}`}>
              <Card
                hoverable
                className="transition-shadow hover:shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">
                      {article.isTop && (
                        <Tag color="red" className="mr-2">
                          置顶
                        </Tag>
                      )}
                      {article.title}
                    </h2>
                    {article.summary && (
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {article.summary}
                      </p>
                    )}
                    <Space wrap className="mb-2">
                      {article.tags?.map((tag: any) => (
                        <Tag key={tag.id} color="blue">
                          {tag.name}
                        </Tag>
                      ))}
                    </Space>
                    <div className="text-gray-400 text-sm flex items-center gap-4">
                      <span>
                        <ClockCircleOutlined className="mr-1" />
                        {dayjs(article.createdAt).format('YYYY-MM-DD')}
                      </span>
                      <span>
                        <EyeOutlined className="mr-1" />
                        {article.viewCount}
                      </span>
                    </div>
                  </div>
                  {article.cover && (
                    <img
                      src={article.cover}
                      alt={article.title}
                      className="w-32 h-24 object-cover rounded ml-4"
                    />
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {total > pageSize && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  )
}
