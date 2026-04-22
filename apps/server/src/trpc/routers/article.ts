import { z } from 'zod'
import { router, publicProcedure, adminProcedure } from '../procedures'
import * as articleService from '../../services/article.service'
import { TRPCError } from '@trpc/server'

export const articleRouter = router({
  // 文章列表
  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().max(100).default(10),
        keyword: z.string().optional(),
        tag: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // 普通用户只能看到公开文章
      const isAdmin = ctx.user?.role === 'ADMIN'
      return articleService.getArticleList({
        ...input,
        isPrivate: isAdmin ? undefined : false,
      })
    }),

  // 按 ID 获取文章
  byId: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx.user?.role === 'ADMIN'
      const article = await articleService.getArticleById(input.id, isAdmin)

      if (!article) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '文章不存在',
        })
      }

      // 增加阅读数
      await articleService.incrementViewCount(input.id)

      return article
    }),

  // 通过 UUID 获取私密文章
  byUuid: publicProcedure
    .input(z.object({ uuid: z.string().length(32) }))
    .query(async ({ input }) => {
      const article = await articleService.getArticleByUuid(input.uuid)

      if (!article) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '文章不存在或链接已失效',
        })
      }

      return article
    }),

  // 创建文章
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        slug: z.string().max(255).optional(),
        content: z.string().optional(),
        summary: z.string().max(500).optional(),
        cover: z.string().url().optional(),
        isPrivate: z.boolean().default(false),
        tags: z.array(z.string().max(50)).default([]),
        categories: z.array(z.string().max(50)).default([]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await articleService.createArticle(input)
      } catch (err: any) {
        if (err.code === 'P2002') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: err.meta?.target?.includes('title')
              ? '文章标题已存在'
              : '文章 slug 已存在',
          })
        }
        throw err
      }
    }),

  // 更新文章
  update: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().max(255).optional(),
        content: z.string().optional(),
        summary: z.string().max(500).optional(),
        cover: z.string().url().optional(),
        isPrivate: z.boolean().optional(),
        tags: z.array(z.string().max(50)).optional(),
        categories: z.array(z.string().max(50)).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      try {
        return await articleService.updateArticle(id, data)
      } catch (err: any) {
        if (err.code === 'P2002') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: '文章标题或 slug 已存在',
          })
        }
        throw err
      }
    }),

  // 删除文章
  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await articleService.deleteArticle(input.id)
      return { success: true }
    }),

  // 置顶/取消置顶
  toggleTop: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return articleService.toggleArticleTop(input.id)
    }),

  // 私密/公开
  togglePrivate: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return articleService.toggleArticlePrivate(input.id)
    }),
})

// 标签和分类路由
export const tagRouter = router({
  list: publicProcedure.query(async () => {
    return articleService.getAllTags()
  }),
})

export const categoryRouter = router({
  list: publicProcedure.query(async () => {
    return articleService.getAllCategories()
  }),
})
