import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../procedures'
import * as authService from '../../services/auth.service'
import { TRPCError } from '@trpc/server'
import { config } from '../../config'
import { TOKEN_COOKIE_NAME, TOKEN_MAX_AGE } from '@blog/shared'

export const authRouter = router({
  // 注册
  register: publicProcedure
    .input(
      z.object({
        username: z.string().min(2).max(50),
        email: z.string().email(),
        password: z.string().min(6).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await authService.register(input)

        // 设置 cookie
        ctx.res.setCookie(TOKEN_COOKIE_NAME, result.token, {
          httpOnly: true,
          secure: config.isProd,
          sameSite: 'lax',
          maxAge: TOKEN_MAX_AGE,
          path: '/',
        })

        return {
          userId: result.userId,
          username: result.username,
          role: result.role,
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'EMAIL_EXISTS') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: '该邮箱已被注册',
            })
          }
          if (err.message === 'USERNAME_EXISTS') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: '该用户名已被使用',
            })
          }
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '注册失败',
        })
      }
    }),

  // 登录
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await authService.login(input)

        // 设置 cookie
        ctx.res.setCookie(TOKEN_COOKIE_NAME, result.token, {
          httpOnly: true,
          secure: config.isProd,
          sameSite: 'lax',
          maxAge: TOKEN_MAX_AGE,
          path: '/',
        })

        return {
          userId: result.userId,
          username: result.username,
          role: result.role,
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'USER_NOT_FOUND' || err.message === 'PASSWORD_MISMATCH') {
            throw new TRPCError({
              code: 'UNAUTHORIZED',
              message: '邮箱或密码错误',
            })
          }
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '登录失败',
        })
      }
    }),

  // 登出
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie(TOKEN_COOKIE_NAME)
    return { success: true }
  }),

  // 获取当前用户信息
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return null
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        notice: true,
        githubId: true,
        createdAt: true,
      },
    })

    return user
  }),

  // 更新用户资料
  updateProfile: protectedProcedure
    .input(
      z.object({
        username: z.string().min(2).max(50).optional(),
        email: z.string().email().optional(),
        notice: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.user.userId },
        data: input,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          notice: true,
        },
      })

      return user
    }),

  // GitHub OAuth URL
  githubAuthUrl: publicProcedure.query(() => {
    const url = new URL('https://github.com/login/oauth/authorize')
    url.searchParams.set('client_id', config.github.clientId)
    url.searchParams.set('scope', 'read:user user:email')
    url.searchParams.set('redirect_uri', `${config.siteUrl}/auth/github/callback`)
    return { url: url.toString() }
  }),

  // GitHub OAuth 回调
  githubCallback: publicProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // 获取 access token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: config.github.clientId,
          client_secret: config.github.clientSecret,
          code: input.code,
        }),
      })

      const tokenData = await tokenResponse.json() as { access_token?: string; error?: string }

      if (!tokenData.access_token) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'GitHub 授权失败',
        })
      }

      // 获取用户信息
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      })

      const githubUser = await userResponse.json() as any

      // 检查是否是管理员
      const isAdmin = githubUser.login === config.github.adminLogin

      // 如果是管理员且用户不存在，创建管理员账户
      if (isAdmin) {
        const existingAdmin = await ctx.prisma.user.findFirst({
          where: { role: 'ADMIN' },
        })

        if (!existingAdmin) {
          const user = await ctx.prisma.user.create({
            data: {
              githubId: String(githubUser.id),
              username: githubUser.login,
              githubProfile: githubUser,
              role: 'ADMIN',
            },
          })

          const token = authService.generateToken({
            userId: user.id,
            username: user.username,
            role: user.role,
          })

          ctx.res.setCookie(TOKEN_COOKIE_NAME, token, {
            httpOnly: true,
            secure: config.isProd,
            sameSite: 'lax',
            maxAge: TOKEN_MAX_AGE,
            path: '/',
          })

          return { success: true, isAdmin: true }
        }
      }

      // 创建或更新用户
      const result = await authService.findOrCreateGithubUser(githubUser)

      ctx.res.setCookie(TOKEN_COOKIE_NAME, result.token, {
        httpOnly: true,
        secure: config.isProd,
        sameSite: 'lax',
        maxAge: TOKEN_MAX_AGE,
        path: '/',
      })

      return { success: true, isAdmin: result.role === 'ADMIN' }
    }),
})
