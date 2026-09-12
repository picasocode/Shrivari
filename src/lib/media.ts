import { db } from "@/lib/db";

// ───────────────────────────────────────────────────────────────────────────
// Uploaded-media bootstrap (same zero-touch pattern as ManufacturingItem /
// Career): creates the Media table on first use when the database predates
// it, so production MySQL needs no manual migration step. The SQL is valid
// on both MySQL (LONGBLOB) and SQLite (BLOB affinity).
// ───────────────────────────────────────────────────────────────────────────
export const MEDIA_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS Media (
  id VARCHAR(191) PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  mimeType VARCHAR(191) NOT NULL,
  size INT NOT NULL,
  data LONGBLOB NOT NULL,
  createdAt DATETIME NOT NULL
)`.trim();

let ensurePromise: Promise<void> | null = null;

export function ensureMediaTable(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = db
      .$executeRawUnsafe(MEDIA_TABLE_SQL)
      .then(() => undefined)
      .catch(err => {
        console.error(
          "ensureMediaTable failed (will retry on next request):",
          err
        );
        ensurePromise = null;
        throw err;
      });
  }
  return ensurePromise;
}
