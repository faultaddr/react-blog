import { sign, verify } from 'jsonwebtoken'
import { config } from '../config'
import type { JwtPayload } from '@blog/shared'

export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return sign(payload as object, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as any)
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return verify(token, config.jwt.secret) as JwtPayload
  } catch {
    return null
  }
}
