import { describe, it, expect, beforeEach, vi } from 'vitest'
import { initTRPC, TRPCError } from '@trpc/server'

describe('tRPC Procedures', () => {
  describe('publicProcedure', () => {
    it('should allow access without authentication', async () => {
      type Context = { user: null }
      const t = initTRPC.context<Context>().create()

      const publicProcedure = t.procedure

      const router = t.router({
        test: publicProcedure.query(() => 'public data'),
      })

      const caller = router.createCaller({ user: null })
      const result = await caller.test()

      expect(result).toBe('public data')
    })
  })

  describe('protectedProcedure', () => {
    it('should deny access without authentication', async () => {
      type Context = { user: { userId: number; username: string; role: string } | null }
      const t = initTRPC.context<Context>().create()

      const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
        if (!ctx.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: '请先登录',
          })
        }
        return next({ ctx: { ...ctx, user: ctx.user } })
      })

      const router = t.router({
        protected: protectedProcedure.query(() => 'protected data'),
      })

      // Test without user - should throw
      const anonymousCaller = router.createCaller({ user: null })
      await expect(anonymousCaller.protected()).rejects.toThrow('请先登录')

      // Test with user - should succeed
      const userCaller = router.createCaller({ user: { userId: 1, username: 'test', role: 'USER' } })
      const result = await userCaller.protected()
      expect(result).toBe('protected data')
    })
  })

  describe('adminProcedure', () => {
    it('should deny access to non-admin users', async () => {
      type Context = { user: { userId: number; username: string; role: string } | null }
      const t = initTRPC.context<Context>().create()

      const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
        if (!ctx.user || ctx.user.role !== 'ADMIN') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: '没有权限执行此操作',
          })
        }
        return next({ ctx: { ...ctx, user: ctx.user } })
      })

      const router = t.router({
        adminOnly: adminProcedure.query(() => 'admin data'),
      })

      // Test without user - should throw
      const anonymousCaller = router.createCaller({ user: null })
      await expect(anonymousCaller.adminOnly()).rejects.toThrow('没有权限')

      // Test with regular user - should throw
      const userCaller = router.createCaller({ user: { userId: 1, username: 'test', role: 'USER' } })
      await expect(userCaller.adminOnly()).rejects.toThrow('没有权限')

      // Test with admin - should succeed
      const adminCaller = router.createCaller({ user: { userId: 1, username: 'admin', role: 'ADMIN' } })
      const result = await adminCaller.adminOnly()
      expect(result).toBe('admin data')
    })
  })

  describe('input validation', () => {
    it('should validate input with zod schema', async () => {
      type Context = {}
      const t = initTRPC.context<Context>().create()
      const { z } = await import('zod')

      const router = t.router({
        validateInput: t.procedure
          .input(z.object({
            email: z.string().email(),
            age: z.number().min(0).max(150),
          }))
          .query(({ input }) => input),
      })

      const caller = router.createCaller({})

      // Valid input
      const validResult = await caller.validateInput({ email: 'test@example.com', age: 25 })
      expect(validResult.email).toBe('test@example.com')

      // Invalid email
      await expect(caller.validateInput({ email: 'invalid', age: 25 })).rejects.toThrow()

      // Invalid age
      await expect(caller.validateInput({ email: 'test@example.com', age: 200 })).rejects.toThrow()
    })
  })

  describe('error handling', () => {
    it('should throw TRPCError with correct code', async () => {
      type Context = {}
      const t = initTRPC.context<Context>().create()

      const router = t.router({
        notFound: t.procedure.query(() => {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Resource not found',
          })
        }),
        badRequest: t.procedure.query(() => {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid input',
          })
        }),
      })

      const caller = router.createCaller({})

      await expect(caller.notFound()).rejects.toMatchObject({
        code: 'NOT_FOUND',
        message: 'Resource not found',
      })

      await expect(caller.badRequest()).rejects.toMatchObject({
        code: 'BAD_REQUEST',
        message: 'Invalid input',
      })
    })
  })
})
