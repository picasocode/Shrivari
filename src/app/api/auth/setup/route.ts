import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    // Check if any admin user already exists
    const existingAdmin = await db.user.findFirst({ where: { role: "admin" } });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin user already exists. Use login instead." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, { status: 201 });
  } catch (error) {
    console.error("Error setting up admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}

// GET: Check if setup is needed
export async function GET() {
  try {
    const adminCount = await db.user.count({ where: { role: "admin" } });
    return NextResponse.json({ needsSetup: adminCount === 0 });
  } catch (error) {
    console.error("Error checking setup:", error);
    return NextResponse.json(
      { error: "Failed to check setup status" },
      { status: 500 }
    );
  }
}
