import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_PRODUCTS,
  LEGACY_PLACEHOLDER_IMAGE,
  resolveProductImage,
} from "@/lib/product-defaults";

// ───────────────────────────────────────────────────────────────────────────
// One-time-per-process bootstrap
//
// Keeps the live catalog complete without any manual migration step:
//   1. Canonical products missing from the database (e.g. the Busducts range
//      on databases created before it existed) are CREATED once.
//   2. Products still carrying the legacy placeholder image URL from the old
//      site get the bundled photo for their slug.
//
// Admin content is never overwritten: rows are only created when the slug is
// absent, and image URLs are only touched when they still equal the exact
// legacy placeholder URL.
// ───────────────────────────────────────────────────────────────────────────
let ensurePromise: Promise<void> | null = null;

function ensureProductDefaults(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      const existing = await db.product.findMany({
        select: { id: true, slug: true, imageUrl: true },
      });
      const bySlug = new Set(existing.map(p => p.slug));

      const missing = DEFAULT_PRODUCTS.filter(p => !bySlug.has(p.slug));
      for (const p of missing) {
        try {
          await db.product.create({
            data: {
              name: p.name,
              slug: p.slug,
              category: p.category,
              description: p.description,
              features: p.features,
              imageUrl: p.imageUrl,
              order: p.order,
            },
          });
        } catch (err) {
          // Another instance may have created the same slug concurrently —
          // ignore unique-violation, rethrow anything else.
          if (
            err &&
            typeof err === "object" &&
            "code" in err &&
            (err as { code?: string }).code === "P2002"
          ) {
            continue;
          }
          throw err;
        }
      }

      const stale = existing.filter(p => p.imageUrl === LEGACY_PLACEHOLDER_IMAGE);
      for (const p of stale) {
        const match = DEFAULT_PRODUCTS.find(d => d.slug === p.slug);
        if (match?.imageUrl) {
          await db.product.update({
            where: { id: p.id },
            data: { imageUrl: match.imageUrl },
          });
        }
      }
    })().catch(err => {
      console.error("ensureProductDefaults failed (will retry on next request):", err);
      ensurePromise = null;
      throw err;
    });
  }
  return ensurePromise;
}

export async function GET(request: NextRequest) {
  try {
    // Best-effort bootstrap — catalog is served even if it fails.
    await ensureProductDefaults().catch(() => null);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const activeOnly = searchParams.get("active") === "true";
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (activeOnly) where.active = true;

    const products = await db.product.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(products.map(resolveProductImage));
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, category, description, features, imageUrl, order } =
      body;

    if (!name || !slug || !category || !description) {
      return NextResponse.json(
        { error: "Name, slug, category, and description are required" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        category,
        description,
        features: features || "[]",
        imageUrl: imageUrl || "",
        order: order || 0,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
