# Music Discovery App

## Overview
A full-stack music discovery tool where users can search for artists and albums using the MusicBrainz API, save albums to a personal listening list, and rate them.

## Tech Stack
- **Framework**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk (sign up, log in, sign out)
- **Database**: Supabase (PostgreSQL)
- **External API**: MusicBrainz API (no key required)

## Data Model

### Supabase Tables

**listening_list**
- `id` (uuid, primary key)
- `user_id` (text, from Clerk)
- `musicbrainz_id` (text, MusicBrainz release ID)
- `title` (text, album title)
- `artist` (text, artist name)
- `release_date` (text, release date)
- `cover_art_url` (text, nullable)
- `rating` (integer, 1-5, nullable)
- `status` (text: 'want_to_listen' | 'listening' | 'listened')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## API Routes
- `GET /api/search?q=...&type=artist|release` - Search MusicBrainz
- `GET /api/artist/[id]` - Get artist details + releases
- `POST /api/listening-list` - Save album to listening list
- `GET /api/listening-list` - Get user's listening list
- `PATCH /api/listening-list/[id]` - Update rating or status
- `DELETE /api/listening-list/[id]` - Remove from listening list

## Style Preferences
- Clean, modern UI with good spacing
- Dark/music-themed aesthetic
- Mobile-responsive design

## Environment Variables
All keys stored in `.env.local`:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
