import { db } from "@/lib/db";

// ───────────────────────────────────────────────────────────────────────────
// Job-applications bootstrap (same zero-touch pattern as ManufacturingItem /
// Career / Media): creates the JobApplication table on first use when the
// database predates it, so production MySQL needs no manual migration step.
// The SQL is valid on both MySQL and SQLite.
// ───────────────────────────────────────────────────────────────────────────
export const JOB_APPLICATION_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS JobApplication (
  id VARCHAR(191) PRIMARY KEY,
  jobTitle VARCHAR(255) NOT NULL,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(191) NOT NULL,
  experience VARCHAR(191) NOT NULL,
  resumeUrl VARCHAR(1024) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(191) NOT NULL,
  createdAt DATETIME NOT NULL
)`.trim();

let ensurePromise: Promise<void> | null = null;

export function ensureJobApplicationsTable(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = db
      .$executeRawUnsafe(JOB_APPLICATION_TABLE_SQL)
      .then(() => undefined)
      .catch(err => {
        console.error(
          "ensureJobApplicationsTable failed (will retry on next request):",
          err
        );
        ensurePromise = null;
        throw err;
      });
  }
  return ensurePromise;
}
