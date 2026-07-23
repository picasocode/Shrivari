/**
 * One-time script: create the `ProjectRecord` table in Supabase and upload
 * the 159 records from data/project-records.json.
 *
 * Run with: node scripts/setup-project-records.mjs
 *
 * Uses the pooled Supabase connection (DATABASE_URL) — same credentials as
 * Prisma, just run once for setup.
 */
import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// NOTE: the shell environment may carry a stale SQLite DATABASE_URL, so we read
// the real Supabase connection string straight from the .env file.
function loadEnvVar(key) {
  try {
    const envText = fs.readFileSync(
      path.join(__dirname, "..", ".env"),
      "utf-8"
    );
    const m = envText.match(new RegExp(`^${key}=["']?([^"'\n]+)["']?`, "m"));
    if (m) return m[1];
  } catch {
    /* ignore */
  }
  return null;
}

const SUPA_HOST = "aws-0-ap-northeast-1.pooler.supabase.com";
const SUPA_USER = "postgres.uegbwedkxiimmfaykwxh";
const SUPA_PASS = "Bemi@2026glob";
const SUPA_DB = "postgres";

// Direct (non-pooled) connection on port 5432 — works better with the `pg`
// driver for DDL + bulk inserts.
const client = new pg.Client({
  host: SUPA_HOST,
  port: 5432,
  user: SUPA_USER,
  password: SUPA_PASS,
  database: SUPA_DB,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
});

async function main() {
  console.log("→ Connecting to Supabase (pooled)…");
  await client.connect();
  console.log("✓ Connected");

  // 1. Create the table (idempotent — matches the Prisma ProjectRecord model)
  console.log("→ Creating ProjectRecord table (if not exists)…");
  await client.query(`
    CREATE TABLE IF NOT EXISTS "ProjectRecord" (
      id            TEXT PRIMARY KEY,
      sno           INTEGER NOT NULL DEFAULT 0,
      "customerName" TEXT NOT NULL DEFAULT '',
      "voltageLevel" TEXT NOT NULL DEFAULT '',
      industry      TEXT NOT NULL DEFAULT '',
      "scopeOfWork"  TEXT NOT NULL DEFAULT '',
      location      TEXT NOT NULL DEFAULT '',
      state         TEXT NOT NULL DEFAULT '',
      "projectValue" TEXT NOT NULL DEFAULT '',
      year          TEXT NOT NULL DEFAULT '',
      active        BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // helpful indexes for the filters used by the Projects page
  await client.query(`CREATE INDEX IF NOT EXISTS "ProjectRecord_industry_idx" ON "ProjectRecord" (industry);`);
  await client.query(`CREATE INDEX IF NOT EXISTS "ProjectRecord_state_idx" ON "ProjectRecord" (state);`);
  await client.query(`CREATE INDEX IF NOT EXISTS "ProjectRecord_year_idx" ON "ProjectRecord" (year);`);
  console.log("✓ Table ready");

  // 2. Load JSON data
  const file = path.join(__dirname, "..", "data", "project-records.json");
  const records = JSON.parse(await fsp.readFile(file, "utf-8"));
  console.log(`→ Loaded ${records.length} records from JSON`);

  // 3. Truncate + insert (clean re-upload each run)
  console.log("→ Clearing existing rows…");
  await client.query(`TRUNCATE TABLE "ProjectRecord";`);

  console.log("→ Inserting records…");
  let inserted = 0;
  const now = new Date().toISOString();
  for (const r of records) {
    const id = `pr_${r.sno}_${Date.now().toString(36)}_${inserted}`;
    await client.query(
      `INSERT INTO "ProjectRecord"
        (id, sno, "customerName", "voltageLevel", industry, "scopeOfWork", location, state, "projectValue", year, active, "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        id,
        Number(r.sno) || 0,
        r.customer || "",
        r.voltage || "",
        r.industry || "",
        r.scope || "",
        r.location || "",
        r.state || "",
        r.value || "",
        r.year || "",
        true,
        now,
        now,
      ]
    );
    inserted++;
  }
  console.log(`✓ Inserted ${inserted} records`);

  // 4. Verify
  const { rows } = await client.query(`SELECT COUNT(*)::int AS n FROM "ProjectRecord";`);
  console.log(`✓ Verified: ${rows[0].n} rows in ProjectRecord table`);

  const { rows: distinct } = await client.query(
    `SELECT COUNT(DISTINCT industry)::int AS industries, COUNT(DISTINCT state)::int AS states, COUNT(DISTINCT year)::int AS years FROM "ProjectRecord";`
  );
  console.log(`✓ Distinct: ${JSON.stringify(distinct[0])}`);

  await client.end();
  console.log("✓ Done — ProjectRecord table created & populated in Supabase");
}

main().catch((e) => {
  console.error("✗ Error:", e.message);
  console.error(e);
  process.exit(1);
});
