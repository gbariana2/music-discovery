import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("listening_list")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { musicbrainz_id, title, artist, release_date, cover_art_url } = body;

  if (!musicbrainz_id || !title || !artist) {
    return NextResponse.json(
      { error: "musicbrainz_id, title, and artist are required" },
      { status: 400 }
    );
  }

  // Check if already in list
  const { data: existing } = await supabase
    .from("listening_list")
    .select("id")
    .eq("user_id", userId)
    .eq("musicbrainz_id", musicbrainz_id)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Album already in your listening list" },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("listening_list")
    .insert({
      user_id: userId,
      musicbrainz_id,
      title,
      artist,
      release_date: release_date || null,
      cover_art_url: cover_art_url || null,
      rating: null,
      status: "want_to_listen",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
