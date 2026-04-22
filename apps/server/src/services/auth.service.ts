import { prisma } from '../prisma'
import { hashPassword, comparePassword } from './password.service'
import { generateToken } from './token.service'
import type { Role } from '@prisma/client'

export interface RegisterInput {
  username: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResult {
  userId: number
  username: string | null
  role: Role
  token: string
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  // 检查邮箱是否已存在
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (existingUser) {
    throw new Error('EMAIL_EXISTS')
  }

  // 检查用户名是否已存在
  const existingUsername = await prisma.user.findFirst({
    where: { username: input.username },
  })

  if (existingUsername) {
    throw new Error('USERNAME_EXISTS')
  }

  // 创建用户
  const hashedPassword = await hashPassword(input.password)
  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      password: hashedPassword,
      role: 'USER',
    },
  })

  // 生成 token
  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role,
  })

  return {
    userId: user.id,
    username: user.username,
    role: user.role,
    token,
  }
}

export async function login(input: LoginInput): Promise<AuthResult> {
  // 查找用户
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (!user || !user.password) {
    throw new Error('USER_NOT_FOUND')
  }

  // 验证密码
  const isValid = await comparePassword(input.password, user.password)
  if (!isValid) {
    throw new Error('PASSWORD_MISMATCH')
  }

  // 生成 token
  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role,
  })

  return {
    userId: user.id,
    username: user.username,
    role: user.role,
    token,
  }
}

export async function findOrCreateGithubUser(githubProfile: {
  id: number | string
  login: string
  email?: string | null
  name?: string | null
  avatar_url?: string | null
}): Promise<AuthResult> {
  const githubId = String(githubProfile.id)

  // 查找已存在的 GitHub 用户
  let user = await prisma.user.findUnique({
    where: { githubId },
  })

  if (!user) {
    // 创建新用户
    user = await prisma.user.create({
      data: {
        githubId,
        username: githubProfile.login,
        email: githubProfile.email,
        githubProfile: githubProfile as any,
        role: 'USER',
      },
    })
  }

  // 生成 token
  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role,
  })

  return {
    userId: user.id,
    username: user.username,
    role: user.role,
    token,
  }
}

export { generateToken }
