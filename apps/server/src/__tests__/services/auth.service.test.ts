import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock prisma - mock factory must be self-contained (hoisted)
vi.mock('../../prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

// Mock dependencies
vi.mock('../../services/password.service', () => ({
  hashPassword: vi.fn().mockResolvedValue('$2b$10$hashedpassword'),
  comparePassword: vi.fn().mockImplementation((password: string, hash: string) => {
    return Promise.resolve(password === 'correctpassword' && hash === '$2b$10$hashedpassword')
  }),
}))

vi.mock('../../services/token.service', () => ({
  generateToken: vi.fn().mockReturnValue('mock-jwt-token'),
}))

vi.mock('../../config', () => ({
  config: {
    jwt: {
      secret: 'test-secret-key-must-be-at-least-32-characters-long',
      expiresIn: '1h',
    },
  },
}))

// Import after mocks are set up
import { register, login, findOrCreateGithubUser } from '../../services/auth.service'
import { prisma } from '../../prisma'

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>
    findFirst: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }
}

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null)
      mockPrisma.user.findFirst.mockResolvedValueOnce(null)
      mockPrisma.user.create.mockResolvedValueOnce({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: '$2b$10$hashedpassword',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.userId).toBe(1)
      expect(result.username).toBe('testuser')
      expect(result.role).toBe('USER')
      expect(result.token).toBe('mock-jwt-token')
    })

    it('should throw EMAIL_EXISTS if email already registered', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
      })

      await expect(register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })).rejects.toThrow('EMAIL_EXISTS')
    })

    it('should throw USERNAME_EXISTS if username already taken', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null)
      mockPrisma.user.findFirst.mockResolvedValueOnce({
        id: 1,
        username: 'testuser',
      })

      await expect(register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })).rejects.toThrow('USERNAME_EXISTS')
    })
  })

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: '$2b$10$hashedpassword',
        role: 'USER',
      })

      const result = await login({
        email: 'test@example.com',
        password: 'correctpassword',
      })

      expect(result.userId).toBe(1)
      expect(result.username).toBe('testuser')
      expect(result.token).toBe('mock-jwt-token')
    })

    it('should throw USER_NOT_FOUND for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null)

      await expect(login({
        email: 'nonexistent@example.com',
        password: 'password123',
      })).rejects.toThrow('USER_NOT_FOUND')
    })

    it('should throw USER_NOT_FOUND for user without password (OAuth user)', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: 'oauth@example.com',
        password: null,
      })

      await expect(login({
        email: 'oauth@example.com',
        password: 'password123',
      })).rejects.toThrow('USER_NOT_FOUND')
    })

    it('should throw PASSWORD_MISMATCH for wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: '$2b$10$hashedpassword',
        role: 'USER',
      })

      await expect(login({
        email: 'test@example.com',
        password: 'wrongpassword',
      })).rejects.toThrow('PASSWORD_MISMATCH')
    })
  })

  describe('findOrCreateGithubUser', () => {
    it('should return existing user if GitHub ID found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 1,
        githubId: '12345',
        username: 'githubuser',
        role: 'USER',
      })

      const result = await findOrCreateGithubUser({
        id: 12345,
        login: 'githubuser',
        email: 'github@example.com',
      })

      expect(result.userId).toBe(1)
      expect(result.username).toBe('githubuser')
      expect(mockPrisma.user.create).not.toHaveBeenCalled()
    })

    it('should create new user if GitHub ID not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null)
      mockPrisma.user.create.mockResolvedValueOnce({
        id: 2,
        githubId: '67890',
        username: 'newgithubuser',
        email: 'new@example.com',
        role: 'USER',
      })

      const result = await findOrCreateGithubUser({
        id: 67890,
        login: 'newgithubuser',
        email: 'new@example.com',
        name: 'New User',
        avatar_url: 'https://avatar.url',
      })

      expect(result.userId).toBe(2)
      expect(result.username).toBe('newgithubuser')
      expect(mockPrisma.user.create).toHaveBeenCalled()
    })
  })
})
