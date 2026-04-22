import { router, publicProcedure } from '../procedures'
import { authRouter } from './auth'

export const appRouter = router({
  // 健康检查
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),

  // 认证路由
  auth: authRouter,
})

export type AppRouter = typeof appRouter
