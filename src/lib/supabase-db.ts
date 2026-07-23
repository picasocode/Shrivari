/**
 * Supabase REST API client — drop-in replacement for the Prisma `db` client.
 *
 * Uses the Supabase PostgREST endpoint with the service_role key so it
 * bypasses Row Level Security, just like Prisma with a direct DB connection.
 *
 * Supported models: product, service, client, testimonial, blog, project,
 *   siteSetting, teamMember, sector, milestone, branch, career, user,
 *   session, contactMessage
 *
 * Supported methods per model:
 *   findMany, findUnique, findFirst, create, update, delete, deleteMany,
 *   count, upsert
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Map Prisma model names to the actual Supabase table names.
 *  In this project the Prisma model names map 1-to-1 to camelCase table names
 *  because the schema was pushed with Prisma which creates tables matching
 *  the model names (minus the leading capital).  Supabase/PostgREST exposes
 *  them with the exact same casing.  We keep an explicit map so we can
 *  adjust if needed. */
const modelToTable: Record<string, string> = {
  product: 'Product',
  service: 'Service',
  client: 'Client',
  testimonial: 'Testimonial',
  blog: 'Blog',
  project: 'Project',
  siteSetting: 'SiteSetting',
  teamMember: 'TeamMember',
  sector: 'Sector',
  milestone: 'Milestone',
  branch: 'Branch',
  career: 'Career',
  user: 'User',
  session: 'Session',
  contactMessage: 'ContactMessage',
  projectRecord: 'ProjectRecord',
};

function baseUrl(table: string): string {
  return `${SUPABASE_URL}/rest/v1/${table}`;
}

function authHeaders(prefer?: string): Record<string, string> {
  const h: Record<string, string> = {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };
  if (prefer) h['Prefer'] = prefer;
  return h;
}

/**
 * Build PostgREST query-string filter params from a Prisma-style `where` object.
 * Only flat equality filters are needed by the current codebase.
 */
function buildWhereParams(where?: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams();
  if (!where) return params;

  for (const [key, value] of Object.entries(where)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'boolean') {
      params.append(key, `eq.${value}`);
    } else if (typeof value === 'number') {
      params.append(key, `eq.${value}`);
    } else {
      params.append(key, `eq.${value}`);
    }
  }
  return params;
}

/**
 * Build `order` query param from Prisma-style `orderBy`.
 * Supports single-field: `{ order: 'asc' }` or `{ createdAt: 'desc' }`
 */
function applyOrderBy(
  params: URLSearchParams,
  orderBy?: Record<string, string>,
): void {
  if (!orderBy) return;
  for (const [field, direction] of Object.entries(orderBy)) {
    params.append('order', `${field}.${direction}`);
  }
}

/**
 * Build `select` param for PostgREST, including relation joins when `include`
 * is specified.  Currently the only `include` used in the codebase is
 * `{ user: true }` on the Session model.
 *
 * PostgREST embed syntax requires `alias:Table(*)` — note:
 *   - `(*)` not `:*`  (the old `:*` form is invalid and triggers PGRST100)
 *   - the embedded table name must match the actual Postgres table casing
 *     (our tables are capitalised, e.g. `User`, while Prisma's relation key
 *     is camelCase, e.g. `user`).  We look up the real table name via
 *     `modelToTable` so the alias preserves the Prisma-compatible lowercase
 *     key the rest of the code expects (e.g. `session.user`).
 */
function buildSelectParam(
  include?: Record<string, boolean>,
): string | undefined {
  if (!include || Object.keys(include).length === 0) return undefined;

  // e.g. include: { user: true } => "*,user:User(*)"
  const joins = Object.entries(include)
    .filter(([, v]) => v)
    .map(([k]) => {
      const table = modelToTable[k] ?? (k.charAt(0).toUpperCase() + k.slice(1));
      return `${k}:${table}(*)`;
    })
    .join(',');
  return `*,${joins}`;
}

/**
 * Generate a CUID-style ID (compatible with Prisma's @default(cuid())).
 *
 * PostgREST does NOT apply Prisma's `@default(cuid())` — when we INSERT via
 * REST, the `id` column comes through as NULL and Postgres rejects it with a
 * not-null violation.  So we generate the ID client-side for any create/upsert
 * that doesn't explicitly pass one.
 */
function generateCuid(): string {
  // Based on the classic cuid() algorithm: timestamp + counter + random
  const c = 'abcdefghijklmnopqrstuvwxyz';
  const base = 36;
  const now = Date.now();
  const counter = (generateCuid as any).__c__ ?? ((generateCuid as any).__c__ = 0);
  (generateCuid as any).__c__ = counter + 1;
  const stamp = now.toString(base);
  const rand =
    c[Math.floor(Math.random() * c.length)] +
    Math.floor(Math.random() * base * base).toString(base) +
    Math.floor(Math.random() * base * base).toString(base);
  return `c${stamp}${counter.toString(base)}${rand}`;
}

/** Ensure a payload bound for INSERT has a primary-key `id` if it doesn't
 *  already specify one.  All 15 models use `String @id @default(cuid())`, so
 *  every table needs this. */
function withDefaultId(data: Record<string, unknown>): Record<string, unknown> {
  if (data && data.id === undefined) {
    return { ...data, id: generateCuid() };
  }
  return data;
}

/**
 * Which models have a Prisma-managed `createdAt` / `updatedAt` column.
 *
 * The Supabase tables were created from the Prisma migration.  There:
 *   - `createdAt`  → `TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
 *     (the DB fills it, so we don't strictly need to send it, but we do
 *      anyway for determinism / to match Prisma behaviour)
 *   - `updatedAt`  → `TIMESTAMP NOT NULL` with **NO default**
 *     (Prisma's `@updatedAt` was supposed to fill it, but PostgREST does
 *      not honour that annotation, so an INSERT without an explicit value
 *      fails with Postgres 23502 "null value in column updatedAt").  We
 *      must inject `updatedAt: now()` client-side for every INSERT.
 *
 * Exceptions (no updatedAt column at all):
 *   - SiteSetting     — just (id, key, value)
 *   - ContactMessage  — has createdAt only
 *   - Session         — has createdAt only
 */
const MODELS_WITH_CREATED_AT = new Set([
  'product', 'service', 'client', 'testimonial', 'blog', 'contactMessage',
  'project', 'teamMember', 'sector', 'milestone', 'branch', 'career', 'user',
  'session', 'projectRecord',
]);
const MODELS_WITH_UPDATED_AT = new Set([
  'product', 'service', 'client', 'testimonial', 'blog', 'project',
  'teamMember', 'sector', 'milestone', 'branch', 'career', 'user',
  'projectRecord',
]);

/** Prepare a payload for INSERT — inject `id`, `createdAt`, `updatedAt`
 *  defaults exactly like Prisma would on a `create()`.
 *
 *  - `id`         → CUID if not provided (every model has @default(cuid()))
 *  - `createdAt`  → now() if the model has the column and caller didn't set it
 *  - `updatedAt`  → now() if the model has the column and caller didn't set it
 *
 *  Without this, INSERTs into tables with a NOT NULL `updatedAt` (i.e. every
 *  table except SiteSetting / ContactMessage / Session) fail with Postgres
 *  error 23502 — which is why the admin panel's "Add" button returned HTTP 500
 *  for every section.
 */
function withInsertDefaults(
  data: Record<string, unknown>,
  model: string,
): Record<string, unknown> {
  const out = withDefaultId(data);
  const now = new Date().toISOString();
  if (MODELS_WITH_CREATED_AT.has(model) && out.createdAt === undefined) {
    out.createdAt = now;
  }
  if (MODELS_WITH_UPDATED_AT.has(model) && out.updatedAt === undefined) {
    out.updatedAt = now;
  }
  return out;
}

/** Strip read-only / auto-managed columns from a PATCH payload.
 *
 *  PostgREST will reject PATCHes that try to write `createdAt` (or even `id`
 *  on some tables) and Prisma's `@updatedAt` is not honoured by PostgREST,
 *  so we:
 *    - remove `id`, `createdAt`, `updatedAt` from the payload
 *    - inject a fresh `updatedAt: now()` so the column actually updates
 *
 *  This mirrors Prisma's behaviour where these fields are managed by the ORM
 *  and cannot be overwritten by the caller.
 *
 *  `model` is the camelCase model key (e.g. 'siteSetting') used to look up
 *  whether the table actually has an `updatedAt` column — SiteSetting,
 *  ContactMessage and Session do NOT, so we must not send one.
 */
function sanitizeUpdatePayload(
  data: Record<string, unknown>,
  model: string,
): Record<string, unknown> {
  const { id: _id, createdAt: _ca, updatedAt: _ua, ...rest } = data;
  if (MODELS_WITH_UPDATED_AT.has(model)) {
    return { ...rest, updatedAt: new Date().toISOString() };
  }
  return rest;
}

// ---------------------------------------------------------------------------
// Model delegate — implements the Prisma-compatible interface for one table
// ---------------------------------------------------------------------------

interface FindManyArgs {
  where?: Record<string, unknown>;
  orderBy?: Record<string, string>;
  take?: number;
  skip?: number;
  include?: Record<string, boolean>;
}

interface FindUniqueArgs {
  where: Record<string, unknown>;
  include?: Record<string, boolean>;
}

interface FindFirstArgs {
  where?: Record<string, unknown>;
  orderBy?: Record<string, string>;
  include?: Record<string, boolean>;
}

interface CreateArgs {
  data: Record<string, unknown>;
}

interface UpdateArgs {
  where: Record<string, unknown>;
  data: Record<string, unknown>;
}

interface DeleteArgs {
  where: Record<string, unknown>;
}

interface DeleteManyArgs {
  where?: Record<string, unknown>;
}

interface CountArgs {
  where?: Record<string, unknown>;
}

interface UpsertArgs {
  where: Record<string, unknown>;
  update: Record<string, unknown>;
  create: Record<string, unknown>;
}

class ModelDelegate {
  constructor(private table: string, private model: string) {}

  // ---- findMany ----
  async findMany(args?: FindManyArgs): Promise<any[]> {
    const params = buildWhereParams(args?.where);
    applyOrderBy(params, args?.orderBy);
    if (args?.take !== undefined) params.set('limit', String(args.take));
    if (args?.skip !== undefined) params.set('offset', String(args.skip));

    const select = buildSelectParam(args?.include);
    if (select) params.set('select', select);

    const url = `${baseUrl(this.table)}?${params.toString()}`;
    const res = await fetch(url, { headers: authHeaders() });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase REST findMany error on ${this.table}: ${res.status} ${text}`);
    }

    return res.json();
  }

  // ---- findUnique ----
  async findUnique(args: FindUniqueArgs): Promise<any | null> {
    const params = buildWhereParams(args.where);
    params.set('limit', '1');

    const select = buildSelectParam(args.include);
    if (select) params.set('select', select);

    const url = `${baseUrl(this.table)}?${params.toString()}`;
    const res = await fetch(url, { headers: authHeaders() });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase REST findUnique error on ${this.table}: ${res.status} ${text}`);
    }

    const rows = await res.json();
    return rows.length > 0 ? rows[0] : null;
  }

  // ---- findFirst ----
  async findFirst(args?: FindFirstArgs): Promise<any | null> {
    const params = buildWhereParams(args?.where);
    applyOrderBy(params, args?.orderBy);
    params.set('limit', '1');

    const select = buildSelectParam(args?.include);
    if (select) params.set('select', select);

    const url = `${baseUrl(this.table)}?${params.toString()}`;
    const res = await fetch(url, { headers: authHeaders() });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase REST findFirst error on ${this.table}: ${res.status} ${text}`);
    }

    const rows = await res.json();
    return rows.length > 0 ? rows[0] : null;
  }

  // ---- create ----
  async create(args: CreateArgs): Promise<any> {
    const url = baseUrl(this.table);
    const res = await fetch(url, {
      method: 'POST',
      headers: authHeaders('return=representation'),
      body: JSON.stringify(withInsertDefaults(args.data, this.model)),
    });

    if (!res.ok) {
      const text = await res.text();
      // Emulate Prisma unique-violation error code P2002
      if (res.status === 409 || text.includes('duplicate key') || text.includes('unique')) {
        const err = new Error(`Unique constraint failed on ${this.table}: ${text}`);
        (err as any).code = 'P2002';
        throw err;
      }
      throw new Error(`Supabase REST create error on ${this.table}: ${res.status} ${text}`);
    }

    const rows = await res.json();
    // PostgREST with return=representation returns an array
    return Array.isArray(rows) ? rows[0] : rows;
  }

  // ---- update ----
  async update(args: UpdateArgs): Promise<any> {
    const params = buildWhereParams(args.where);

    const url = `${baseUrl(this.table)}?${params.toString()}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: authHeaders('return=representation'),
      body: JSON.stringify(sanitizeUpdatePayload(args.data, this.model)),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 409 || text.includes('duplicate key') || text.includes('unique')) {
        const err = new Error(`Unique constraint failed on ${this.table}: ${text}`);
        (err as any).code = 'P2002';
        throw err;
      }
      throw new Error(`Supabase REST update error on ${this.table}: ${res.status} ${text}`);
    }

    const rows = await res.json();
    if (Array.isArray(rows) && rows.length === 0) {
      throw new Error(`Record not found in ${this.table} for update`);
    }
    return Array.isArray(rows) ? rows[0] : rows;
  }

  // ---- delete ----
  async delete(args: DeleteArgs): Promise<any> {
    const params = buildWhereParams(args.where);

    const url = `${baseUrl(this.table)}?${params.toString()}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: authHeaders('return=representation'),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase REST delete error on ${this.table}: ${res.status} ${text}`);
    }

    const rows = await res.json();
    if (Array.isArray(rows) && rows.length === 0) {
      throw new Error(`Record not found in ${this.table} for delete`);
    }
    return Array.isArray(rows) ? rows[0] : rows;
  }

  // ---- deleteMany ----
  async deleteMany(args?: DeleteManyArgs): Promise<{ count: number }> {
    const params = buildWhereParams(args?.where);

    const url = `${baseUrl(this.table)}?${params.toString()}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: authHeaders('return=representation'),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase REST deleteMany error on ${this.table}: ${res.status} ${text}`);
    }

    const rows = await res.json();
    const count = Array.isArray(rows) ? rows.length : 0;
    return { count };
  }

  // ---- count ----
  async count(args?: CountArgs): Promise<number> {
    const params = buildWhereParams(args?.where);
    params.set('select', 'id');

    const url = `${baseUrl(this.table)}?${params.toString()}`;
    const res = await fetch(url, {
      headers: { ...authHeaders(), Prefer: 'count=exact' },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase REST count error on ${this.table}: ${res.status} ${text}`);
    }

    // Try to get count from Content-Range header first
    const contentRange = res.headers.get('content-range');
    if (contentRange) {
      // Format: "0-4/5" or "*/5"
      const parts = contentRange.split('/');
      if (parts.length === 2) {
        const total = parseInt(parts[1], 10);
        if (!isNaN(total)) return total;
      }
    }

    // Fallback: count from response body
    const rows = await res.json();
    return Array.isArray(rows) ? rows.length : 0;
  }

  // ---- upsert ----
  async upsert(args: UpsertArgs): Promise<any> {
    // First, try to update
    const updateParams = buildWhereParams(args.where);
    const updateUrl = `${baseUrl(this.table)}?${updateParams.toString()}`;

    const updateRes = await fetch(updateUrl, {
      method: 'PATCH',
      headers: authHeaders('return=representation'),
      body: JSON.stringify(sanitizeUpdatePayload(args.update, this.model)),
    });

    if (!updateRes.ok) {
      const text = await updateRes.text();
      throw new Error(`Supabase REST upsert(update) error on ${this.table}: ${updateRes.status} ${text}`);
    }

    const updatedRows = await updateRes.json();
    if (Array.isArray(updatedRows) && updatedRows.length > 0) {
      return updatedRows[0];
    }

    // No rows updated → insert
    const insertData = withInsertDefaults({ ...args.create, ...args.where, ...args.update }, this.model);
    const insertUrl = baseUrl(this.table);
    const insertRes = await fetch(insertUrl, {
      method: 'POST',
      headers: authHeaders('return=representation'),
      body: JSON.stringify(insertData),
    });

    if (!insertRes.ok) {
      const text = await insertRes.text();
      // Might be a race-condition duplicate — try one more read
      if (insertRes.status === 409 || text.includes('duplicate key') || text.includes('unique')) {
        const readRes = await fetch(`${baseUrl(this.table)}?${updateParams.toString()}`, {
          headers: authHeaders(),
        });
        if (readRes.ok) {
          const rows = await readRes.json();
          if (Array.isArray(rows) && rows.length > 0) return rows[0];
        }
      }
      throw new Error(`Supabase REST upsert(insert) error on ${this.table}: ${insertRes.status} ${text}`);
    }

    const insertedRows = await insertRes.json();
    return Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;
  }
}

// ---------------------------------------------------------------------------
// Build the `db` object — one ModelDelegate per Prisma model
// ---------------------------------------------------------------------------

const models = [
  'product',
  'service',
  'client',
  'testimonial',
  'blog',
  'project',
  'siteSetting',
  'teamMember',
  'sector',
  'milestone',
  'branch',
  'career',
  'user',
  'session',
  'contactMessage',
  'projectRecord',
] as const;

type ModelName = (typeof models)[number];

type DB = Record<ModelName, ModelDelegate>;

function buildDB(): DB {
  const obj: Partial<DB> = {};
  for (const model of models) {
    const table = modelToTable[model] ?? model;
    obj[model] = new ModelDelegate(table, model);
  }
  return obj as DB;
}

export const db: DB = buildDB();
