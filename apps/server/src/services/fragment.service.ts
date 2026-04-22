import { prisma } from '../prisma'
import type { Prisma } from '@prisma/client'

export async function getFragmentList(isAdmin: boolean = false) {
  const where: Prisma.FragmentWhereInput = isAdmin ? {} : { isPrivate: false }

  return prisma.fragment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

export async function createFragment(content: string, isPrivate: boolean = false) {
  return prisma.fragment.create({
    data: { content, isPrivate },
  })
}

export async function updateFragment(id: number, data: { content?: string; isPrivate?: boolean }) {
  return prisma.fragment.update({
    where: { id },
    data,
  })
}

export async function deleteFragment(id: number) {
  await prisma.fragment.delete({ where: { id } })
}
