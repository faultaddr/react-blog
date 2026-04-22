import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock prisma - mock factory must be self-contained (hoisted)
vi.mock('../../prisma', () => ({
  prisma: {
    article: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    tag: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

vi.mock('../../config', () => ({
  config: {
    isDev: true,
  },
}))

// Import after mocks are set up
import {
  getArticleList,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleTop,
  toggleArticlePrivate,
  getAllTags,
  getAllCategories,
} from '../../services/article.service'
import { prisma } from '../../prisma'

const mockPrisma = prisma as unknown as {
  article: {
    findMany: ReturnType<typeof vi.fn>
    findUnique: ReturnType<typeof vi.fn>
    findFirst: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
    count: ReturnType<typeof vi.fn>
  }
  tag: {
    findMany: ReturnType<typeof vi.fn>
    deleteMany: ReturnType<typeof vi.fn>
  }
  category: {
    findMany: ReturnType<typeof vi.fn>
    deleteMany: ReturnType<typeof vi.fn>
  }
}

describe('article.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getArticleList', () => {
    it('should return paginated article list', async () => {
      const mockArticles = [
        { id: 1, title: 'Article 1', isTop: false, isPrivate: false },
        { id: 2, title: 'Article 2', isTop: true, isPrivate: false },
      ]

      mockPrisma.article.findMany.mockResolvedValueOnce(mockArticles)
      mockPrisma.article.count.mockResolvedValueOnce(2)

      const result = await getArticleList({ page: 1, pageSize: 10 })

      expect(result.items).toEqual(mockArticles)
      expect(result.total).toBe(2)
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(10)
      expect(result.totalPages).toBe(1)
    })

    it('should filter by isPrivate when provided', async () => {
      mockPrisma.article.findMany.mockResolvedValueOnce([])
      mockPrisma.article.count.mockResolvedValueOnce(0)

      await getArticleList({ page: 1, pageSize: 10, isPrivate: false })

      const findManyCall = mockPrisma.article.findMany.mock.calls[0][0]
      expect(findManyCall.where.isPrivate).toBe(false)
    })

    it('should filter by keyword when provided', async () => {
      mockPrisma.article.findMany.mockResolvedValueOnce([])
      mockPrisma.article.count.mockResolvedValueOnce(0)

      await getArticleList({ page: 1, pageSize: 10, keyword: 'test' })

      const findManyCall = mockPrisma.article.findMany.mock.calls[0][0]
      expect(findManyCall.where.OR).toBeDefined()
      expect(findManyCall.where.OR).toContainEqual({ title: { contains: 'test' } })
      expect(findManyCall.where.OR).toContainEqual({ content: { contains: 'test' } })
    })

    it('should calculate correct pagination', async () => {
      mockPrisma.article.findMany.mockResolvedValueOnce([])
      mockPrisma.article.count.mockResolvedValueOnce(25)

      const result = await getArticleList({ page: 2, pageSize: 10 })

      expect(result.totalPages).toBe(3)
      expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      )
    })
  })

  describe('getArticleById', () => {
    it('should return article by id', async () => {
      const mockArticle = {
        id: 1,
        title: 'Test Article',
        isPrivate: false,
        tags: [],
        categories: [],
      }

      mockPrisma.article.findUnique.mockResolvedValueOnce(mockArticle)

      const result = await getArticleById(1)

      expect(result).toEqual(mockArticle)
    })

    it('should return null if article not found', async () => {
      mockPrisma.article.findUnique.mockResolvedValueOnce(null)

      const result = await getArticleById(999)

      expect(result).toBeNull()
    })

    it('should return null for private article when includePrivate is false', async () => {
      const mockArticle = {
        id: 1,
        title: 'Private Article',
        isPrivate: true,
        tags: [],
        categories: [],
      }

      mockPrisma.article.findUnique.mockResolvedValueOnce(mockArticle)

      const result = await getArticleById(1, false)

      expect(result).toBeNull()
    })

    it('should return private article when includePrivate is true', async () => {
      const mockArticle = {
        id: 1,
        title: 'Private Article',
        isPrivate: true,
        tags: [],
        categories: [],
      }

      mockPrisma.article.findUnique.mockResolvedValueOnce(mockArticle)

      const result = await getArticleById(1, true)

      expect(result).toEqual(mockArticle)
    })
  })

  describe('getArticleBySlug', () => {
    it('should return article by slug', async () => {
      const mockArticle = {
        id: 1,
        slug: 'test-article',
        title: 'Test Article',
        isPrivate: false,
        tags: [],
        categories: [],
      }

      mockPrisma.article.findUnique.mockResolvedValueOnce(mockArticle)

      const result = await getArticleBySlug('test-article')

      expect(result).toEqual(mockArticle)
    })

    it('should return null if article not found', async () => {
      mockPrisma.article.findUnique.mockResolvedValueOnce(null)

      const result = await getArticleBySlug('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('createArticle', () => {
    it('should create article with tags and categories', async () => {
      const mockArticle = {
        id: 1,
        title: 'New Article',
        content: 'Content',
        tags: [{ name: 'tag1' }, { name: 'tag2' }],
        categories: [{ name: 'cat1' }],
      }

      mockPrisma.article.create.mockResolvedValueOnce(mockArticle)

      const result = await createArticle({
        title: 'New Article',
        content: 'Content',
        tags: ['tag1', 'tag2'],
        categories: ['cat1'],
      })

      expect(result).toEqual(mockArticle)
      expect(mockPrisma.article.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'New Article',
            content: 'Content',
          }),
        })
      )
    })

    it('should generate uuid for private articles', async () => {
      const mockArticle = {
        id: 1,
        title: 'Private Article',
        isPrivate: true,
        uuid: 'generated-uuid',
      }

      mockPrisma.article.create.mockResolvedValueOnce(mockArticle)

      await createArticle({
        title: 'Private Article',
        isPrivate: true,
      })

      const createCall = mockPrisma.article.create.mock.calls[0][0]
      expect(createCall.data.uuid).toBeDefined()
      expect(createCall.data.uuid).not.toBeNull()
    })

    it('should not generate uuid for public articles', async () => {
      const mockArticle = {
        id: 1,
        title: 'Public Article',
        isPrivate: false,
        uuid: null,
      }

      mockPrisma.article.create.mockResolvedValueOnce(mockArticle)

      await createArticle({
        title: 'Public Article',
        isPrivate: false,
      })

      const createCall = mockPrisma.article.create.mock.calls[0][0]
      expect(createCall.data.uuid).toBeNull()
    })
  })

  describe('updateArticle', () => {
    it('should update article and replace tags', async () => {
      const mockArticle = {
        id: 1,
        title: 'Updated Title',
        tags: [{ name: 'new-tag' }],
        categories: [],
      }

      mockPrisma.tag.deleteMany.mockResolvedValueOnce({ count: 2 })
      mockPrisma.article.update.mockResolvedValueOnce(mockArticle)

      const result = await updateArticle(1, {
        title: 'Updated Title',
        tags: ['new-tag'],
      })

      expect(result).toEqual(mockArticle)
      expect(mockPrisma.tag.deleteMany).toHaveBeenCalledWith({ where: { articleId: 1 } })
    })

    it('should update article without changing tags if not provided', async () => {
      const mockArticle = {
        id: 1,
        title: 'Updated Title',
        tags: [{ name: 'old-tag' }],
        categories: [],
      }

      mockPrisma.article.update.mockResolvedValueOnce(mockArticle)

      const result = await updateArticle(1, {
        title: 'Updated Title',
      })

      expect(result).toEqual(mockArticle)
      expect(mockPrisma.tag.deleteMany).not.toHaveBeenCalled()
    })
  })

  describe('deleteArticle', () => {
    it('should delete article by id', async () => {
      mockPrisma.article.delete.mockResolvedValueOnce({ id: 1 })

      await deleteArticle(1)

      expect(mockPrisma.article.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })
  })

  describe('toggleArticleTop', () => {
    it('should toggle isTop from false to true', async () => {
      mockPrisma.article.findUnique.mockResolvedValueOnce({ id: 1, isTop: false })
      mockPrisma.article.update.mockResolvedValueOnce({ id: 1, isTop: true })

      const result = await toggleArticleTop(1)

      expect(result.isTop).toBe(true)
    })

    it('should toggle isTop from true to false', async () => {
      mockPrisma.article.findUnique.mockResolvedValueOnce({ id: 1, isTop: true })
      mockPrisma.article.update.mockResolvedValueOnce({ id: 1, isTop: false })

      const result = await toggleArticleTop(1)

      expect(result.isTop).toBe(false)
    })

    it('should throw ARTICLE_NOT_FOUND if article does not exist', async () => {
      mockPrisma.article.findUnique.mockResolvedValueOnce(null)

      await expect(toggleArticleTop(999)).rejects.toThrow('ARTICLE_NOT_FOUND')
    })
  })

  describe('toggleArticlePrivate', () => {
    it('should toggle isPrivate and generate uuid when making private', async () => {
      mockPrisma.article.findUnique.mockResolvedValueOnce({ id: 1, isPrivate: false, uuid: null })
      mockPrisma.article.update.mockResolvedValueOnce({ id: 1, isPrivate: true, uuid: 'new-uuid' })

      const result = await toggleArticlePrivate(1)

      expect(result.isPrivate).toBe(true)
    })

    it('should throw ARTICLE_NOT_FOUND if article does not exist', async () => {
      mockPrisma.article.findUnique.mockResolvedValueOnce(null)

      await expect(toggleArticlePrivate(999)).rejects.toThrow('ARTICLE_NOT_FOUND')
    })
  })

  describe('getAllTags', () => {
    it('should return distinct tag names', async () => {
      mockPrisma.tag.findMany.mockResolvedValueOnce([
        { name: 'tag1' },
        { name: 'tag2' },
        { name: 'tag1' },
      ])

      const result = await getAllTags()

      expect(result).toEqual(['tag1', 'tag2', 'tag1'])
    })
  })

  describe('getAllCategories', () => {
    it('should return distinct category names', async () => {
      mockPrisma.category.findMany.mockResolvedValueOnce([
        { name: 'cat1' },
        { name: 'cat2' },
      ])

      const result = await getAllCategories()

      expect(result).toEqual(['cat1', 'cat2'])
    })
  })
})
