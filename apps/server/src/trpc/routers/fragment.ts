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
