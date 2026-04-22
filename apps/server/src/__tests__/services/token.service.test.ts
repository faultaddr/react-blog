import { describe, it, expect, beforeAll, vi } from 'vitest'
import { generateToken, verifyToken } from '../../services/token.service'

// Mock environment variables for testing
vi.mock('../../config', () => ({
  config: {
    jwt: {
      secret: 'test-secret-key-must-be-at-least-32-characters-long',
      expiresIn: '1h',
    },
  },
}))

describe('token.service', () => {
  beforeAll(() => {
    // Ensure config mock is applied
  })

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = {
        userId: 1,
        username: 'testuser',
        role: 'USER' as const,
      }

      const token = generateToken(payload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.').length).toBe(3) // JWT has 3 parts
    })

    it('should generate different tokens for different payloads', () => {
      const token1 = generateToken({
        userId: 1,
        username: 'user1',
        role: 'USER',
      })

      const token2 = generateToken({
        userId: 2,
        username: 'user2',
        role: 'USER',
      })

      expect(token1).not.toBe(token2)
    })
  })

  describe('verifyToken', () => {
    it('should verify a valid token and return payload', () => {
      const payload = {
        userId: 1,
        username: 'testuser',
        role: 'USER' as const,
      }

      const token = generateToken(payload)
      const decoded = verifyToken(token)

      expect(decoded).not.toBeNull()
      expect(decoded?.userId).toBe(payload.userId)
      expect(decoded?.username).toBe(payload.username)
      expect(decoded?.role).toBe(payload.role)
    })

    it('should return null for invalid token', () => {
      const result = verifyToken('invalid-token')

      expect(result).toBeNull()
    })

    it('should return null for empty token', () => {
      const result = verifyToken('')

      expect(result).toBeNull()
    })
  })
})
