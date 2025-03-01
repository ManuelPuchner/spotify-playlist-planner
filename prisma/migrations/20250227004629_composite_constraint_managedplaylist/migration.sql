/*
  Warnings:

  - A unique constraint covering the columns `[userId,spotifyPlaylistId]` on the table `ManagedPlaylist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ManagedPlaylist_userId_spotifyPlaylistId_key" ON "ManagedPlaylist"("userId", "spotifyPlaylistId");
