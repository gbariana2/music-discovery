"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, type: "artist" | "release") => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"artist" | "release">("artist");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), type);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for artists or albums..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
      </div>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as "artist" | "release")}
        className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-100 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
      >
        <option value="artist">Artists</option>
        <option value="release">Albums</option>
      </select>
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
