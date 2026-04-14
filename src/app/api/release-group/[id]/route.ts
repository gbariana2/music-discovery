import { NextRequest, NextResponse } from "next/server";

const MUSICBRAINZ_BASE = "https://musicbrainz.org/ws/2";
const USER_AGENT = "MusicMadness/1.0 (gbariana@uchicago.edu)";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Fetch releases for this release-group, including media (discs) and recordings (tracks)
  const url = `${MUSICBRAINZ_BASE}/release?release-group=${id}&inc=recordings+media+artist-credits&fmt=json&limit=100`;

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
  const releases = data.releases || [];

  if (releases.length === 0) {
    return NextResponse.json({ tracks: [], title: "", artist: "" });
  }

  // Pick the best release: prefer the one with the most tracks (fullest edition)
  // and with a country (official release)
  const best = releases.reduce(
    (
      pick: (typeof releases)[0],
      r: (typeof releases)[0]
    ) => {
      const pickTracks = (pick.media || []).reduce(
        (sum: number, m: { "track-count": number }) => sum + (m["track-count"] || 0),
        0
      );
      const rTracks = (r.media || []).reduce(
        (sum: number, m: { "track-count": number }) => sum + (m["track-count"] || 0),
        0
      );
      if (rTracks > pickTracks) return r;
      return pick;
    },
    releases[0]
  );

  // Extract tracks in order across all media (disc 1, disc 2, etc.)
  const tracks: {
    id: string;
    number: string;
    title: string;
    length: number | null;
    position: number;
  }[] = [];

  const sortedMedia = (best.media || []).sort(
    (a: { position: number }, b: { position: number }) => a.position - b.position
  );

  for (const medium of sortedMedia) {
    for (const track of medium.tracks || []) {
      tracks.push({
        id: track.recording?.id || track.id,
        number: track.number,
        title: track.recording?.title || track.title,
        length: track.recording?.length || track.length || null,
        position: tracks.length + 1,
      });
    }
  }

  const artist =
    best["artist-credit"]?.[0]?.name ||
    best["artist-credit"]?.[0]?.artist?.name ||
    "";

  return NextResponse.json({
    title: best.title || "",
    artist,
    date: best.date || "",
    tracks,
  });
}
