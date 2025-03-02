import { prisma } from "@/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Verify the authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const plannedReleases = await prisma.plannedRelease.findMany({
    where: {
      scheduledAt: {
        equals: new Date(new Date().toISOString().split("T")[0]),
      },
    },
    include: {
      plannedSongs: {
        orderBy: {
          order: "asc",
        },
      },
      managedPlaylist: {
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  provider: "spotify",
                },
              },
            },
          },
        },
      },
    },
  });

  // Create a map to track the plannedRelease to activate for each managed playlist.
  // If multiple plannedReleases belong to the same managedPlaylist, the last one wins.
  const updateMap = new Map<string, string>(); // key: managedPlaylistId, value: plannedRelease.id

  // Process each release (e.g., updating the Spotify playlist)
  for (const plannedRelease of plannedReleases) {
    try {
      await releaseSpotifyPlaylist(plannedRelease);
      // Record the plannedRelease to activate for its managed playlist.
      updateMap.set(plannedRelease.managedPlaylistId, plannedRelease.id);
    } catch (error) {
      console.error(
        `Failed to update Spotify for plannedRelease ${plannedRelease.id}:`,
        (error as Error).message
      );
    }
  }

  // Now, outside the loop, perform bulk database updates.
  // First, for each managedPlaylist, set any active plannedRelease to inactive.
  const managedPlaylistIds = Array.from(updateMap.keys());
  await prisma.plannedRelease.updateMany({
    where: {
      managedPlaylistId: { in: managedPlaylistIds },
      isActivated: true,
    },
    data: { isActivated: false },
  });

  // Then, activate the chosen plannedRelease for each managed playlist.
  for (const plannedReleaseId of updateMap.values()) {
    await prisma.plannedRelease.update({
      where: { id: plannedReleaseId },
      data: { isActivated: true },
    });
  }

  console.log("Cron job executed at midnight!");
  return NextResponse.json({ success: true, plannedReleases });
}

async function releaseSpotifyPlaylist(
  plannedRelease: Prisma.PlannedReleaseGetPayload<{
    include: {
      plannedSongs: {
        orderBy: {
          order: "asc";
        };
      };
      managedPlaylist: {
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  provider: "spotify";
                };
              };
            };
          };
        };
      };
    };
  }>
): Promise<void> {
  console.log("Releasing planned release for:", plannedRelease.id);

  const spotifyAccount = plannedRelease.managedPlaylist.user.accounts[0];
  if (!spotifyAccount || !spotifyAccount.access_token) {
    throw new Error("No Spotify access token available");
  }
  const spotifyPlaylistId = plannedRelease.managedPlaylist.spotifyPlaylistId;
  if (!spotifyPlaylistId) {
    throw new Error("No Spotify playlist ID provided");
  }

  const plannedSongs = plannedRelease.plannedSongs;
  if (!plannedSongs || plannedSongs.length === 0) {
    throw new Error("No planned songs found");
  }

  const newTrackUris = plannedSongs.map(
    (plannedSong) => `spotify:track:${plannedSong.spotifyTrackId}`
  );

  // Call the Spotify API to update the playlist
  const responseText = await fetchSpotifyPlaylist(
    spotifyPlaylistId,
    spotifyAccount.access_token,
    newTrackUris
  );
  console.log("Spotify playlist updated:", responseText);
}

async function fetchSpotifyPlaylist(
  spotifyPlaylistId: string,
  access_token: string,
  newTrackUris: string[]
): Promise<string> {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${spotifyPlaylistId}/tracks`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        uris: newTrackUris,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update Spotify playlist: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}
