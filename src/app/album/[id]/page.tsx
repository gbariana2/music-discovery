"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface Track {
  id: string;
  number: string;
  title: string;
  length: number | null;
  position: number;
}

interface AlbumData {
  title: string;
  artist: string;
  date: string;
  tracks: Track[];
}

function formatDuration(ms: number | null): string {
  if (!ms) return "";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isSignedIn } = useAuth();
  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [savedTracks, setSavedTracks] = useState<Set<string>>(new Set());
  const [savingTracks, setSavingTracks] = useState<Set<string>>(new Set());

  const coverUrl = `https://coverartarchive.org/release-group/${id}/front-500`;

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const res = await fetch(`/api/release-group/${id}`);
        const data = await res.json();
        setAlbum(data);
      } catch {
        setAlbum(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAlbum();
  }, [id]);

  const handleSaveTrack = async (track: Track) => {
    if (!isSignedIn || !album) return;

    setSavingTracks((prev) => new Set(prev).add(track.id));

    try {
      const res = await fetch("/api/listening-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          musicbrainz_id: track.id,
          title: track.title,
          artist: album.artist,
          release_date: album.date || null,
          cover_art_url: `https://coverartarchive.org/release-group/${id}/front-250`,
        }),
      });

      if (res.ok || res.status === 409) {
        setSavedTracks((prev) => new Set(prev).add(track.id));
      }
    } catch {
      // silent fail
    } finally {
      setSavingTracks((prev) => {
        const next = new Set(prev);
        next.delete(track.id);
        return next;
      });
    }
  };

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

  if (!album || album.tracks.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-stone-500">Album not found or has no tracks.</p>
          <Link href="/" className="text-amber-600 hover:text-amber-700">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Album header */}
        <div className="border-b border-stone-200 bg-gradient-to-b from-amber-50 to-[#faf7f2] px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <button
              onClick={() => window.history.back()}
              className="mb-4 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800"
            >
              ← Back
            </button>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="h-48 w-48 shrink-0 overflow-hidden rounded-xl shadow-lg">
                {imgError ? (
                  <div className="flex h-full w-full items-center justify-center bg-stone-100 text-amber-400/40">
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
                ) : (
                  <img
                    src={coverUrl}
                    alt={`${album.title} by ${album.artist}`}
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                  />
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-stone-900">
                  {album.title}
                </h1>
                <p className="mt-1 text-lg text-stone-500">{album.artist}</p>
                {album.date && (
                  <p className="mt-1 text-sm text-stone-400">
                    {album.date.slice(0, 4)}
                  </p>
                )}
                <p className="mt-2 text-sm text-stone-400">
                  {album.tracks.length} track
                  {album.tracks.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tracklist */}
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
            {album.tracks.map((track, i) => (
              <div
                key={track.id}
                className={`flex items-center gap-4 px-4 py-3 ${
                  i !== 0 ? "border-t border-stone-100" : ""
                } hover:bg-amber-50/50 transition-colors`}
              >
                <span className="w-8 text-right text-sm text-stone-400">
                  {track.position}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-stone-900">
                    {track.title}
                  </p>
                </div>
                <span className="text-sm text-stone-400 shrink-0">
                  {formatDuration(track.length)}
                </span>
                {isSignedIn && (
                  <div className="shrink-0">
                    {savedTracks.has(track.id) ? (
                      <span className="text-xs font-medium text-emerald-600">
                        Saved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSaveTrack(track)}
                        disabled={savingTracks.has(track.id)}
                        className="rounded-md bg-amber-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
                      >
                        {savingTracks.has(track.id) ? "..." : "+"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
