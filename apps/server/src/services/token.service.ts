import { sign, verify } from 'jsonwebtoken'
import { config } from '../config'
import type { JwtPayload } from '@blog/shared'

export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return verify(token, config.jwt.secret) as JwtPayload
  } catch {
    return null
  }
}
