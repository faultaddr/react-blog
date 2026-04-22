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
  }
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
