import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import staticPlugin from '@fastify/static'
import path from 'path'
import { config } from './config'
import { prisma } from './prisma'
import { registerTRPC } from './trpc'

async function main() {
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

  // 生产环境：服务静态文件
  if (config.isProd) {
    const webDistPath = path.join(__dirname, '../../web/dist')
    await app.register(staticPlugin, {
      root: webDistPath,
      prefix: '/',
    })

    // SPA fallback
    app.setNotFoundHandler((request, reply) => {
      if (!request.url.startsWith('/trpc')) {
        return reply.sendFile('index.html')
      }
      return reply.code(404).send({ error: 'Not found' })
    })
  }

  // 启动服务器
  try {
    // 测试数据库连接
    await prisma.$connect()
    console.log('Database connected')

    await app.listen({ port: config.port, host: '0.0.0.0' })
    console.log(`Server running on http://localhost:${config.port}`)

    if (config.isDev) {
      console.log('Frontend dev server should run on http://localhost:5173')
    }
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
