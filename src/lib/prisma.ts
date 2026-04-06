import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  return new PrismaClient()
}

/** True when the generated client includes JEI models (after `prisma generate`). */
function isJeiClientReady(client: PrismaClient): boolean {
  const c = client as unknown as {
    jeiProgram?: { upsert?: unknown }
    jeiParentStudent?: { findMany?: unknown }
  }
  return typeof c.jeiProgram?.upsert === 'function' && typeof c.jeiParentStudent?.findMany === 'function'
}

/**
 * In development, Next.js can keep a global Prisma singleton that was constructed
 * before `prisma generate` added new models, so delegates like `jeiProgram` are missing.
 * A Proxy re-resolves the client and replaces stale globals on each access.
 */
const prismaDev: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    let client = globalForPrisma.prisma
    if (client && !isJeiClientReady(client)) {
      void client.$disconnect().catch(() => {})
      globalForPrisma.prisma = undefined
      client = undefined
    }
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient()
    }
    const resolved = globalForPrisma.prisma!
    const value = Reflect.get(resolved as object, prop, receiver)
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(resolved) : value
  },
})

export const prisma: PrismaClient =
  process.env.NODE_ENV === 'production'
    ? (globalForPrisma.prisma ??= createPrismaClient())
    : prismaDev
