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
 */
function buildSelectParam(
  include?: Record<string, boolean>,
): string | undefined {
  if (!include || Object.keys(include).length === 0) return undefined;

  // e.g. include: { user: true } => "*,user:*"
  const joins = Object.entries(include)
    .filter(([, v]) => v)
    .map(([k]) => `${k}:*`)
    .join(',');
  return `*,${joins}`;
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
  constructor(private table: string) {}

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
      body: JSON.stringify(args.data),
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
      body: JSON.stringify(args.data),
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
      body: JSON.stringify(args.update),
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
    const insertData = { ...args.create, ...args.where, ...args.update };
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
    obj[model] = new ModelDelegate(table);
  }
  return obj as DB;
}

export const db: DB = buildDB();
