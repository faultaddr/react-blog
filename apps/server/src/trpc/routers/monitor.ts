import { z } from 'zod'
import { router, adminProcedure } from '../procedures'
import * as monitorService from '../../services/monitor.service'

export const monitorRouter = router({
  stats: adminProcedure.query(async () => {
    return monitorService.getStats()
  }),

  systemInfo: adminProcedure.query(async () => {
    return monitorService.getSystemInfo()
  }),

  records: adminProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().max(100).default(20),
      })
    )
    .query(async ({ input }) => {
      return monitorService.getRecords(input.page, input.pageSize)
    }),
})
