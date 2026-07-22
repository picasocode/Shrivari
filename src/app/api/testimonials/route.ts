import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const where = activeOnly ? { active: true } : {};

    const testimonials = await db.testimonial.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, designation, content, rating, videoUrl, imageUrl, order } =
      body;

    if (!name || !company || !content) {
      return NextResponse.json(
        { error: "Name, company, and content are required" },
        { status: 400 }
      );
    }

    const testimonial = await db.testimonial.create({
      data: {
        name,
        company,
        designation: designation || "",
        content,
        rating: rating || 5,
        videoUrl: videoUrl || "",
        imageUrl: imageUrl || "",
        order: order || 0,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
