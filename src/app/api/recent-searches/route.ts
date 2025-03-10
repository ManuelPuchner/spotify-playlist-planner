import { auth } from "@/auth";
import { addRecentSearch, getRecentSearches } from "@/lib/data/recent-searches";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized", ok: false },
      { status: 401 }
    );
  }

  const recentSearches = await getRecentSearches(session);

  return NextResponse.json({ data: recentSearches, ok: true }, { status: 200 });
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized", ok: false },
      { status: 401 }
    );
  }

  // Parse the request body as JSON
  const { trackId } = await req.json();
  console.log("trackId", trackId);

  if (!trackId) {
    return NextResponse.json(
      { error: "trackId is required", ok: false },
      { status: 400 }
    );
  }

  await addRecentSearch(trackId, session);

  return NextResponse.json({ ok: true }, { status: 200 });
}
