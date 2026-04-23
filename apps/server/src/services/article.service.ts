import { prisma } from '../prisma'
import type { Article, Prisma } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

export interface ArticleListInput {
  page: number
  pageSize: number
  keyword?: string
  tag?: string
  category?: string
  isPrivate?: boolean
}

export interface ArticleListOutput {
  items: any[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export async function getArticleList(input: ArticleListInput): Promise<ArticleListOutput> {
  const { page, pageSize, keyword, tag, category, isPrivate } = input
  const skip = (page - 1) * pageSize

  const where: Prisma.ArticleWhereInput = {
    ...(isPrivate !== undefined && { isPrivate }),
    ...(keyword && {
      OR: [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ],
    }),
    ...(tag && {
      tags: { some: { name: tag } },
    }),
    ...(category && {
      categories: { some: { name: category } },
    }),
  }

  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [
        { isTop: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        tags: true,
        categories: true,
      },
    }),
    prisma.article.count({ where }),
  ])

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getArticleById(id: number, includePrivate = false) {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      tags: true,
      categories: true,
    },
  })

  if (!article) {
    return null
  }

  // 非管理员不能查看私密文章
  if (article.isPrivate && !includePrivate) {
    return null
  }

  return article
}

export async function getArticleBySlug(slug: string, includePrivate = false) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      tags: true,
      categories: true,
    },
  })

  if (!article) {
    return null
  }

  if (article.isPrivate && !includePrivate) {
    return null
  }

  return article
}

export async function getArticleByUuid(uuid: string) {
  return prisma.article.findFirst({
    where: { uuid },
    include: {
      tags: true,
      categories: true,
    },
  })
}

export async function incrementViewCount(id: number) {
  return prisma.article.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  })
}

export interface CreateArticleInput {
  title: string
  slug?: string
  content?: string
  summary?: string
  cover?: string
  isPrivate?: boolean
  tags?: string[]
  categories?: string[]
}

export async function createArticle(input: CreateArticleInput): Promise<Article> {
  const { tags = [], categories = [], ...data } = input

  // 生成 UUID 用于私密文章分享
  const uuid = input.isPrivate ? uuidv4().replace(/-/g, '').slice(0, 32) : null

  return prisma.article.create({
    data: {
      ...data,
      uuid,
      tags: {
        create: tags.map(name => ({ name })),
      },
      categories: {
        create: categories.map(name => ({ name })),
      },
    },
    include: {
      tags: true,
      categories: true,
    },
  })
}

export interface UpdateArticleInput {
  title?: string
  slug?: string
  content?: string
  summary?: string
  cover?: string
  isPrivate?: boolean
  tags?: string[]
  categories?: string[]
}

export async function updateArticle(id: number, input: UpdateArticleInput): Promise<Article> {
  const { tags, categories, ...data } = input

  // 如果需要更新标签/分类，先删除旧的再创建新的
  if (tags) {
    await prisma.tag.deleteMany({ where: { articleId: id } })
  }
  if (categories) {
    await prisma.category.deleteMany({ where: { articleId: id } })
  }

  return prisma.article.update({
    where: { id },
    data: {
      ...data,
      ...(tags && {
        tags: {
          create: tags.map(name => ({ name })),
        },
      }),
      ...(categories && {
        categories: {
          create: categories.map(name => ({ name })),
        },
      }),
    },
    include: {
      tags: true,
      categories: true,
    },
  })
}

export async function deleteArticle(id: number): Promise<void> {
  await prisma.article.delete({ where: { id } })
}

export async function toggleArticleTop(id: number): Promise<Article> {
  const article = await prisma.article.findUnique({ where: { id } })
  if (!article) {
    throw new Error('ARTICLE_NOT_FOUND')
  }

  return prisma.article.update({
    where: { id },
    data: { isTop: !article.isTop },
  })
}

export async function toggleArticlePrivate(id: number): Promise<Article> {
  const article = await prisma.article.findUnique({ where: { id } })
  if (!article) {
    throw new Error('ARTICLE_NOT_FOUND')
  }

  // 私密文章需要 UUID
  let uuid = article.uuid
  if (!article.isPrivate && !uuid) {
    uuid = uuidv4().replace(/-/g, '').slice(0, 32)
  }

  return prisma.article.update({
    where: { id },
    data: {
      isPrivate: !article.isPrivate,
      uuid: !article.isPrivate ? uuid : null,
    },
  })
}

// 获取所有标签
export async function getAllTags() {
  const tags = await prisma.tag.findMany({
    select: { name: true },
    distinct: ['name'],
  })
  return tags.map((t: { name: string }) => t.name)
}

// 获取所有分类
export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    select: { name: true },
    distinct: ['name'],
  })
  return categories.map((c: { name: string }) => c.name)
}
