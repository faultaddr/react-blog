import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { trpc } from '../../trpc'
import { useEffect } from 'react'

export function Header() {
  const location = useLocation()
  const { user, setUser, setLoading, isLoading } = useAuthStore()
  const { data: userData } = trpc.auth.me.useQuery()

  useEffect(() => {
    if (userData) {
      setUser(userData as any)
    } else {
      setLoading(false)
    }
  }, [userData, setUser, setLoading])

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      setUser(null)
    },
  })

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/articles', label: '文章' },
  ]

  if (user?.role === 'ADMIN') {
    navItems.push({ path: '/admin', label: '后台' })
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              React Blog
            </Link>
            <nav className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <span className="text-gray-400">加载中...</span>
            ) : user ? (
              <>
                <span className="text-gray-600">{user.username}</span>
                <button
                  onClick={() => logoutMutation.mutate()}
                  className="text-gray-600 hover:text-gray-900"
                >
                  登出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  登录
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
