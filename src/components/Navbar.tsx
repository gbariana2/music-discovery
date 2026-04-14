"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-violet-400">♪</span>
          <span>Music Discovery</span>
        </Link>

        <div className="flex items-center gap-6">
          {isSignedIn ? (
            <>
              <Link
                href="/my-list"
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
              >
                My List
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
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
