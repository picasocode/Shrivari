import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureJobApplicationsTable } from "@/lib/applications";

const STATUSES = ["new", "reviewed", "shortlisted", "rejected", "hired"];

// Update an application (currently: status).
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureJobApplicationsTable().catch(() => null);
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const application = await db.jobApplication.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating job application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

// Remove an application.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureJobApplicationsTable().catch(() => null);
    const { id } = await params;
    await db.jobApplication.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting job application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
