import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";

    const where = publishedOnly ? { published: true } : {};

    const blogs = await db.blog.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, coverImageUrl, author, published } =
      body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const blog = await db.blog.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content: content || "",
        coverImageUrl: coverImageUrl || "",
        author: author || "Shri Vaari",
        published: published || false,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating blog:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A blog with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
