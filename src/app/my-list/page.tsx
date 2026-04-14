"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import { ListeningListItem } from "@/lib/types";

const STATUS_OPTIONS = [
  { value: "want_to_listen", label: "Want to Listen" },
  { value: "listening", label: "Listening" },
  { value: "listened", label: "Listened" },
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
        <div className="border-b border-stone-200 bg-gradient-to-b from-amber-50 to-[#faf7f2] px-4 py-10">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-3xl font-bold text-stone-900">My Listening List</h1>
            <p className="mt-2 text-stone-500">
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
                    ? "bg-amber-600 text-white"
                    : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                }`}
              >
                {tab.label} ({counts[tab.value as keyof typeof counts]})
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-stone-400">
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
                  className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {item.cover_art_url && (
                      <img
                        src={item.cover_art_url}
                        alt={item.title}
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-stone-900">{item.title}</h3>
                      <p className="text-sm text-stone-500">{item.artist}</p>
                      {item.release_date && (
                        <span className="text-xs text-stone-400">
                          {item.release_date.slice(0, 4)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <select
                      value={item.status}
                      onChange={(e) => updateItem(item.id, { status: e.target.value })}
                      className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 focus:border-amber-500 focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <StarRating
                      rating={item.rating}
                      onRate={(rating) => updateItem(item.id, { rating })}
                    />

                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg px-3 py-1.5 text-sm text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
