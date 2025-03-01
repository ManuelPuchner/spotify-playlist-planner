import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        // For Spotify images
        hostname: "mosaic.scdn.co",
        protocol: "https",
      },
      {
        // For Spotify images
        hostname: "image-cdn-ak.spotifycdn.com",
        protocol: "https",
      },
      {
        // For Spotify images
        hostname: "image-cdn-fa.spotifycdn.com",
        protocol: "https",
      },
      {
        // For Spotify images
        hostname: "i.scdn.co",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
