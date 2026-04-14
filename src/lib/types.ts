export interface ListeningListItem {
  id: string;
  user_id: string;
  musicbrainz_id: string;
  title: string;
  artist: string;
  release_date: string | null;
  cover_art_url: string | null;
  rating: number | null;
  status: "want_to_listen" | "listening" | "listened";
  created_at: string;
  updated_at: string;
}

export interface MusicBrainzArtist {
  id: string;
  name: string;
  country?: string;
  "life-span"?: {
    begin?: string;
    end?: string;
    ended?: boolean;
  };
  tags?: { name: string; count: number }[];
  disambiguation?: string;
}

export interface MusicBrainzRelease {
  id: string;
  title: string;
  date?: string;
  country?: string;
  "release-group"?: {
    id: string;
    "primary-type"?: string;
    title: string;
  };
  "artist-credit"?: {
    name: string;
    artist: { id: string; name: string };
  }[];
}

export interface SearchResult {
  artists?: MusicBrainzArtist[];
  releases?: MusicBrainzRelease[];
  count: number;
}
