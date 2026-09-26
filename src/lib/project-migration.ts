import { db } from '@/lib/db'

/**
 * Self-migrating schema guard for the Project.status column.
 *
 * Runs once per server process: checks information_schema and adds the
 * `status` column (mirroring `category` for existing rows) if the live
 * database does not have it yet. Keeps deploys error-free even when the
 * production database has not been migrated manually.
 */
let ensurePromise: Promise<void> | null = null

async function doEnsure(): Promise<void> {
  const columns = await db.$queryRawUnsafe<{ found: number }[]>(
    `SELECT COUNT(*) AS found FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Project' AND COLUMN_NAME = 'status'`
  )
  if (columns[0]?.found) return

  await db.$executeRawUnsafe(
    `ALTER TABLE \`Project\` ADD COLUMN \`status\` VARCHAR(191) NOT NULL DEFAULT 'ongoing'`
  )
  // Existing rows: mirror their category so "completed" projects do not
  // suddenly appear in the Home page Ongoing sections.
  await db.$executeRawUnsafe(`UPDATE \`Project\` SET \`status\` = \`category\``)
}

export function ensureProjectStatusColumn(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = doEnsure().catch((err) => {
      // Reset so the next request can retry (e.g. transient lock timeout)
      ensurePromise = null
      throw err
    })
  }
  return ensurePromise
}

/** Sanitize a status value coming from an API payload. */
export function sanitizeProjectStatus(value: unknown): string {
  return value === 'completed' ? 'completed' : 'ongoing'
}
