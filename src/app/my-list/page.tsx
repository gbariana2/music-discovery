"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import { ListeningListItem } from "@/lib/types";

const STATUS_OPTIONS = [
  { value: "want_to_listen", label: "Want to Listen", color: "bg-blue-500/20 text-blue-400" },
  { value: "listening", label: "Listening", color: "bg-amber-500/20 text-amber-400" },
  { value: "listened", label: "Listened", color: "bg-emerald-500/20 text-emerald-400" },
] as const;

export default function MyListPage() {
  const [items, setItems] = useState<ListeningListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchList = async () => {
    try {
      const res = await fetch("/api/listening-list");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const updateItem = async (id: string, updates: { rating?: number; status?: string }) => {
    try {
      const res = await fetch(`/api/listening-list/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      }
    } catch {
      // silent fail
    }
  };

  const removeItem = async (id: string) => {
    try {
      const res = await fetch(`/api/listening-list/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch {
      // silent fail
    }
  };

  const filtered = filter === "all" ? items : items.filter((item) => item.status === filter);

  const counts = {
    all: items.length,
    want_to_listen: items.filter((i) => i.status === "want_to_listen").length,
    listening: items.filter((i) => i.status === "listening").length,
    listened: items.filter((i) => i.status === "listened").length,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="border-b border-zinc-800 bg-gradient-to-b from-violet-950/20 to-zinc-950 px-4 py-10">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-3xl font-bold">My Listening List</h1>
            <p className="mt-2 text-zinc-400">
              {items.length} album{items.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-6">
          {/* Filter tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {[
              { value: "all", label: "All" },
              { value: "want_to_listen", label: "Want to Listen" },
              { value: "listening", label: "Listening" },
              { value: "listened", label: "Listened" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === tab.value
                    ? "bg-violet-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {tab.label} ({counts[tab.value as keyof typeof counts]})
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-zinc-500">
                {items.length === 0
                  ? "Your listening list is empty. Search for music to add albums!"
                  : "No albums match this filter."}
              </p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="space-y-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-100">{item.title}</h3>
                    <p className="text-sm text-zinc-400">{item.artist}</p>
                    {item.release_date && (
                      <span className="text-xs text-zinc-500">
                        {item.release_date.slice(0, 4)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* Status selector */}
                    <select
                      value={item.status}
                      onChange={(e) => updateItem(item.id, { status: e.target.value })}
                      className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 focus:border-violet-500 focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {/* Star rating */}
                    <StarRating
                      rating={item.rating}
                      onRate={(rating) => updateItem(item.id, { rating })}
                    />

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
