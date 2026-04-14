import { NextRequest, NextResponse } from "next/server";

const MUSICBRAINZ_BASE = "https://musicbrainz.org/ws/2";
const USER_AGENT = "MusicMadness/1.0 (gbariana@uchicago.edu)";

// Pattern to match featured artist naming: "Artist feat. Other", "Artist ft. Other", etc.
const FEAT_PATTERN = /\b(feat\.?|ft\.?|featuring)\b/i;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const type = searchParams.get("type") || "artist";
  const limit = searchParams.get("limit") || "20";
  const offset = searchParams.get("offset") || "0";

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  const url = `${MUSICBRAINZ_BASE}/${type}/?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&fmt=json`;

  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from MusicBrainz" },
      { status: response.status }
    );
  }

  const data = await response.json();

  // Filter out "feat." / "ft." artists from artist search results
  if (type === "artist" && Array.isArray(data.artists)) {
    data.artists = data.artists.filter(
      (artist: { name: string }) => !FEAT_PATTERN.test(artist.name)
    );
  }

  return NextResponse.json(data);
}
