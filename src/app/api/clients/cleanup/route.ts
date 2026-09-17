import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { CLIENT_GALLERY, CATEGORY_LABELS } from "@/lib/client-gallery";

/* ─── One-time client-records cleanup ───
   Renames every client record to the neutral placeholder ("Client 1",
   "Client 2", …), points its logo at the local gallery image and clears
   any company-identifying text, so no real client names are stored or
   shown in the admin panel.

   Protected by a shared key so it cannot be triggered casually.
   Idempotent — safe to run multiple times. */

const ACCESS_KEY = "SVEPL-CLEANUP-2026";

export async function GET(request: NextRequest) {
  try {
    const key = new URL(request.url).searchParams.get("key");
    if (key !== ACCESS_KEY) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const clients = await db.client.findMany({ orderBy: { order: "asc" } });
    let renamed = 0;

    for (const client of clients) {
      const n = client.order;
      const gallery = CLIENT_GALLERY[n - 1];
      const target = {
        name: `Client ${n}`,
        industry: gallery ? CATEGORY_LABELS[gallery.category] || "" : "",
        location: "",
        description: "",
        logoUrl: `/images/clients-site/${n}.jpg`,
      };
      if (
        client.name !== target.name ||
        client.logoUrl !== target.logoUrl ||
        client.description !== "" ||
        client.location !== "" ||
        client.industry !== target.industry
      ) {
        await db.client.update({ where: { id: client.id }, data: target });
        renamed++;
      }
    }

    const remaining = await db.client.count();
    const stillNamed = await db.client.count({
      where: { NOT: { name: { startsWith: "Client " } } },
    });

    return NextResponse.json({
      ok: true,
      total: remaining,
      renamed,
      stillNamedRealNames: stillNamed,
    });
  } catch (error) {
    console.error("Client cleanup failed:", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
