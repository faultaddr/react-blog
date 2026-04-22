import { createTRPCReact } from '@trpc/react-query'

// 由于后端和前端在同一个 monorepo，我们需要通过类型导入
// 这里使用 any 作为临时解决方案，实际使用时会从后端导入
export const trpc = createTRPCReact<any>()
