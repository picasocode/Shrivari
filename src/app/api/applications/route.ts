import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureJobApplicationsTable } from "@/lib/applications";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public list for the admin Applications section (newest first).
export async function GET() {
  try {
    await ensureJobApplicationsTable().catch(() => null);
    const applications = await db.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch job applications" },
      { status: 500 }
    );
  }
}

// Public submit endpoint — powers the Careers page "Apply Now" form.
export async function POST(request: NextRequest) {
  try {
    await ensureJobApplicationsTable();

    const body = await request.json();
    const { jobTitle, name, email, phone, experience, resumeUrl, message } = body;

    if (!jobTitle || !name || !email || !message) {
      return NextResponse.json(
        { error: "Position, name, email and message are required" },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(String(email))) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }
    if (resumeUrl && !/^https?:\/\//i.test(String(resumeUrl))) {
      return NextResponse.json(
        { error: "Resume link must start with http:// or https://" },
        { status: 400 }
      );
    }

    const application = await db.jobApplication.create({
      data: {
        jobTitle: String(jobTitle).slice(0, 250),
        name: String(name).slice(0, 180),
        email: String(email).slice(0, 180),
        phone: String(phone || "").slice(0, 180),
        experience: String(experience || "").slice(0, 180),
        resumeUrl: String(resumeUrl || "").slice(0, 1000),
        message: String(message),
        status: "new",
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating job application:", error);
    return NextResponse.json(
      { error: "Failed to submit application — please try again" },
      { status: 500 }
    );
  }
}
