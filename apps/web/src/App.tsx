import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { trpc } from './trpc'
import { Header } from './components/layout'
import { LoginPage, RegisterPage } from './features/auth'
import { ArticleListPage, ArticleDetailPage } from './features/article'
import { AdminLayout, DashboardPage, ArticleManagePage } from './features/admin'
import { useAuthStore } from './stores/useAuthStore'

// 首页
function HomePage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <ArticleListPage />
    </div>
  )
}

// 受保护的路由
function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)

  if (isLoading) {
    return <div className="flex justify-center py-20">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  const health = trpc.health.useQuery()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 前台路由 */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <HomePage />
              </>
            }
          />
          <Route
            path="/articles"
            element={
              <>
                <Header />
                <ArticleListPage />
              </>
            }
          />
          <Route
            path="/article/:id"
            element={
              <>
                <Header />
                <ArticleDetailPage />
              </>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 后台路由 */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="articles" element={<ArticleManagePage />} />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900">404</h1>
                  <p className="text-gray-500 mt-2">页面不存在</p>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
