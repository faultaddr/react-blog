import { Card, Row, Col, Statistic, Spin } from 'antd'
import { FileTextOutlined, UserOutlined, MessageOutlined, EyeOutlined } from '@ant-design/icons'
import { trpc } from '../../trpc'

export function DashboardPage() {
  const { data: stats, isLoading } = trpc.monitor.stats.useQuery()

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="文章总数"
              value={stats?.articles || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="评论总数"
              value={stats?.comments || 0}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={stats?.users || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总阅读量"
              value={stats?.views || 0}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
