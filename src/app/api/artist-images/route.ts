import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { artists } = await request.json();

    if (!Array.isArray(artists) || artists.length === 0) {
      return NextResponse.json({});
    }

    // Fetch images for all artists in parallel via Deezer (free, no API key)
    const limited = artists.slice(0, 20);
    const results = await Promise.all(
      limited.map(async (artist: { id: string; name: string }) => {
        try {
          const res = await fetch(
            `https://api.deezer.com/search/artist?q=${encodeURIComponent(artist.name)}&limit=1`
          );
          if (!res.ok) return null;

          const data = await res.json();
          const match = data.data?.[0];
          // picture_xl is 1000x1000, picture_big is 500x500
          const image = match?.picture_xl || match?.picture_big;
          if (image) {
            return { id: artist.id, url: image };
          }
          return null;
        } catch {
          return null;
        }
      })
    );

    const images: Record<string, string> = {};
    for (const result of results) {
      if (result) {
        images[result.id] = result.url;
      }
    }

    return NextResponse.json(images);
  } catch {
    return NextResponse.json({});
  }
}
