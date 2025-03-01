/*
  Warnings:

  - The primary key for the `ManagedPlaylist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ManagedPlaylist` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlannedRelease" DROP CONSTRAINT "PlannedRelease_managedPlaylistId_fkey";

-- AlterTable
ALTER TABLE "ManagedPlaylist" DROP CONSTRAINT "ManagedPlaylist_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ManagedPlaylist_pkey" PRIMARY KEY ("spotifyPlaylistId");

-- AddForeignKey
ALTER TABLE "PlannedRelease" ADD CONSTRAINT "PlannedRelease_managedPlaylistId_fkey" FOREIGN KEY ("managedPlaylistId") REFERENCES "ManagedPlaylist"("spotifyPlaylistId") ON DELETE CASCADE ON UPDATE CASCADE;
