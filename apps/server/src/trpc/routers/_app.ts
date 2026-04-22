import { router, publicProcedure } from '../procedures'

export const appRouter = router({
  // 健康检查
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),
})

export type AppRouter = typeof appRouter
