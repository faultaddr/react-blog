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
