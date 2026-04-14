"use client";

import Link from "next/link";
import { MusicBrainzArtist } from "@/lib/types";

interface ArtistCardProps {
  artist: MusicBrainzArtist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const tags = artist.tags
    ?.sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((t) => t.name);

  return (
    <Link
      href={`/artist/${artist.id}`}
      className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-violet-500/50 hover:bg-zinc-900"
    >
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600/20 text-2xl text-violet-400 transition-colors group-hover:bg-violet-600/30">
        ♪
      </div>
      <h3 className="mb-1 text-lg font-semibold text-zinc-100 group-hover:text-violet-300">
        {artist.name}
      </h3>
      {artist.disambiguation && (
        <p className="mb-2 text-sm text-zinc-500">{artist.disambiguation}</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {artist.country && (
          <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
            {artist.country}
          </span>
        )}
        {tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-violet-600/10 px-2.5 py-0.5 text-xs text-violet-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
