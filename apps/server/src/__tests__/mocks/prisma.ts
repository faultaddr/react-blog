import { vi } from 'vitest'

export const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
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
  comment: {
    findMany: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}

vi.mock('../../prisma', () => ({
  prisma: mockPrisma,
}))
