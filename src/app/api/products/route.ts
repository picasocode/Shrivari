import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
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

    return NextResponse.json(products);
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
