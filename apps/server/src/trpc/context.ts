import type { FastifyRequest, FastifyReply } from 'fastify'
import { verify } from 'jsonwebtoken'
import { config } from '../config'
import { prisma } from '../prisma'
import type { JwtPayload } from '@blog/shared'

export interface CreateContextOptions {
  req: FastifyRequest
  res: FastifyReply
}

export async function createContext({ req, res }: CreateContextOptions) {
  // 从 cookie 或 header 获取 token
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '')

  let user: JwtPayload | null = null
  if (token) {
    try {
      user = verify(token, config.jwt.secret) as JwtPayload
    } catch {
      // token 无效或过期，清除 cookie
      res.clearCookie('token')
    }
  }

  return {
    req,
    res,
    user,
    prisma,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
