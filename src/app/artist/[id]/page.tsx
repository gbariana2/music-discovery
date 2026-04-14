"use client";

import { useEffect, useState, use } from "react";
import Navbar from "@/components/Navbar";
import AlbumCard from "@/components/AlbumCard";
import Link from "next/link";

interface ReleaseGroup {
  id: string;
  title: string;
  "primary-type"?: string;
  "first-release-date"?: string;
}

interface ArtistDetail {
  id: string;
  name: string;
  country?: string;
  "life-span"?: {
    begin?: string;
    end?: string;
    ended?: boolean;
  };
  "release-groups"?: ReleaseGroup[];
  disambiguation?: string;
}

export default function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchArtist() {
      try {
        const res = await fetch(`/api/artist/${id}`);
        const data = await res.json();
        setArtist(data);
      } catch {
        setArtist(null);
      } finally {
        setLoading(false);
      }
    }
    fetchArtist();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-zinc-400">Artist not found.</p>
          <Link href="/" className="text-violet-400 hover:text-violet-300">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  const releaseGroups = artist["release-groups"] || [];
  const types = [...new Set(releaseGroups.map((rg) => rg["primary-type"]).filter(Boolean))];

  const filtered =
    filter === "all"
      ? releaseGroups
      : releaseGroups.filter((rg) => rg["primary-type"] === filter);

  const sorted = filtered.sort((a, b) => {
    const dateA = a["first-release-date"] || "";
    const dateB = b["first-release-date"] || "";
    return dateB.localeCompare(dateA);
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Artist header */}
        <div className="border-b border-zinc-800 bg-gradient-to-b from-violet-950/20 to-zinc-950 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200"
            >
              ← Back to search
            </Link>
            <div className="flex items-start gap-6">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-4xl text-violet-400">
                ♪
              </div>
              <div>
                <h1 className="text-3xl font-bold sm:text-4xl">{artist.name}</h1>
                {artist.disambiguation && (
                  <p className="mt-1 text-zinc-400">{artist.disambiguation}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-zinc-400">
                  {artist.country && <span>Country: {artist.country}</span>}
                  {artist["life-span"]?.begin && (
                    <span>
                      Active: {artist["life-span"].begin}
                      {artist["life-span"]?.ended
                        ? ` – ${artist["life-span"].end}`
                        : " – present"}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-zinc-500">
                  {releaseGroups.length} release{releaseGroups.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Releases */}
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Discography</h2>
            {types.length > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`rounded-full px-3 py-1 text-sm transition-colors ${
                    filter === "all"
                      ? "bg-violet-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  All
                </button>
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t!)}
                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                      filter === t
                        ? "bg-violet-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {sorted.length === 0 ? (
            <p className="py-8 text-center text-zinc-500">No releases found.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((rg) => (
                <AlbumCard
                  key={rg.id}
                  id={rg.id}
                  title={rg.title}
                  artist={artist.name}
                  date={rg["first-release-date"]}
                  type={rg["primary-type"]}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
