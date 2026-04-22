# React Blog 全面重构设计文档

## 概述

将现有 React Blog 项目进行全面重构，采用最新的技术栈和最佳实践。

### 技术栈选型

| 层级 | 旧技术 | 新技术 |
|------|--------|--------|
| 前端框架 | React 16 + Redux | React 18 + TypeScript |
| 构建工具 | Webpack 4 | Vite 5 |
| 状态管理 | Redux + Thunk | Zustand + TanStack Query |
| 路由 | React Router 5 | TanStack Router |
| API 通信 | Axios | tRPC (端到端类型安全) |
| 表单 | 无 | React Hook Form + Zod |
| 后端框架 | Koa 2 | Fastify 5 |
| ORM | Sequelize 5 | Prisma 6 |
| 数据库 | MySQL | MySQL |
| 部署 | 分离部署 | 单体部署 |

---

## 项目架构

```
react-blog/
├── apps/
│   ├── web/                 # 前端 (React + Vite)
│   │   ├── src/
│   │   │   ├── components/  # 通用组件
│   │   │   ├── features/    # 功能模块
│   │   │   ├── hooks/       # 自定义 hooks
│   │   │   ├── layouts/     # 布局组件
│   │   │   ├── pages/       # 页面路由
│   │   │   ├── stores/      # Zustand 状态管理
│   │   │   ├── trpc/        # tRPC 客户端配置
│   │   │   ├── types/       # TypeScript 类型
│   │   │   └── utils/       # 工具函数
│   │   └── ...
│   │
│   └── server/              # 后端 (Fastify + Prisma)
│       ├── src/
│       │   ├── modules/     # 功能模块
│       │   ├── trpc/        # tRPC 路由定义
│       │   ├── prisma/      # 数据库 schema
│       │   ├── middlewares/ # 中间件
│       │   ├── services/    # 业务逻辑
│       │   └── utils/       # 工具函数
│       └── ...
│
├── packages/
│   └── shared/              # 共享类型和工具
│       ├── src/
│       │   ├── types/       # 共享类型定义
│       │   └── constants/   # 共享常量
│       └── ...
│
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

**设计要点：**
- 使用 pnpm workspace 管理多包
- apps/web - 前端应用
- apps/server - 后端 API，同时托管前端静态文件
- packages/shared - 前后端共享的类型和常量

---

## 数据库设计 (Prisma Schema)

### 用户表 (User)

```prisma
model User {
  id              Int       @id @default(autoincrement())
  username        String?   @db.VarChar(50)
  password        String?   // bcrypt 加密
  email           String?   @db.VarChar(50)
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

  @@index([email])
}

enum Role {
  ADMIN
  USER
}
```

### 文章表 (Article)

```prisma
model Article {
  id        Int      @id @default(autoincrement())
  title     String   @unique @db.VarChar(255)
  content   String?  @db.Text
  summary   String?  @db.VarChar(500)
  cover     String?  @db.VarChar(500)
  viewCount Int      @default(0)
  isPrivate Boolean  @default(false)
  isTop     Boolean  @default(false)
  uuid      String?  @db.VarChar(32)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tags       Tag[]
  categories Category[]
  comments   Comment[]

  @@index([isPrivate, isTop, createdAt])
}
```

### 标签表 (Tag)

```prisma
model Tag {
  id        Int     @id @default(autoincrement())
  name      String  @db.VarChar(50)
  articleId Int
  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)

  @@unique([name, articleId])
}
```

### 分类表 (Category)

```prisma
model Category {
  id        Int     @id @default(autoincrement())
  name      String  @db.VarChar(50)
  articleId Int
  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)

  @@unique([name, articleId])
}
```

### 评论表 (Comment)

```prisma
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
}
```

### 回复表 (Reply)

```prisma
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

  @@index([commentId])
}
```

### 碎片/语录表 (Fragment)

```prisma
model Fragment {
  id        Int      @id @default(autoincrement())
  content   String   @db.Text
  isPrivate Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 访问记录表 (Record)

```prisma
model Record {
  id        Int      @id @default(autoincrement())
  ip        String   @db.VarChar(50)
  path      String   @db.VarChar(255)
  userAgent String?  @db.VarChar(500)
  createdAt DateTime @default(now())

  @@index([ip, createdAt])
}
```

### IP 黑名单 (Ip)

```prisma
model Ip {
  id        Int      @id @default(autoincrement())
  ip        String   @db.VarChar(50)
  userId    Int?
  user      User?    @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@unique([ip])
}
```

---

## tRPC API 设计

```typescript
const appRouter = router({
  // 文章模块
  article: router({
    list: publicProcedure.query(...),
    byId: publicProcedure.query(...),
    byUuid: publicProcedure.query(...),
    create: protectedProcedure.mutation(...),
    update: protectedProcedure.mutation(...),
    delete: protectedProcedure.mutation(...),
    toggleTop: protectedProcedure.mutation(...),
    togglePrivate: protectedProcedure.mutation(...),
    uploadMd: protectedProcedure.mutation(...),
    exportMd: publicProcedure.query(...),
  }),

  // 分类/标签
  tag: router({
    list: publicProcedure.query(...),
    create: protectedProcedure.mutation(...),
  }),
  category: router({
    list: publicProcedure.query(...),
    create: protectedProcedure.mutation(...),
  }),

  // 评论模块
  comment: router({
    list: publicProcedure.query(...),
    create: publicProcedure.mutation(...),
    delete: protectedProcedure.mutation(...),
  }),
  reply: router({
    list: publicProcedure.query(...),
    create: publicProcedure.mutation(...),
    delete: protectedProcedure.mutation(...),
  }),

  // 用户模块
  auth: router({
    login: publicProcedure.mutation(...),
    register: publicProcedure.mutation(...),
    logout: publicProcedure.mutation(...),
    me: publicProcedure.query(...),
    updateProfile: protectedProcedure.mutation(...),
    githubCallback: publicProcedure.query(...),
  }),

  // 碎片/语录
  fragment: router({
    list: publicProcedure.query(...),
    create: protectedProcedure.mutation(...),
    update: protectedProcedure.mutation(...),
    delete: protectedProcedure.mutation(...),
  }),

  // 监控/统计
  monitor: router({
    stats: protectedProcedure.query(...),
    systemInfo: protectedProcedure.query(...),
    records: protectedProcedure.query(...),
  }),

  // 文件上传
  upload: router({
    image: protectedProcedure.mutation(...),
  }),
})

export type AppRouter = typeof appRouter
```

**设计要点：**
- `publicProcedure` - 无需登录即可访问
- `protectedProcedure` - 需要登录，admin 相关会检查权限
- 每个模块独立 router，便于维护
- 前端通过 `trpc.article.list.query()` 调用，自动类型推断

---

## 前端架构

```
apps/web/src/
├── components/          # 通用组件
│   ├── ui/              # 基础 UI 组件
│   ├── layout/          # 布局组件
│   └── features/        # 功能组件
│
├── features/            # 功能模块
│   ├── article/
│   ├── auth/
│   ├── admin/
│   ├── comment/
│   └── ...
│
├── hooks/               # 全局 hooks
├── stores/              # Zustand 状态
├── trpc/                # tRPC 客户端
├── pages/               # 路由页面入口
├── router/              # 路由配置
├── styles/              # 全局样式
├── types/               # 类型定义
├── utils/               # 工具函数
└── main.tsx
```

**技术选型：**
- 路由: TanStack Router（类型安全路由）
- 状态管理: Zustand（轻量级）+ TanStack Query（服务端状态）
- 表单: React Hook Form + Zod（类型安全验证）
- UI: 保留 Ant Design
- 样式: Tailwind CSS

---

## 测试策略

### 单元测试

**前端：**
- 组件测试：测试 UI 渲染和交互
- Hooks 测试：测试自定义 hooks 逻辑
- 工具函数测试：测试 utils 函数

**后端：**
- Service 层测试：测试业务逻辑
- tRPC router 测试：测试 API 输入输出

**工具：** Vitest + Testing Library

### 集成测试

**API 测试：**
- 使用 Testcontainers 启动真实 MySQL 容器
- 测试完整的请求-响应流程
- 测试认证、权限控制

**工具：** Vitest + Testcontainers

### E2E 测试

**关键用户流程：**
- 用户登录/注册
- 文章创建/编辑/删除
- 评论发布
- GitHub OAuth 登录

**工具：** Playwright

### 测试覆盖率目标

| 类型 | 覆盖率 |
|------|--------|
| 单元测试 | 80%+ |
| 集成测试 | 关键 API 100% |
| E2E 测试 | 核心流程覆盖 |

---

## 部署架构

**单体部署模式：**
- Fastify 服务器托管前端静态文件（生产构建产物）
- 同一服务器提供 tRPC API
- MySQL 数据库独立运行
- 支持 Docker Compose 一键部署

---

## 功能清单

### 核心功能
- [ ] 文章管理（CRUD、Markdown 编辑、私密/公开、置顶）
- [ ] 分类和标签
- [ ] 评论系统（评论、回复、邮件通知）
- [ ] 用户系统（本地注册、GitHub OAuth）
- [ ] 后台管理

### 扩展功能
- [ ] 访问统计/监控面板
- [ ] 碎片/语录管理
- [ ] 文件导入导出（Markdown）
