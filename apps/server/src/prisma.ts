import { PrismaClient } from '@prisma/client'
import { config } from './config'

export const prisma = new PrismaClient({
  log: config.isDev ? ['query', 'info', 'warn', 'error'] : ['error'],
})
