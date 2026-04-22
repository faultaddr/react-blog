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
