"use client";

import { useEffect, useState, use } from "react";
import Navbar from "@/components/Navbar";
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

function AlbumTile({
  rg,
  artist,
}: {
  rg: ReleaseGroup;
  artist: string;
}) {
  const [imgError, setImgError] = useState(false);
  const coverUrl = `https://coverartarchive.org/release-group/${rg.id}/front-250`;

  return (
    <Link
      href={`/album/${rg.id}`}
      className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:border-amber-400 hover:shadow-md"
    >
      <div className="aspect-square w-full bg-stone-100">
        {imgError ? (
          <div className="flex h-full w-full items-center justify-center text-amber-400/40">
            <svg width="48" height="48" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="48" />
              <circle cx="50" cy="50" r="44" fill="#faf7f2" />
              <circle cx="50" cy="50" r="38" fill="currentColor" opacity="0.15" />
              <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.15" />
              <circle cx="50" cy="50" r="14" fill="#faf7f2" />
              <circle cx="50" cy="50" r="6" fill="currentColor" />
            </svg>
          </div>
        ) : (
          <img
            src={coverUrl}
            alt={`${rg.title} by ${artist}`}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="p-3">
        <h4 className="truncate font-semibold text-stone-900 group-hover:text-amber-700">
          {rg.title}
        </h4>
        {rg["first-release-date"] && (
          <p className="text-xs text-stone-400">
            {rg["first-release-date"].slice(0, 4)}
          </p>
        )}
      </div>
    </Link>
  );
}

function sortByDate(items: ReleaseGroup[]): ReleaseGroup[] {
  return [...items].sort((a, b) => {
    const dateA = a["first-release-date"] || "";
    const dateB = b["first-release-date"] || "";
    return dateB.localeCompare(dateA);
  });
}

export default function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [artistImage, setArtistImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtist() {
      try {
        const res = await fetch(`/api/artist/${id}`);
        const data = await res.json();
        setArtist(data);

        if (data?.name) {
          try {
            const imgRes = await fetch("/api/artist-images", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ artists: [{ id, name: data.name }] }),
            });
            if (imgRes.ok) {
              const images = await imgRes.json();
              if (images[id]) setArtistImage(images[id]);
            }
          } catch {
            // no image available
          }
        }
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
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-stone-500">Artist not found.</p>
          <Link href="/" className="text-amber-600 hover:text-amber-700">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  const releaseGroups = artist["release-groups"] || [];

  // Split into albums (Album, EP) and singles
  const albums = sortByDate(
    releaseGroups.filter((rg) => {
      const t = rg["primary-type"];
      return t === "Album" || t === "EP";
    })
  );
  const singles = sortByDate(
    releaseGroups.filter((rg) => rg["primary-type"] === "Single")
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Artist header */}
        <div className="border-b border-stone-200 bg-gradient-to-b from-amber-50 to-[#faf7f2] px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800"
            >
              ← Back to search
            </Link>
            <div className="flex items-start gap-6">
              {artistImage ? (
                <img
                  src={artistImage}
                  alt={artist.name}
                  className="h-24 w-24 shrink-0 rounded-full object-cover shadow-md"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-400">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                  >
                    <circle cx="50" cy="50" r="48" />
                    <circle cx="50" cy="50" r="44" fill="#faf7f2" />
                    <circle cx="50" cy="50" r="38" fill="currentColor" opacity="0.15" />
                    <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.15" />
                    <circle cx="50" cy="50" r="14" fill="#faf7f2" />
                    <circle cx="50" cy="50" r="6" fill="currentColor" />
                  </svg>
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
                  {artist.name}
                </h1>
                {artist.disambiguation && (
                  <p className="mt-1 text-stone-500">{artist.disambiguation}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-stone-500">
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
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Albums section */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-stone-800">
              Albums{albums.length > 0 && ` (${albums.length})`}
            </h2>
            {albums.length === 0 ? (
              <p className="py-4 text-stone-400">No albums found.</p>
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {albums.map((rg) => (
                  <AlbumTile key={rg.id} rg={rg} artist={artist.name} />
                ))}
              </div>
            )}
          </section>

          {/* Singles section */}
          {singles.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 text-xl font-semibold text-stone-800">
                Singles ({singles.length})
              </h2>
              <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                {singles.map((rg, i) => (
                  <Link
                    key={rg.id}
                    href={`/album/${rg.id}`}
                    className={`flex items-center gap-4 px-4 py-3 transition-colors hover:bg-amber-50/50 ${
                      i !== 0 ? "border-t border-stone-100" : ""
                    }`}
                  >
                    <span className="w-8 text-right text-sm text-stone-400">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-stone-900">
                        {rg.title}
                      </p>
                    </div>
                    {rg["first-release-date"] && (
                      <span className="text-sm text-stone-400 shrink-0">
                        {rg["first-release-date"].slice(0, 4)}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
