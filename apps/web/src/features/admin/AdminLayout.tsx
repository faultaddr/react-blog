import { Layout, Menu } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  FileTextOutlined,
  UserOutlined,
  DashboardOutlined,
  MessageOutlined,
} from '@ant-design/icons'

const { Sider, Content } = Layout

const menuItems = [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: '/admin/articles',
    icon: <FileTextOutlined />,
    label: '文章管理',
  },
  {
    key: '/admin/users',
    icon: <UserOutlined />,
    label: '用户管理',
  },
  {
    key: '/admin/comments',
    icon: <MessageOutlined />,
    label: '评论管理',
  },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Layout className="min-h-screen">
      <Sider width={200} className="bg-white">
        <div className="h-16 flex items-center justify-center border-b">
          <span className="text-lg font-bold">后台管理</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Content className="p-6 bg-gray-50">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
