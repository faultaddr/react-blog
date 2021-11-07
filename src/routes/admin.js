import Layout from '@/layout/admin'
import lazy from '@/components/Lazy'

export default {
  path: '/admin',
  name: 'home',
  component: Layout,
  childRoutes: [
    { path: '', component: lazy(() => import('@/views/admin/home')) },
    { path: 'article/edit/:id', component: lazy(() => import('@/views/admin/article/edit')) },
    { path: 'article/add', component: lazy(() => import('@/views/admin/article/edit')) },
    { path: 'article/manager', component: lazy(() => import('@/views/admin/article/manager')) },
    { path: 'article/graph', component: lazy(() => import('@/views/admin/article/graph')) },
    { path: 'fragment/add', component: lazy(() => import('@/views/admin/fragment/edit')) },
    { path: 'fragment/edit/:id', component: lazy(() => import('@/views/admin/fragment/edit')) },
    { path: 'fragment/manager', component: lazy(() => import('@/views/admin/fragment/manager')) },
    { path: 'user', component: lazy(() => import('@/views/admin/user')) },
    { path: 'monitor', component: lazy(() => import('@/views/admin/monitor')) },
  ],
}
