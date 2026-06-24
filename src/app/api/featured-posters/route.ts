import { NextResponse } from "next/server";

import { getFeaturedPostersForWeek } from "@/lib/posterDatabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  try {
    return NextResponse.json(getFeaturedPostersForWeek());
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not load featured posters.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
