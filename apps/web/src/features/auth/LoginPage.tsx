import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { trpc } from '../../trpc'
import { useAuthStore } from '../../stores/useAuthStore'
import { useNavigate, Link } from 'react-router-dom'

export function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      message.success('登录成功')
      setUser({
        id: data.userId,
        username: data.username,
        email: null,
        role: data.role,
        notice: true,
        githubId: null,
        createdAt: new Date().toISOString(),
      })
      navigate('/')
    },
    onError: (error) => {
      message.error(error.message || '登录失败')
    },
  })

  const onFinish = (values: { email: string; password: string }) => {
    loginMutation.mutate(values)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card title="登录" className="w-full max-w-md">
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="邮箱" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginMutation.isPending}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>

          <div className="text-center">
            <span className="text-gray-500">还没有账号？</span>
            <Link to="/register" className="text-blue-500 ml-1">
              注册
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}
