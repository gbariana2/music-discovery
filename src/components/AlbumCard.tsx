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

export default function AlbumCard({ id, title, artist, date, type, onSaved }: AlbumCardProps) {
  const { isSignedIn } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!isSignedIn) return;
    setSaving(true);
    setError("");

    try {
      const coverUrl = `https://coverartarchive.org/release-group/${id}/front-250`;

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
    <div className="flex items-start justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700">
      <div className="flex-1">
        <h4 className="font-semibold text-zinc-100">{title}</h4>
        <p className="text-sm text-zinc-400">{artist}</p>
        <div className="mt-2 flex items-center gap-2">
          {date && (
            <span className="text-xs text-zinc-500">{date.slice(0, 4)}</span>
          )}
          {type && (
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
              {type}
            </span>
          )}
        </div>
      </div>
      {isSignedIn && (
        <div className="ml-3 flex flex-col items-end">
          {saved ? (
            <span className="text-sm font-medium text-emerald-400">Saved!</span>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
            >
              {saving ? "..." : "+ Save"}
            </button>
          )}
          {error && <span className="mt-1 text-xs text-amber-400">{error}</span>}
        </div>
      )}
    </div>
  );
}
