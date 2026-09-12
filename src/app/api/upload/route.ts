import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureMediaTable } from "@/lib/media";

// Node runtime — needs fs + Buffer.
export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

function safeName(name: string): string {
  const cleaned = name
    .replace(/[^\w.\- ]+/g, "_")
    .replace(/\s+/g, " ")
    .trim();
  return (cleaned || "image").slice(0, 180);
}

// Best-effort mirror of every upload into the repo-root upload/ folder, so
// the server always keeps a plain-file copy of everything that was uploaded.
// The DATABASE remains the source of truth (/api/images/[id] serves from it)
// — if the filesystem is read-only or the folder is missing, the upload
// still succeeds and the image still renders everywhere.
async function mirrorToUploadFolder(id: string, filename: string, data: Buffer) {
  try {
    const dir = path.join(process.cwd(), "upload");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${id}-${filename}`), data);
  } catch (err) {
    console.warn(
      "upload/ mirror skipped:",
      err instanceof Error ? err.message : err
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureMediaTable();

    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP, GIF, AVIF or SVG images are allowed" },
        { status: 415 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be 5MB or smaller" },
        { status: 413 }
      );
    }

    const data = Buffer.from(await file.arrayBuffer());
    const media = await db.media.create({
      data: {
        filename: safeName(file.name || "image"),
        mimeType: file.type,
        size: data.length,
        data,
      },
    });

    await mirrorToUploadFolder(media.id, media.filename, data);

    return NextResponse.json(
      {
        url: `/api/images/${media.id}`,
        id: media.id,
        filename: media.filename,
        mimeType: media.mimeType,
        size: media.size,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Upload failed — please try again" },
      { status: 500 }
    );
  }
}
