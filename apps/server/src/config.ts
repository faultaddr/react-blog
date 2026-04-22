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
