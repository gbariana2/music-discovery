import { NextRequest, NextResponse } from "next/server";

const MUSICBRAINZ_BASE = "https://musicbrainz.org/ws/2";
const USER_AGENT = "MusicMadness/1.0 (gbariana@uchicago.edu)";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const url = `${MUSICBRAINZ_BASE}/artist/${id}?inc=release-groups&fmt=json`;

  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch artist from MusicBrainz" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
