"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import ArtistCard from "@/components/ArtistCard";
import AlbumCard from "@/components/AlbumCard";
import { MusicBrainzArtist, MusicBrainzRelease } from "@/lib/types";

async function fetchArtistImages(
  artists: { id: string; name: string }[]
): Promise<Record<string, string>> {
  if (artists.length === 0) return {};
  try {
    const res = await fetch("/api/artist-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artists }),
    });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export default function Home() {
  const [artists, setArtists] = useState<MusicBrainzArtist[]>([]);
  const [releases, setReleases] = useState<MusicBrainzRelease[]>([]);
  const [searchType, setSearchType] = useState<"artist" | "release">("artist");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [artistImages, setArtistImages] = useState<Record<string, string>>({});

  const handleSearch = async (query: string, type: "artist" | "release") => {
    setLoading(true);
    setSearchType(type);
    setHasSearched(true);
    setArtistImages({});

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=${type}`
      );
      const data = await res.json();

      if (type === "artist") {
        const artistList: MusicBrainzArtist[] = data.artists || [];
        setArtists(artistList);
        setReleases([]);

        // Fetch artist images in background via Spotify
        const artistInfo = artistList.map((a) => ({ id: a.id, name: a.name }));
        fetchArtistImages(artistInfo).then(setArtistImages);
      } else {
        setReleases(data.releases || []);
        setArtists([]);
      }
    } catch {
      setArtists([]);
      setReleases([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero section */}
        <div className="border-b border-stone-200 bg-gradient-to-b from-amber-50 to-[#faf7f2] px-4 py-16 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Discover New <span className="text-amber-600">Music</span>
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-lg text-stone-500">
            Search for artists and albums, explore discographies, and build your
            personal listening list.
          </p>
          <div className="mx-auto max-w-2xl">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>
        </div>

        {/* Results */}
        <div className="mx-auto max-w-6xl px-4 py-8">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            </div>
          )}

          {!loading && hasSearched && searchType === "artist" && artists.length === 0 && (
            <p className="py-12 text-center text-stone-400">
              No artists found. Try a different search.
            </p>
          )}

          {!loading && hasSearched && searchType === "release" && releases.length === 0 && (
            <p className="py-12 text-center text-stone-400">
              No albums found. Try a different search.
            </p>
          )}

          {!loading && artists.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-stone-800">
                Artists
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {artists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    imageUrl={artistImages[artist.id]}
                  />
                ))}
              </div>
            </div>
          )}

          {!loading && releases.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-stone-800">
                Albums
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {releases.map((release) => (
                  <AlbumCard
                    key={release.id}
                    id={release["release-group"]?.id || release.id}
                    title={release.title}
                    artist={
                      release["artist-credit"]?.[0]?.name || "Unknown Artist"
                    }
                    date={release.date}
                    type={release["release-group"]?.["primary-type"]}
                  />
                ))}
              </div>
            </div>
          )}

          {!hasSearched && (
            <div className="py-16 text-center">
              <p className="text-lg text-stone-400">
                Search for your favorite artists or albums to get started.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
