"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200 bg-[#faf7f2]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-stone-900">
          <svg
            width="28"
            height="28"
            viewBox="0 0 100 100"
            className="text-amber-600"
            fill="currentColor"
          >
            <circle cx="50" cy="50" r="48" fill="currentColor" />
            <circle cx="50" cy="50" r="44" fill="#faf7f2" />
            <circle cx="50" cy="50" r="38" fill="currentColor" opacity="0.15" />
            <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.15" />
            <circle cx="50" cy="50" r="14" fill="#faf7f2" />
            <circle cx="50" cy="50" r="6" fill="currentColor" />
            <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          </svg>
          <span>Music Madness</span>
        </Link>

        <div className="flex items-center gap-6">
          {isSignedIn ? (
            <>
              <Link
                href="/my-list"
                className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
              >
                My List
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
