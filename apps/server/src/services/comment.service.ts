import { prisma } from '../prisma'

export async function getCommentsByArticle(articleId: number) {
  const comments = await prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  return comments
}

export async function createComment(articleId: number, userId: number, content: string) {
  // 检查用户是否被禁言
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { disabledDiscuss: true },
  })

  if (user?.disabledDiscuss) {
    throw new Error('USER_DISABLED')
  }

  return prisma.comment.create({
    data: {
      articleId,
      userId,
      content,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })
}

export async function deleteComment(id: number, userId: number, isAdmin: boolean) {
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!comment) {
    throw new Error('COMMENT_NOT_FOUND')
  }

  // 只有管理员或评论作者可以删除
  if (!isAdmin && comment.userId !== userId) {
    throw new Error('FORBIDDEN')
  }

  await prisma.comment.delete({ where: { id } })
}

// 回复相关
export async function createReply(
  commentId: number,
  userId: number,
  content: string,
  replyTo?: number
) {
  // 检查用户是否被禁言
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { disabledDiscuss: true },
  })

  if (user?.disabledDiscuss) {
    throw new Error('USER_DISABLED')
  }

  return prisma.reply.create({
    data: {
      commentId,
      userId,
      content,
      replyTo,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })
}

export async function deleteReply(id: number, userId: number, isAdmin: boolean) {
  const reply = await prisma.reply.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!reply) {
    throw new Error('REPLY_NOT_FOUND')
  }

  if (!isAdmin && reply.userId !== userId) {
    throw new Error('FORBIDDEN')
  }

  await prisma.reply.delete({ where: { id } })
}
