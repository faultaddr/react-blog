import { useParams } from 'react-router-dom'
import { Card, Tag, Space, Spin, Button, message } from 'antd'
import { EyeOutlined, ClockCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { trpc } from '../../trpc'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const articleId = parseInt(id || '0', 10)

  const { data: article, isLoading, error } = trpc.article.byId.useQuery(
    { id: articleId },
    { enabled: !!articleId }
  )

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card>
          <div className="text-center py-10">
            <p className="text-gray-500">文章不存在或无权访问</p>
            <Button type="link" onClick={() => navigate('/')}>
              返回首页
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        返回
      </Button>

      <Card>
        <article>
          <header className="mb-6">
            {article.isTop && (
              <Tag color="red" className="mb-2">
                置顶
              </Tag>
            )}
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <Space wrap className="mb-4">
              {article.tags?.map((tag: any) => (
                <Tag key={tag.id} color="blue">
                  {tag.name}
                </Tag>
              ))}
              {article.categories?.map((cat: any) => (
                <Tag key={cat.id} color="green">
                  {cat.name}
                </Tag>
              ))}
            </Space>
            <div className="text-gray-400 flex items-center gap-4">
              <span>
                <ClockCircleOutlined className="mr-1" />
                {dayjs(article.createdAt).format('YYYY-MM-DD HH:mm')}
              </span>
              <span>
                <EyeOutlined className="mr-1" />
                {article.viewCount} 次阅读
              </span>
            </div>
          </header>

          {article.cover && (
            <img
              src={article.cover}
              alt={article.title}
              className="w-full h-64 object-cover rounded mb-6"
            />
          )}

          <div className="markdown-body">
            <ReactMarkdown>{article.content || ''}</ReactMarkdown>
          </div>
        </article>
      </Card>
    </div>
  )
}
