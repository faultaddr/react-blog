import { createTRPCReact } from '@trpc/react-query'

// 使用 any 类型避免跨包类型导入问题
export const trpc = createTRPCReact<any>()
