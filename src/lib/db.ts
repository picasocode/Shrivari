import { PrismaClient } from '@prisma/client'

/**
 * Database client — Prisma connected to the remote MySQL database
 * (Hostinger: srv2124.hstgr.io), configured via DATABASE_URL in .env.
 *
 * The same `db` object is exported as before, so all API routes keep
 * working unchanged — they now hit the real database through Prisma
 * instead of the Supabase REST emulation.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
