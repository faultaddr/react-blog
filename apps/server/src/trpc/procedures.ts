import { initTRPC } from '@trpc/server'
import type { Context } from './context'
import { TRPCError } from '@trpc/server'

const t = initTRPC.context<Context>().create()

// 公开接口
export const publicProcedure = t.procedure

// 需登录
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: '请先登录',
    })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

// 仅管理员
export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: '没有权限执行此操作',
    })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

export const router = t.router
export const middleware = t.middleware
