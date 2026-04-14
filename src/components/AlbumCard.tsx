"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface AlbumCardProps {
  id: string;
  title: string;
  artist: string;
  date?: string;
  type?: string;
  onSaved?: () => void;
}

function VinylFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-stone-100 text-amber-400/40">
      <svg width="32" height="32" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="48" />
        <circle cx="50" cy="50" r="44" fill="#faf7f2" />
        <circle cx="50" cy="50" r="38" fill="currentColor" opacity="0.15" />
        <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.15" />
        <circle cx="50" cy="50" r="14" fill="#faf7f2" />
        <circle cx="50" cy="50" r="6" fill="currentColor" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      </svg>
    </div>
  );
}

export default function AlbumCard({ id, title, artist, date, type, onSaved }: AlbumCardProps) {
  const { isSignedIn } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);

  const coverUrl = `https://coverartarchive.org/release-group/${id}/front-250`;

  const handleSave = async () => {
    if (!isSignedIn) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/listening-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          musicbrainz_id: id,
          title,
          artist,
          release_date: date || null,
          cover_art_url: coverUrl,
        }),
      });

      if (res.status === 409) {
        setError("Already in your list");
        return;
      }

      if (!res.ok) throw new Error("Failed to save");

      setSaved(true);
      onSaved?.();
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:border-stone-300 hover:shadow-md">
      {/* Album art */}
      <div className="aspect-square w-full">
        {imgError ? (
          <VinylFallback />
        ) : (
          <img
            src={coverUrl}
            alt={`${title} by ${artist}`}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="truncate font-semibold text-stone-900">{title}</h4>
        <p className="truncate text-sm text-stone-500">{artist}</p>
        <div className="mt-2 flex items-center gap-2">
          {date && (
            <span className="text-xs text-stone-400">{date.slice(0, 4)}</span>
          )}
          {type && (
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
              {type}
            </span>
          )}
        </div>

        {isSignedIn && (
          <div className="mt-3">
            {saved ? (
              <span className="text-sm font-medium text-emerald-600">Saved!</span>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
              >
                {saving ? "..." : "+ Save to List"}
              </button>
            )}
            {error && <span className="mt-1 block text-xs text-amber-700">{error}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
