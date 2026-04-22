import { describe, it, expect } from 'vitest'
import { hashPassword, comparePassword } from '../../services/password.service'

describe('password.service', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBe(60) // bcrypt hash length
    })

    it('should generate different hashes for the same password', async () => {
      const password = 'testpassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      const result = await comparePassword(password, hash)

      expect(result).toBe(true)
    })

    it('should return false for incorrect password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      const result = await comparePassword('wrongpassword', hash)

      expect(result).toBe(false)
    })

    it('should return false for empty password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      const result = await comparePassword('', hash)

      expect(result).toBe(false)
    })
  })
})
