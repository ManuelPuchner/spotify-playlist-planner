import { ExternalUrls, Image } from './spotify-general';

export interface UserPlaylistsResponse {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: null;
  total: number;
  items: UserPlaylist[];
}

export interface UserPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color: null;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
}

export interface Owner {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface Tracks {
  href: string;
  total: number;
}
