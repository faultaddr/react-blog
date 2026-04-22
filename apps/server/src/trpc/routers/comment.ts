import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../procedures'
import * as commentService from '../../services/comment.service'
import { TRPCError } from '@trpc/server'

export const commentRouter = router({
  list: publicProcedure
    .input(z.object({ articleId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return commentService.getCommentsByArticle(input.articleId)
    }),

  create: protectedProcedure
    .input(
      z.object({
        articleId: z.number().int().positive(),
        content: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await commentService.createComment(
          input.articleId,
          ctx.user.userId,
          input.content
        )
      } catch (err) {
        if (err instanceof Error && err.message === 'USER_DISABLED') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: '您已被禁言',
          })
        }
        throw err
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await commentService.deleteComment(
          input.id,
          ctx.user.userId,
          ctx.user.role === 'ADMIN'
        )
        return { success: true }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'COMMENT_NOT_FOUND') {
            throw new TRPCError({ code: 'NOT_FOUND', message: '评论不存在' })
          }
          if (err.message === 'FORBIDDEN') {
            throw new TRPCError({ code: 'FORBIDDEN', message: '没有权限删除此评论' })
          }
        }
        throw err
      }
    }),
})

export const replyRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        commentId: z.number().int().positive(),
        content: z.string().min(1).max(5000),
        replyTo: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await commentService.createReply(
          input.commentId,
          ctx.user.userId,
          input.content,
          input.replyTo
        )
      } catch (err) {
        if (err instanceof Error && err.message === 'USER_DISABLED') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: '您已被禁言',
          })
        }
        throw err
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await commentService.deleteReply(
          input.id,
          ctx.user.userId,
          ctx.user.role === 'ADMIN'
        )
        return { success: true }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'REPLY_NOT_FOUND') {
            throw new TRPCError({ code: 'NOT_FOUND', message: '回复不存在' })
          }
          if (err.message === 'FORBIDDEN') {
            throw new TRPCError({ code: 'FORBIDDEN', message: '没有权限删除此回复' })
          }
        }
        throw err
      }
    }),
})
