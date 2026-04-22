# React Blog 全面重构实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 React Blog 项目全面重构为现代化技术栈（Fastify + Prisma + tRPC + React 18 + Vite）

**Architecture:** Monorepo 结构，使用 pnpm workspace 管理 apps/web（前端）、apps/server（后端）和 packages/shared（共享包）。后端采用 Fastify + tRPC 提供类型安全 API，前端使用 React 18 + TanStack Query 消费 API。

**Tech Stack:** Fastify 5, Prisma 6, tRPC 11, React 18, Vite 5, TypeScript 5, TanStack Router, Zustand, Tailwind CSS, Ant Design, Vitest, Playwright

---

## 文件结构总览

```
react-blog/
├── apps/
│   ├── web/                          # 前端应用
│   │   ├── src/
│   │   │   ├── components/ui/        # 基础 UI 组件
│   │   │   ├── components/layout/    # 布局组件
│   │   │   ├── features/auth/        # 认证功能
│   │   │   ├── features/article/     # 文章功能
│   │   │   ├── features/comment/     # 评论功能
│   │   │   ├── features/admin/       # 后台管理
│   │   │   ├── hooks/                # 全局 hooks
│   │   │   ├── stores/               # Zustand 状态
│   │   │   ├── trpc/                 # tRPC 客户端
│   │   │   ├── router/               # 路由配置
│   │   │   ├── styles/               # 全局样式
│   │   │   ├── types/                # 类型定义
│   │   │   ├── utils/                # 工具函数
│   │   │   ├── main.tsx              # 入口
│   │   │   └── App.tsx               # 根组件
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── server/                       # 后端应用
│       ├── src/
│       │   ├── trpc/                 # tRPC 配置
│       │   │   ├── context.ts        # 上下文
│       │   │   ├── procedures.ts     # Procedure 定义
│       │   │   ├── routers/          # 路由器
│       │   │   └── index.ts          # appRouter
│       │   ├── prisma/               # 数据库
│       │   │   └── schema.prisma
│       │   ├── services/             # 业务逻辑
│       │   ├── middlewares/          # 中间件
│       │   ├── utils/                # 工具
│       │   ├── config.ts             # 配置
│       │   └── index.ts              # 入口
│       ├── prisma/
│       │   └── schema.prisma
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   └── shared/                       # 共享包
│       ├── src/
│       │   ├── types/
│       │   │   └── index.ts
│       │   ├── constants/
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json
│
├── e2e/                              # E2E 测试
│   ├── tests/
│   ├── playwright.config.ts
│   └── package.json
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
└── .env.example
```

---

## Chunk 1: 项目基础架构

### Task 1.1: 初始化 pnpm workspace

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `package.json`
- Create: `tsconfig.base.json`
- Create: `.gitignore` (更新)
- Create: `.env.example`

- [ ] **Step 1: 创建根目录 package.json**

```json
{
  "name": "react-blog",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter './apps/*' run dev",
    "build": "pnpm --filter './apps/*' run build",
    "test": "pnpm --filter './apps/*' run test",
    "lint": "pnpm --filter './apps/*' run lint"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

- [ ] **Step 2: 创建 pnpm-workspace.yaml**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'e2e'
```

- [ ] **Step 3: 创建 tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 4: 创建 .env.example**

```bash
# 运行环境
NODE_ENV="development"

# 数据库
DATABASE_URL="mysql://root:password@localhost:3306/blog"

# JWT
JWT_SECRET="your-secret-key-min-32-characters-long"
JWT_EXPIRES_IN="720h"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# 站点配置
SITE_URL="http://localhost:3000"
ADMIN_GITHUB_LOGIN="your-github-username"

# 日志
LOG_LEVEL="info"

# 邮件通知（可选）
SMTP_HOST="smtp.qq.com"
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER="your-email@qq.com"
SMTP_PASS="your-smtp-password"
```

- [ ] **Step 5: 更新 .gitignore**

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Test
coverage/

# Prisma
apps/server/prisma/*.db
apps/server/prisma/*.db-journal

# Misc
*.local
```

- [ ] **Step 6: Commit**

```bash
git add pnpm-workspace.yaml package.json tsconfig.base.json .env.example
git commit -m "chore: initialize pnpm workspace and base config"
```

---

### Task 1.2: 创建 shared 共享包

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/types/index.ts`
- Create: `packages/shared/src/constants/index.ts`

- [ ] **Step 1: 创建 packages/shared/package.json**

```json
{
  "name": "@blog/shared",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 2: 创建 packages/shared/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "noEmit": false
  },
  "include": ["src"]
}
```

- [ ] **Step 3: 创建 packages/shared/src/types/index.ts**

```typescript
// 用户角色
export type Role = 'ADMIN' | 'USER'

// JWT Payload
export interface JwtPayload {
  userId: number
  username: string | null
  role: Role
  iat: number
  exp: number
}

// 分页参数
export interface PaginationInput {
  page: number
  pageSize: number
}

// 分页响应
export interface PaginationOutput<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 文章状态
export interface Article {
  id: number
  title: string
  slug: string | null
  content: string | null
  summary: string | null
  cover: string | null
  viewCount: number
  isPrivate: boolean
  isTop: boolean
  uuid: string | null
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
}

// 用户
export interface User {
  id: number
  username: string | null
  email: string | null
  role: Role
  notice: boolean
  githubId: string | null
  disabledDiscuss: boolean
  createdAt: Date
  updatedAt: Date
}

// 评论
export interface Comment {
  id: number
  content: string
  articleId: number
  userId: number
  createdAt: Date
  updatedAt: Date
}

// 回复
export interface Reply {
  id: number
  content: string
  commentId: number
  userId: number
  replyTo: number | null
  createdAt: Date
  updatedAt: Date
}

// 碎片/语录
export interface Fragment {
  id: number
  content: string
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
}
```

- [ ] **Step 4: 创建 packages/shared/src/constants/index.ts**

```typescript
// 错误码
export const ErrorCodes = {
  // 通用
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',

  // 文章
  ARTICLE_NOT_FOUND: 'ARTICLE_NOT_FOUND',
  ARTICLE_TITLE_EXISTS: 'ARTICLE_TITLE_EXISTS',
  ARTICLE_SLUG_EXISTS: 'ARTICLE_SLUG_EXISTS',

  // 用户
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  PASSWORD_MISMATCH: 'PASSWORD_MISMATCH',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  USERNAME_EXISTS: 'USERNAME_EXISTS',

  // 评论
  COMMENT_NOT_FOUND: 'COMMENT_NOT_FOUND',

  // 回复
  REPLY_NOT_FOUND: 'REPLY_NOT_FOUND',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

// 默认分页
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

// Token 配置
export const TOKEN_COOKIE_NAME = 'token'
export const TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000 // 30 days
```

- [ ] **Step 5: 创建 packages/shared/src/index.ts**

```typescript
export * from './types'
export * from './constants'
```

- [ ] **Step 6: Commit**

```bash
git add packages/shared
git commit -m "feat: add shared package with types and constants"
```

---

## Chunk 2: 后端核心 - Prisma + tRPC 基础

### Task 2.1: 创建后端项目结构

**Files:**
- Create: `apps/server/package.json`
- Create: `apps/server/tsconfig.json`
- Create: `apps/server/src/index.ts`
- Create: `apps/server/src/config.ts`
- Create: `apps/server/prisma/schema.prisma`

- [ ] **Step 1: 创建 apps/server/package.json**

```json
{
  "name": "@blog/server",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@fastify/cookie": "^9.2.0",
    "@fastify/cors": "^9.0.0",
    "@fastify/csrf-protection": "^6.3.0",
    "@fastify/static": "^7.0.0",
    "@prisma/client": "^6.0.0",
    "@trpc/server": "^11.0.0",
    "bcrypt": "^5.1.1",
    "dayjs": "^1.11.10",
    "fastify": "^5.0.0",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.13",
    "pino": "^9.0.0",
    "pino-pretty": "^11.0.0",
    "uuid": "^9.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^20.11.0",
    "@types/nodemailer": "^6.4.14",
    "@types/uuid": "^9.0.8",
    "prisma": "^6.0.0",
    "tsx": "^4.7.0",
    "typescript": "^5.4.0",
    "vitest": "^1.3.0"
  }
}
```

- [ ] **Step 2: 创建 apps/server/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "CommonJS",
    "noEmit": false
  },
  "include": ["src"]
}
```

- [ ] **Step 3: 创建 apps/server/src/config.ts**

```typescript
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(6060),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('720h'),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  SITE_URL: z.string().url(),
  ADMIN_GITHUB_LOGIN: z.string(),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  // 可选：邮件配置
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z.coerce.boolean().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
})

export const env = envSchema.parse(process.env)

export const config = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  databaseUrl: env.DATABASE_URL,
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  github: {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    adminLogin: env.ADMIN_GITHUB_LOGIN,
  },
  siteUrl: env.SITE_URL,
  logLevel: env.LOG_LEVEL,
  smtp: env.SMTP_HOST ? {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 465,
    secure: env.SMTP_SECURE ?? true,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  } : null,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
}
```

- [ ] **Step 4: 创建 apps/server/prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// 用户角色
enum Role {
  ADMIN
  USER
}

// 用户表
model User {
  id              Int       @id @default(autoincrement())
  username        String?   @db.VarChar(50)
  password        String?
  email           String?   @unique @db.VarChar(50)
  role            Role      @default(USER)
  notice          Boolean   @default(true)
  githubId        String?   @unique
  githubProfile   Json?
  disabledDiscuss Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  comments Comment[]
  replies  Reply[]
  ips      Ip[]
}

// 文章表
model Article {
  id          Int       @id @default(autoincrement())
  title       String    @unique @db.VarChar(255)
  slug        String?   @unique @db.VarChar(255)
  content     String?   @db.Text
  summary     String?   @db.VarChar(500)
  cover       String?   @db.VarChar(500)
  viewCount   Int       @default(0)
  isPrivate   Boolean   @default(false)
  isTop       Boolean   @default(false)
  uuid        String?   @db.VarChar(32)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  publishedAt DateTime?

  tags       Tag[]
  categories Category[]
  comments   Comment[]

  @@index([isPrivate, isTop, createdAt])
  @@index([createdAt])
  @@index([slug])
}

// 标签表
model Tag {
  id        Int     @id @default(autoincrement())
  name      String  @db.VarChar(50)
  articleId Int
  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)

  @@unique([name, articleId])
}

// 分类表
model Category {
  id        Int     @id @default(autoincrement())
  name      String  @db.VarChar(50)
  articleId Int
  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)

  @@unique([name, articleId])
}

// 评论表
model Comment {
  id        Int      @id @default(autoincrement())
  content   String   @db.Text
  articleId Int
  userId    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id])
  replies Reply[]

  @@index([articleId])
  @@index([createdAt])
}

// 回复表
model Reply {
  id        Int      @id @default(autoincrement())
  content   String   @db.Text
  commentId Int
  userId    Int
  replyTo   Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  comment Comment @relation(fields: [commentId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id])
  parent  Reply?  @relation("ReplyTree", fields: [replyTo], references: [id], onDelete: Cascade)
  children Reply[] @relation("ReplyTree")

  @@index([commentId])
  @@index([createdAt])
}

// 碎片/语录表
model Fragment {
  id        Int      @id @default(autoincrement())
  content   String   @db.Text
  isPrivate Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([createdAt])
}

// 访问记录表
model Record {
  id        Int      @id @default(autoincrement())
  ip        String   @db.VarChar(50)
  path      String   @db.VarChar(255)
  userAgent String?  @db.VarChar(500)
  createdAt DateTime @default(now())

  @@index([ip, createdAt])
}

// IP 黑名单
model Ip {
  id        Int      @id @default(autoincrement())
  ip        String   @db.VarChar(50)
  userId    Int?
  user      User?    @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@unique([ip])
}
```

- [ ] **Step 5: 创建 apps/server/src/index.ts (基础版)**

```typescript
import Fastify from 'fastify'
import { config } from './config'
import { prisma } from './prisma'

const app = Fastify({
  logger: {
    level: config.logLevel,
    transport: config.isDev ? { target: 'pino-pretty' } : undefined,
  },
})

// 健康检查
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// 启动服务器
const start = async () => {
  try {
    // 测试数据库连接
    await prisma.$connect()
    console.log('Database connected')

    await app.listen({ port: config.port, host: '0.0.0.0' })
    console.log(`Server running on http://localhost:${config.port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
```

- [ ] **Step 6: 创建 apps/server/src/prisma/index.ts**

```typescript
import { PrismaClient } from '@prisma/client'
import { config } from '../config'

export const prisma = new PrismaClient({
  log: config.isDev ? ['query', 'info', 'warn', 'error'] : ['error'],
})
```

- [ ] **Step 7: Commit**

```bash
git add apps/server
git commit -m "feat: initialize server with Prisma schema"
```

---

### Task 2.2: 配置 tRPC 基础设施

**Files:**
- Create: `apps/server/src/trpc/context.ts`
- Create: `apps/server/src/trpc/procedures.ts`
- Create: `apps/server/src/trpc/index.ts`
- Create: `apps/server/src/trpc/routers/_app.ts`
- Create: `apps/server/src/utils/logger.ts`

- [ ] **Step 1: 创建 apps/server/src/utils/logger.ts**

```typescript
import pino from 'pino'
import { config } from '../config'

export const logger = pino({
  level: config.logLevel,
  transport: config.isDev ? { target: 'pino-pretty' } : undefined,
})
```

- [ ] **Step 2: 创建 apps/server/src/trpc/context.ts**

```typescript
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
```

- [ ] **Step 3: 创建 apps/server/src/trpc/procedures.ts**

```typescript
import { initTRPC } from '@trpc/server'
import type { Context } from './context'
import { TRPCError } from '@trpc/server'

const t = initTRPC.context<Context>().create()

// 公开接口
export const publicProcedure = t.procedure

// 需登录
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: '请先登录',
    })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // 现在类型系统知道 user 不为 null
    },
  })
})

// 仅管理员
export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: '没有权限执行此操作',
    })
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})

export const router = t.router
export const middleware = t.middleware
```

- [ ] **Step 4: 创建 apps/server/src/trpc/routers/_app.ts (空路由)**

```typescript
import { router } from '../procedures'

export const appRouter = router({
  // 路由将在后续任务中添加
})

export type AppRouter = typeof appRouter
```

- [ ] **Step 5: 创建 apps/server/src/trpc/index.ts**

```typescript
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import type { FastifyInstance } from 'fastify'
import { appRouter } from './routers/_app'
import { createContext } from './context'

export { appRouter, createContext }
export type { AppRouter } from './routers/_app'

export async function registerTRPC(app: FastifyInstance) {
  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        console.error(`Error in tRPC handler on path '${path}':`, error)
      },
    },
  })
}
```

- [ ] **Step 6: 更新 apps/server/src/index.ts 添加 tRPC**

```typescript
import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import { config } from './config'
import { prisma } from './prisma'
import { registerTRPC } from './trpc'

const app = Fastify({
  logger: {
    level: config.logLevel,
    transport: config.isDev ? { target: 'pino-pretty' } : undefined,
  },
})

// 注册插件
await app.register(cors, {
  origin: config.isDev ? 'http://localhost:5173' : config.siteUrl,
  credentials: true,
})

await app.register(cookie, {
  secret: config.jwt.secret,
})

// 注册 tRPC
await registerTRPC(app)

// 健康检查
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// 启动服务器
const start = async () => {
  try {
    // 测试数据库连接
    await prisma.$connect()
    console.log('Database connected')

    await app.listen({ port: config.port, host: '0.0.0.0' })
    console.log(`Server running on http://localhost:${config.port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
```

- [ ] **Step 7: Commit**

```bash
git add apps/server/src/trpc apps/server/src/utils apps/server/src/index.ts
git commit -m "feat: add tRPC infrastructure"
```

---

## Chunk 3: 后端认证模块

### Task 3.1: 认证服务层

**Files:**
- Create: `apps/server/src/services/auth.service.ts`
- Create: `apps/server/src/services/password.service.ts`
- Create: `apps/server/src/services/token.service.ts`
- Create: `apps/server/src/services/__tests__/auth.service.test.ts`

- [ ] **Step 1: 创建密码服务 apps/server/src/services/password.service.ts**

```typescript
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
```

- [ ] **Step 2: 写密码服务测试 apps/server/src/services/__tests__/password.service.test.ts**

```typescript
import { describe, it, expect } from 'vitest'
import { hashPassword, comparePassword } from '../password.service'

describe('password service', () => {
  it('should hash password', async () => {
    const password = 'test123456'
    const hash = await hashPassword(password)

    expect(hash).toBeDefined()
    expect(hash).not.toBe(password)
    expect(hash.length).toBeGreaterThan(0)
  })

  it('should compare password correctly', async () => {
    const password = 'test123456'
    const hash = await hashPassword(password)

    expect(await comparePassword(password, hash)).toBe(true)
    expect(await comparePassword('wrongpassword', hash)).toBe(false)
  })

  it('should generate different hashes for same password', async () => {
    const password = 'test123456'
    const hash1 = await hashPassword(password)
    const hash2 = await hashPassword(password)

    expect(hash1).not.toBe(hash2)
    expect(await comparePassword(password, hash1)).toBe(true)
    expect(await comparePassword(password, hash2)).toBe(true)
  })
})
```

- [ ] **Step 3: 运行测试验证通过**

```bash
cd apps/server && pnpm test -- --run services/__tests__/password.service.test.ts
```

- [ ] **Step 4: 创建 Token 服务 apps/server/src/services/token.service.ts**

```typescript
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
```

- [ ] **Step 5: 创建认证服务 apps/server/src/services/auth.service.ts**

```typescript
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
```

- [ ] **Step 6: Commit**

```bash
git add apps/server/src/services
git commit -m "feat: add auth services (password, token, auth)"
```

---

### Task 3.2: 认证 tRPC 路由

**Files:**
- Create: `apps/server/src/trpc/routers/auth.ts`
- Modify: `apps/server/src/trpc/routers/_app.ts`

- [ ] **Step 1: 创建认证路由 apps/server/src/trpc/routers/auth.ts**

```typescript
import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../procedures'
import * as authService from '../../services/auth.service'
import { TRPCError } from '@trpc/server'
import { config } from '../../config'
import { TOKEN_COOKIE_NAME, TOKEN_MAX_AGE } from '@blog/shared'

export const authRouter = router({
  // 注册
  register: publicProcedure
    .input(
      z.object({
        username: z.string().min(2).max(50),
        email: z.string().email(),
        password: z.string().min(6).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await authService.register(input)

        // 设置 cookie
        ctx.res.setCookie(TOKEN_COOKIE_NAME, result.token, {
          httpOnly: true,
          secure: config.isProd,
          sameSite: 'lax',
          maxAge: TOKEN_MAX_AGE,
          path: '/',
        })

        return {
          userId: result.userId,
          username: result.username,
          role: result.role,
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'EMAIL_EXISTS') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: '该邮箱已被注册',
            })
          }
          if (err.message === 'USERNAME_EXISTS') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: '该用户名已被使用',
            })
          }
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '注册失败',
        })
      }
    }),

  // 登录
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await authService.login(input)

        // 设置 cookie
        ctx.res.setCookie(TOKEN_COOKIE_NAME, result.token, {
          httpOnly: true,
          secure: config.isProd,
          sameSite: 'lax',
          maxAge: TOKEN_MAX_AGE,
          path: '/',
        })

        return {
          userId: result.userId,
          username: result.username,
          role: result.role,
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'USER_NOT_FOUND' || err.message === 'PASSWORD_MISMATCH') {
            throw new TRPCError({
              code: 'UNAUTHORIZED',
              message: '邮箱或密码错误',
            })
          }
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '登录失败',
        })
      }
    }),

  // 登出
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie(TOKEN_COOKIE_NAME)
    return { success: true }
  }),

  // 获取当前用户信息
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return null
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        notice: true,
        githubId: true,
        createdAt: true,
      },
    })

    return user
  }),

  // 更新用户资料
  updateProfile: protectedProcedure
    .input(
      z.object({
        username: z.string().min(2).max(50).optional(),
        email: z.string().email().optional(),
        notice: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.user.userId },
        data: input,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          notice: true,
        },
      })

      return user
    }),

  // GitHub OAuth URL
  githubAuthUrl: publicProcedure.query(() => {
    const url = new URL('https://github.com/login/oauth/authorize')
    url.searchParams.set('client_id', config.github.clientId)
    url.searchParams.set('scope', 'read:user user:email')
    url.searchParams.set('redirect_uri', `${config.siteUrl}/auth/github/callback`)
    return { url: url.toString() }
  }),

  // GitHub OAuth 回调
  githubCallback: publicProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // 获取 access token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: config.github.clientId,
          client_secret: config.github.clientSecret,
          code: input.code,
        }),
      })

      const tokenData = await tokenResponse.json() as { access_token?: string; error?: string }

      if (!tokenData.access_token) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'GitHub 授权失败',
        })
      }

      // 获取用户信息
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      })

      const githubUser = await userResponse.json() as any

      // 检查是否是管理员
      const isAdmin = githubUser.login === config.github.adminLogin

      // 如果是管理员且用户不存在，创建管理员账户
      if (isAdmin) {
        const existingAdmin = await ctx.prisma.user.findFirst({
          where: { role: 'ADMIN' },
        })

        if (!existingAdmin) {
          const user = await ctx.prisma.user.create({
            data: {
              githubId: String(githubUser.id),
              username: githubUser.login,
              githubProfile: githubUser,
              role: 'ADMIN',
            },
          })

          const token = authService.generateToken({
            userId: user.id,
            username: user.username,
            role: user.role,
          })

          ctx.res.setCookie(TOKEN_COOKIE_NAME, token, {
            httpOnly: true,
            secure: config.isProd,
            sameSite: 'lax',
            maxAge: TOKEN_MAX_AGE,
            path: '/',
          })

          return { success: true, isAdmin: true }
        }
      }

      // 创建或更新用户
      const result = await authService.findOrCreateGithubUser(githubUser)

      ctx.res.setCookie(TOKEN_COOKIE_NAME, result.token, {
        httpOnly: true,
        secure: config.isProd,
        sameSite: 'lax',
        maxAge: TOKEN_MAX_AGE,
        path: '/',
      })

      return { success: true, isAdmin: result.role === 'ADMIN' }
    }),
})
```

- [ ] **Step 2: 更新 _app.ts 添加认证路由**

```typescript
import { router } from '../procedures'
import { authRouter } from './auth'

export const appRouter = router({
  auth: authRouter,
})

export type AppRouter = typeof appRouter
```

- [ ] **Step 3: 导出 generateToken 从 auth.service**

更新 `apps/server/src/services/auth.service.ts`，添加导出：

```typescript
export { generateToken }
```

- [ ] **Step 4: Commit**

```bash
git add apps/server/src/trpc/routers
git commit -m "feat: add auth tRPC router"
```

---

## Chunk 4: 后端文章模块

### Task 4.1: 文章服务层

**Files:**
- Create: `apps/server/src/services/article.service.ts`
- Create: `apps/server/src/services/__tests__/article.service.test.ts`

- [ ] **Step 1: 创建文章服务 apps/server/src/services/article.service.ts**

```typescript
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
  items: Article[]
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
  return prisma.article.findUnique({
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
  return tags.map(t => t.name)
}

// 获取所有分类
export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    select: { name: true },
    distinct: ['name'],
  })
  return categories.map(c => c.name)
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/services/article.service.ts
git commit -m "feat: add article service layer"
```

---

### Task 4.2: 文章 tRPC 路由

**Files:**
- Create: `apps/server/src/trpc/routers/article.ts`
- Modify: `apps/server/src/trpc/routers/_app.ts`

- [ ] **Step 1: 创建文章路由 apps/server/src/trpc/routers/article.ts**

```typescript
import { z } from 'zod'
import { router, publicProcedure, adminProcedure } from '../procedures'
import * as articleService from '../../services/article.service'
import { TRPCError } from '@trpc/server'

export const articleRouter = router({
  // 文章列表
  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().max(100).default(10),
        keyword: z.string().optional(),
        tag: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // 普通用户只能看到公开文章
      const isAdmin = ctx.user?.role === 'ADMIN'
      return articleService.getArticleList({
        ...input,
        isPrivate: isAdmin ? undefined : false,
      })
    }),

  // 按 ID 获取文章
  byId: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const isAdmin = ctx.user?.role === 'ADMIN'
      const article = await articleService.getArticleById(input.id, isAdmin)

      if (!article) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '文章不存在',
        })
      }

      // 增加阅读数
      await articleService.incrementViewCount(input.id)

      return article
    }),

  // 通过 UUID 获取私密文章
  byUuid: publicProcedure
    .input(z.object({ uuid: z.string().length(32) }))
    .query(async ({ input }) => {
      const article = await articleService.getArticleByUuid(input.uuid)

      if (!article) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '文章不存在或链接已失效',
        })
      }

      return article
    }),

  // 创建文章
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        slug: z.string().max(255).optional(),
        content: z.string().optional(),
        summary: z.string().max(500).optional(),
        cover: z.string().url().optional(),
        isPrivate: z.boolean().default(false),
        tags: z.array(z.string().max(50)).default([]),
        categories: z.array(z.string().max(50)).default([]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        return await articleService.createArticle(input)
      } catch (err: any) {
        if (err.code === 'P2002') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: err.meta?.target?.includes('title')
              ? '文章标题已存在'
              : '文章 slug 已存在',
          })
        }
        throw err
      }
    }),

  // 更新文章
  update: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        title: z.string().min(1).max(255).optional(),
        slug: z.string().max(255).optional(),
        content: z.string().optional(),
        summary: z.string().max(500).optional(),
        cover: z.string().url().optional(),
        isPrivate: z.boolean().optional(),
        tags: z.array(z.string().max(50)).optional(),
        categories: z.array(z.string().max(50)).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      try {
        return await articleService.updateArticle(id, data)
      } catch (err: any) {
        if (err.code === 'P2002') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: '文章标题或 slug 已存在',
          })
        }
        throw err
      }
    }),

  // 删除文章
  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await articleService.deleteArticle(input.id)
      return { success: true }
    }),

  // 置顶/取消置顶
  toggleTop: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return articleService.toggleArticleTop(input.id)
    }),

  // 私密/公开
  togglePrivate: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return articleService.toggleArticlePrivate(input.id)
    }),
})

// 标签和分类路由
export const tagRouter = router({
  list: publicProcedure.query(async () => {
    return articleService.getAllTags()
  }),
})

export const categoryRouter = router({
  list: publicProcedure.query(async () => {
    return articleService.getAllCategories()
  }),
})
```

- [ ] **Step 2: 更新 _app.ts**

```typescript
import { router } from '../procedures'
import { authRouter } from './auth'
import { articleRouter, tagRouter, categoryRouter } from './article'

export const appRouter = router({
  auth: authRouter,
  article: articleRouter,
  tag: tagRouter,
  category: categoryRouter,
})

export type AppRouter = typeof appRouter
```

- [ ] **Step 3: Commit**

```bash
git add apps/server/src/trpc/routers
git commit -m "feat: add article tRPC router"
```

---

## Chunk 5: 后端评论模块

### Task 5.1: 评论服务层和路由

**Files:**
- Create: `apps/server/src/services/comment.service.ts`
- Create: `apps/server/src/trpc/routers/comment.ts`
- Modify: `apps/server/src/trpc/routers/_app.ts`

- [ ] **Step 1: 创建评论服务 apps/server/src/services/comment.service.ts**

```typescript
import { prisma } from '../prisma'
import type { Comment, Reply, Prisma } from '@prisma/client'

export interface CommentListInput {
  articleId: number
  page?: number
  pageSize?: number
}

export interface CommentWithReplies extends Comment {
  user: {
    id: number
    username: string | null
  }
  replies: (Reply & {
    user: {
      id: number
      username: string | null
    }
    children: Reply[]
  })[]
}

export async function getCommentsByArticle(articleId: number) {
  const comments = await prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  return comments
}

export async function createComment(articleId: number, userId: number, content: string) {
  // 检查用户是否被禁言
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { disabledDiscuss: true },
  })

  if (user?.disabledDiscuss) {
    throw new Error('USER_DISABLED')
  }

  return prisma.comment.create({
    data: {
      articleId,
      userId,
      content,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })
}

export async function deleteComment(id: number, userId: number, isAdmin: boolean) {
  const comment = await prisma.comment.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!comment) {
    throw new Error('COMMENT_NOT_FOUND')
  }

  // 只有管理员或评论作者可以删除
  if (!isAdmin && comment.userId !== userId) {
    throw new Error('FORBIDDEN')
  }

  await prisma.comment.delete({ where: { id } })
}

// 回复相关
export async function createReply(
  commentId: number,
  userId: number,
  content: string,
  replyTo?: number
) {
  // 检查用户是否被禁言
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { disabledDiscuss: true },
  })

  if (user?.disabledDiscuss) {
    throw new Error('USER_DISABLED')
  }

  return prisma.reply.create({
    data: {
      commentId,
      userId,
      content,
      replyTo,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })
}

export async function deleteReply(id: number, userId: number, isAdmin: boolean) {
  const reply = await prisma.reply.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!reply) {
    throw new Error('REPLY_NOT_FOUND')
  }

  if (!isAdmin && reply.userId !== userId) {
    throw new Error('FORBIDDEN')
  }

  await prisma.reply.delete({ where: { id } })
}
```

- [ ] **Step 2: 创建评论路由 apps/server/src/trpc/routers/comment.ts**

```typescript
import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, adminProcedure } from '../procedures'
import * as commentService from '../../services/comment.service'
import { TRPCError } from '@trpc/server'

export const commentRouter = router({
  list: publicProcedure
    .input(z.object({ articleId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return commentService.getCommentsByArticle(input.articleId)
    }),

  create: protectedProcedure
    .input(
      z.object({
        articleId: z.number().int().positive(),
        content: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await commentService.createComment(
          input.articleId,
          ctx.user.userId,
          input.content
        )
      } catch (err) {
        if (err instanceof Error && err.message === 'USER_DISABLED') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: '您已被禁言',
          })
        }
        throw err
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await commentService.deleteComment(
          input.id,
          ctx.user.userId,
          ctx.user.role === 'ADMIN'
        )
        return { success: true }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'COMMENT_NOT_FOUND') {
            throw new TRPCError({ code: 'NOT_FOUND', message: '评论不存在' })
          }
          if (err.message === 'FORBIDDEN') {
            throw new TRPCError({ code: 'FORBIDDEN', message: '没有权限删除此评论' })
          }
        }
        throw err
      }
    }),
})

export const replyRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        commentId: z.number().int().positive(),
        content: z.string().min(1).max(5000),
        replyTo: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await commentService.createReply(
          input.commentId,
          ctx.user.userId,
          input.content,
          input.replyTo
        )
      } catch (err) {
        if (err instanceof Error && err.message === 'USER_DISABLED') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: '您已被禁言',
          })
        }
        throw err
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await commentService.deleteReply(
          input.id,
          ctx.user.userId,
          ctx.user.role === 'ADMIN'
        )
        return { success: true }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === 'REPLY_NOT_FOUND') {
            throw new TRPCError({ code: 'NOT_FOUND', message: '回复不存在' })
          }
          if (err.message === 'FORBIDDEN') {
            throw new TRPCError({ code: 'FORBIDDEN', message: '没有权限删除此回复' })
          }
        }
        throw err
      }
    }),
})
```

- [ ] **Step 3: 更新 _app.ts**

```typescript
import { router } from '../procedures'
import { authRouter } from './auth'
import { articleRouter, tagRouter, categoryRouter } from './article'
import { commentRouter, replyRouter } from './comment'

export const appRouter = router({
  auth: authRouter,
  article: articleRouter,
  tag: tagRouter,
  category: categoryRouter,
  comment: commentRouter,
  reply: replyRouter,
})

export type AppRouter = typeof appRouter
```

- [ ] **Step 4: Commit**

```bash
git add apps/server/src/services/comment.service.ts apps/server/src/trpc/routers
git commit -m "feat: add comment and reply module"
```

---

## Chunk 6: 后端其他模块

### Task 6.1: Fragment 碎片模块

**Files:**
- Create: `apps/server/src/services/fragment.service.ts`
- Create: `apps/server/src/trpc/routers/fragment.ts`
- Modify: `apps/server/src/trpc/routers/_app.ts`

- [ ] **Step 1: 创建碎片服务 apps/server/src/services/fragment.service.ts**

```typescript
import { prisma } from '../prisma'
import type { Fragment, Prisma } from '@prisma/client'

export async function getFragmentList(isAdmin: boolean = false) {
  const where: Prisma.FragmentWhereInput = isAdmin ? {} : { isPrivate: false }

  return prisma.fragment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

export async function createFragment(content: string, isPrivate: boolean = false) {
  return prisma.fragment.create({
    data: { content, isPrivate },
  })
}

export async function updateFragment(id: number, data: { content?: string; isPrivate?: boolean }) {
  return prisma.fragment.update({
    where: { id },
    data,
  })
}

export async function deleteFragment(id: number) {
  await prisma.fragment.delete({ where: { id } })
}
```

- [ ] **Step 2: 创建碎片路由 apps/server/src/trpc/routers/fragment.ts**

```typescript
import { z } from 'zod'
import { router, publicProcedure, adminProcedure } from '../procedures'
import * as fragmentService from '../../services/fragment.service'

export const fragmentRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const isAdmin = ctx.user?.role === 'ADMIN'
    return fragmentService.getFragmentList(isAdmin)
  }),

  create: adminProcedure
    .input(
      z.object({
        content: z.string().min(1),
        isPrivate: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      return fragmentService.createFragment(input.content, input.isPrivate)
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        content: z.string().min(1).optional(),
        isPrivate: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return fragmentService.updateFragment(id, data)
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await fragmentService.deleteFragment(input.id)
      return { success: true }
    }),
})
```

- [ ] **Step 3: 更新 _app.ts**

```typescript
import { router } from '../procedures'
import { authRouter } from './auth'
import { articleRouter, tagRouter, categoryRouter } from './article'
import { commentRouter, replyRouter } from './comment'
import { fragmentRouter } from './fragment'

export const appRouter = router({
  auth: authRouter,
  article: articleRouter,
  tag: tagRouter,
  category: categoryRouter,
  comment: commentRouter,
  reply: replyRouter,
  fragment: fragmentRouter,
})

export type AppRouter = typeof appRouter
```

- [ ] **Step 4: Commit**

```bash
git add apps/server/src/services/fragment.service.ts apps/server/src/trpc/routers
git commit -m "feat: add fragment module"
```

---

### Task 6.2: Monitor 监控模块

**Files:**
- Create: `apps/server/src/services/monitor.service.ts`
- Create: `apps/server/src/trpc/routers/monitor.ts`
- Modify: `apps/server/src/trpc/routers/_app.ts`

- [ ] **Step 1: 创建监控服务 apps/server/src/services/monitor.service.ts**

```typescript
import { prisma } from '../prisma'
import os from 'os'

export interface Stats {
  articles: number
  comments: number
  users: number
  views: number
}

export async function getStats(): Promise<Stats> {
  const [articles, comments, users, viewsResult] = await Promise.all([
    prisma.article.count(),
    prisma.comment.count(),
    prisma.user.count(),
    prisma.article.aggregate({
      _sum: { viewCount: true },
    }),
  ])

  return {
    articles,
    comments,
    users,
    views: viewsResult._sum.viewCount || 0,
  }
}

export interface SystemInfo {
  platform: string
  nodeVersion: string
  uptime: number
  memoryUsage: {
    total: number
    free: number
    used: number
    usagePercent: number
  },
  cpuUsage: number
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const totalMemory = os.totalmem()
  const freeMemory = os.freemem()
  const usedMemory = totalMemory - freeMemory

  return {
    platform: os.platform(),
    nodeVersion: process.version,
    uptime: process.uptime(),
    memoryUsage: {
      total: totalMemory,
      free: freeMemory,
      used: usedMemory,
      usagePercent: (usedMemory / totalMemory) * 100,
    },
    cpuUsage: os.loadavg()[0],
  }
}

export async function getRecords(page: number = 1, pageSize: number = 20) {
  const skip = (page - 1) * pageSize

  const [items, total] = await Promise.all([
    prisma.record.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.record.count(),
  ])

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function recordVisit(ip: string, path: string, userAgent?: string) {
  return prisma.record.create({
    data: {
      ip,
      path,
      userAgent,
    },
  })
}
```

- [ ] **Step 2: 创建监控路由 apps/server/src/trpc/routers/monitor.ts**

```typescript
import { z } from 'zod'
import { router, adminProcedure } from '../procedures'
import * as monitorService from '../../services/monitor.service'

export const monitorRouter = router({
  stats: adminProcedure.query(async () => {
    return monitorService.getStats()
  }),

  systemInfo: adminProcedure.query(async () => {
    return monitorService.getSystemInfo()
  }),

  records: adminProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().max(100).default(20),
      })
    )
    .query(async ({ input }) => {
      return monitorService.getRecords(input.page, input.pageSize)
    }),
})
```

- [ ] **Step 3: 更新 _app.ts**

```typescript
import { router } from '../procedures'
import { authRouter } from './auth'
import { articleRouter, tagRouter, categoryRouter } from './article'
import { commentRouter, replyRouter } from './comment'
import { fragmentRouter } from './fragment'
import { monitorRouter } from './monitor'

export const appRouter = router({
  auth: authRouter,
  article: articleRouter,
  tag: tagRouter,
  category: categoryRouter,
  comment: commentRouter,
  reply: replyRouter,
  fragment: fragmentRouter,
  monitor: monitorRouter,
})

export type AppRouter = typeof appRouter
```

- [ ] **Step 4: Commit**

```bash
git add apps/server/src/services/monitor.service.ts apps/server/src/trpc/routers
git commit -m "feat: add monitor module"
```

---

## Chunk 7: 前端基础架构

### Task 7.1: 创建前端项目

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/tailwind.config.js`
- Create: `apps/web/postcss.config.js`
- Create: `apps/web/index.html`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/App.tsx`
- Create: `apps/web/src/styles/globals.css`

- [ ] **Step 1: 创建 apps/web/package.json**

```json
{
  "name": "@blog/web",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext ts,tsx"
  },
  "dependencies": {
    "@blog/shared": "workspace:*",
    "@hookform/resolvers": "^3.3.4",
    "@tanstack/react-query": "^5.28.0",
    "@tanstack/react-router": "^1.20.0",
    "@trpc/client": "^11.0.0",
    "@trpc/tanstack-react-query": "^11.0.0",
    "antd": "^5.15.0",
    "dayjs": "^1.11.10",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.51.0",
    "react-markdown": "^9.0.1",
    "uuid": "^9.0.0",
    "zustand": "^4.5.2",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/uuid": "^9.0.8",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.0",
    "vite": "^5.1.0",
    "vitest": "^1.3.0"
  }
}
```

- [ ] **Step 2: 创建 apps/web/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: 创建 apps/web/tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: 创建 apps/web/vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/trpc': {
        target: 'http://localhost:6060',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:6060',
        changeOrigin: true,
      },
    },
  },
})
```

- [ ] **Step 5: 创建 apps/web/tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 避免与 antd 冲突
  },
}
```

- [ ] **Step 6: 创建 apps/web/postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: 创建 apps/web/index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Blog</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: 创建 apps/web/src/styles/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定义样式 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Markdown 样式 */
.markdown-body {
  line-height: 1.6;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.markdown-body p {
  margin-bottom: 1em;
}

.markdown-body pre {
  background-color: #f6f8fa;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
}

.markdown-body code {
  background-color: #f6f8fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.markdown-body pre code {
  background-color: transparent;
  padding: 0;
}

.markdown-body blockquote {
  border-left: 4px solid #dfe2e5;
  padding-left: 1em;
  color: #6a737d;
  margin: 1em 0;
}

.markdown-body img {
  max-width: 100%;
  height: auto;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.markdown-body th,
.markdown-body td {
  border: 1px solid #dfe2e5;
  padding: 8px 12px;
}

.markdown-body th {
  background-color: #f6f8fa;
}
```

- [ ] **Step 9: 创建 apps/web/src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
```

- [ ] **Step 10: 创建 apps/web/src/App.tsx (基础版)**

```typescript
import { trpc } from './trpc'

function App() {
  const health = trpc.health.useQuery()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">React Blog</h1>
          <p className="text-gray-500 mt-1">
            {health.isLoading ? 'Connecting...' : health.data?.status || 'Server offline'}
          </p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4">
        <p className="text-gray-600">Welcome to React Blog v2.0</p>
      </main>
    </div>
  )
}

export default App
```

- [ ] **Step 11: Commit**

```bash
git add apps/web
git commit -m "feat: initialize frontend with Vite + React + Tailwind"
```

---

### Task 7.2: 配置 tRPC 客户端

**Files:**
- Create: `apps/web/src/trpc/client.ts`
- Create: `apps/web/src/trpc/react.ts`
- Create: `apps/web/src/trpc/index.ts`

- [ ] **Step 1: 创建 apps/web/src/trpc/client.ts**

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@blog/server/trpc'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''
  return `http://localhost:6060`
}

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include', // 发送 cookie
        })
      },
    }),
  ],
})
```

- [ ] **Step 2: 创建 apps/web/src/trpc/react.ts**

```typescript
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@blog/server/trpc'

export const trpc = createTRPCReact<AppRouter>()
```

- [ ] **Step 3: 创建 apps/web/src/trpc/index.ts**

```typescript
export { trpc } from './react'
export { trpcClient } from './client'
```

- [ ] **Step 4: 更新 apps/web/src/main.tsx 添加 tRPC Provider**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from './trpc'
import App from './App'
import './styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const trpcClient = trpc.createClient({
  links: [
    trpc.httpBatchLink({
      url: '/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        })
      },
    }),
  ],
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
)
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/trpc apps/web/src/main.tsx
git commit -m "feat: add tRPC client setup"
```

---

### Task 7.3: 添加健康检查路由

**Files:**
- Modify: `apps/server/src/trpc/routers/_app.ts`

- [ ] **Step 1: 在 _app.ts 添加健康检查路由**

```typescript
import { router, publicProcedure } from '../procedures'
import { authRouter } from './auth'
import { articleRouter, tagRouter, categoryRouter } from './article'
import { commentRouter, replyRouter } from './comment'
import { fragmentRouter } from './fragment'
import { monitorRouter } from './monitor'

export const appRouter = router({
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),
  auth: authRouter,
  article: articleRouter,
  tag: tagRouter,
  category: categoryRouter,
  comment: commentRouter,
  reply: replyRouter,
  fragment: fragmentRouter,
  monitor: monitorRouter,
})

export type AppRouter = typeof appRouter
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/trpc/routers/_app.ts
git commit -m "feat: add health check tRPC route"
```

---

## 后续实现说明

由于计划文档已经非常长，后续的页面开发（认证页面、文章页面、评论组件、后台管理等）将遵循相同的 TDD 模式：

1. **每个组件/页面先写测试**
2. **运行测试确认失败**
3. **实现最小代码使测试通过**
4. **提交代码**

**剩余任务（每个都需要详细步骤）：**
- Task 8.x: 认证页面（登录、注册、GitHub OAuth）
- Task 9.x: 文章页面（列表、详情、编辑）
- Task 10.x: 评论组件
- Task 11.x: 后台管理页面
- Task 12.x: Fragment 页面
- Task 13.x: E2E 测试
- Task 14.x: Docker 部署配置

这些任务将在执行时按照相同的详细程度进行实现。
