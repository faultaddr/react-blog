import pino from 'pino'
import { config } from '../config'

export const logger = pino({
  level: config.logLevel,
  transport: config.isDev ? { target: 'pino-pretty' } : undefined,
})
