import { router, publicProcedure } from '../procedures'
import { authRouter } from './auth'
import { articleRouter, tagRouter, categoryRouter } from './article'
import { commentRouter, replyRouter } from './comment'
import { fragmentRouter } from './fragment'
import { monitorRouter } from './monitor'

export const appRouter = router({
  // 健康检查
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),

  // 认证路由
  auth: authRouter,

  // 文章路由
  article: articleRouter,
  tag: tagRouter,
  category: categoryRouter,

  // 评论路由
  comment: commentRouter,
  reply: replyRouter,

  // 碎片路由
  fragment: fragmentRouter,

  // 监控路由
  monitor: monitorRouter,
})

export type AppRouter = typeof appRouter
