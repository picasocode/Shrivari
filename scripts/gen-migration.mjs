/**
 * Generate supabase/migrations/0001_project_records.sql from
 * data/project-records.json — creates the ProjectRecord table and seeds
 * all 159 records. Run once in the Supabase SQL Editor.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const records = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "data", "project-records.json"), "utf-8")
);

const esc = (s) => String(s ?? "").replace(/'/g, "''");
const now = new Date().toISOString();

const lines = [];
lines.push("-- ============================================================");
lines.push("-- Migration: Create ProjectRecord table + seed " + records.length + " records");
lines.push("-- Run this ONCE in the Supabase Dashboard SQL Editor");
lines.push("-- (Dashboard → SQL Editor → New query → paste → Run)");
lines.push("-- ============================================================");
lines.push("");
lines.push('CREATE TABLE IF NOT EXISTS "ProjectRecord" (');
lines.push("  id              TEXT PRIMARY KEY,");
lines.push("  sno             INTEGER NOT NULL DEFAULT 0,");
lines.push('  "customerName"   TEXT NOT NULL DEFAULT \'\',');
lines.push('  "voltageLevel"   TEXT NOT NULL DEFAULT \'\',');
lines.push("  industry        TEXT NOT NULL DEFAULT '',");
lines.push('  "scopeOfWork"    TEXT NOT NULL DEFAULT \'\',');
lines.push("  location        TEXT NOT NULL DEFAULT '',");
lines.push("  state           TEXT NOT NULL DEFAULT '',");
lines.push('  "projectValue"   TEXT NOT NULL DEFAULT \'\',');
lines.push("  year            TEXT NOT NULL DEFAULT '',");
lines.push("  active          BOOLEAN NOT NULL DEFAULT TRUE,");
lines.push('  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),');
lines.push('  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()');
lines.push(");");
lines.push("");
lines.push('CREATE INDEX IF NOT EXISTS "ProjectRecord_industry_idx" ON "ProjectRecord" (industry);');
lines.push('CREATE INDEX IF NOT EXISTS "ProjectRecord_state_idx" ON "ProjectRecord" (state);');
lines.push('CREATE INDEX IF NOT EXISTS "ProjectRecord_year_idx" ON "ProjectRecord" (year);');
lines.push("");
lines.push("-- Clear existing rows (idempotent re-run)");
lines.push('TRUNCATE TABLE "ProjectRecord";');
lines.push("");
lines.push("-- Insert " + records.length + " records");
records.forEach((r) => {
  const vals = [
    "'pr_" + r.sno + "'",
    String(Number(r.sno) || 0),
    "'" + esc(r.customer) + "'",
    "'" + esc(r.voltage) + "'",
    "'" + esc(r.industry) + "'",
    "'" + esc(r.scope) + "'",
    "'" + esc(r.location) + "'",
    "'" + esc(r.state) + "'",
    "'" + esc(r.value) + "'",
    "'" + esc(r.year) + "'",
    "TRUE",
    "'" + now + "'",
    "'" + now + "'",
  ];
  lines.push(
    'INSERT INTO "ProjectRecord" (id, sno, "customerName", "voltageLevel", industry, "scopeOfWork", location, state, "projectValue", year, active, "createdAt", "updatedAt") VALUES (' +
      vals.join(", ") +
      ");"
  );
});
lines.push("");
lines.push("-- Verify");
lines.push('SELECT COUNT(*) AS total FROM "ProjectRecord";');
lines.push("");

const sql = lines.join("\n");
const out = path.join(__dirname, "..", "supabase", "migrations", "0001_project_records.sql");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, sql);
console.log("✓ Wrote " + out);
console.log("  Records: " + records.length);
console.log("  Size: " + (fs.statSync(out).size / 1024).toFixed(1) + " KB");
