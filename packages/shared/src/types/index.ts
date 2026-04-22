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
