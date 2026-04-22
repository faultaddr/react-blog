import { Table, Button, Tag, Space, Popconfirm, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, VerticalAlignTopOutlined, LockOutlined } from '@ant-design/icons'
import { trpc } from '../../trpc'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

export function ArticleManagePage() {
  const navigate = useNavigate()
  const utils = trpc.useUtils()

  const { data, isLoading } = trpc.article.list.useQuery({
    page: 1,
    pageSize: 20,
  })

  const deleteMutation = trpc.article.delete.useMutation({
    onSuccess: () => {
      message.success('删除成功')
      utils.article.list.invalidate()
    },
    onError: () => {
      message.error('删除失败')
    },
  })

  const toggleTopMutation = trpc.article.toggleTop.useMutation({
    onSuccess: () => {
      message.success('操作成功')
      utils.article.list.invalidate()
    },
  })

  const togglePrivateMutation = trpc.article.togglePrivate.useMutation({
    onSuccess: () => {
      message.success('操作成功')
      utils.article.list.invalidate()
    },
  })

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: any) => (
        <span>
          {record.isTop && <Tag color="red">置顶</Tag>}
          {record.isPrivate && <Tag color="orange">私密</Tag>}
          {title}
        </span>
      ),
    },
    {
      title: '阅读量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/articles/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            icon={<VerticalAlignTopOutlined />}
            onClick={() => toggleTopMutation.mutate({ id: record.id })}
          >
            {record.isTop ? '取消置顶' : '置顶'}
          </Button>
          <Button
            type="link"
            size="small"
            icon={<LockOutlined />}
            onClick={() => togglePrivateMutation.mutate({ id: record.id })}
          >
            {record.isPrivate ? '公开' : '私密'}
          </Button>
          <Popconfirm
            title="确定要删除这篇文章吗？"
            onConfirm={() => deleteMutation.mutate({ id: record.id })}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/articles/create')}
        >
          新建文章
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.items || []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          total: data?.total || 0,
          pageSize: 20,
        }}
      />
    </div>
  )
}
