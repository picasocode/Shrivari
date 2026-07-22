/**
 * Database client — uses Supabase REST API (PostgREST) as the primary backend.
 *
 * No Prisma DB connection is needed at runtime. All data flows through
 * the Supabase REST endpoint using the service_role key (bypasses RLS).
 *
 * The `db` object provides a Prisma-compatible interface so API routes
 * don't need any changes.
 */
export { db } from './supabase-db'
