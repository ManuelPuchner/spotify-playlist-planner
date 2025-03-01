export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface ExternalUrls {
  spotify: string;
}

export interface ExternalIDS {
  isrc: string;
  ean: string;
  upc: string;
}

export type LinkedFrom = object;

export interface Restrictions {
  reason: string;
}

export interface Device {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
  supports_volume: boolean;
}
