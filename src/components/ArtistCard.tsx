"use client";

import Link from "next/link";
import { useState } from "react";
import { MusicBrainzArtist } from "@/lib/types";

interface ArtistCardProps {
  artist: MusicBrainzArtist;
  imageUrl?: string;
}

export default function ArtistCard({ artist, imageUrl }: ArtistCardProps) {
  const [imgError, setImgError] = useState(false);

  const tags = artist.tags
    ?.sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((t) => t.name);

  return (
    <Link
      href={`/artist/${artist.id}`}
      className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:border-amber-400 hover:shadow-md"
    >
      {/* Artist image or vinyl placeholder */}
      <div className="relative h-48 w-full bg-stone-100">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={artist.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 text-amber-400/50">
            <svg width="64" height="64" viewBox="0 0 100 100" fill="currentColor">
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
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold text-stone-900 group-hover:text-amber-700">
          {artist.name}
        </h3>
        {artist.disambiguation && (
          <p className="mb-2 text-sm text-stone-400">{artist.disambiguation}</p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {artist.country && (
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-500">
              {artist.country}
            </span>
          )}
          {tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs text-amber-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
