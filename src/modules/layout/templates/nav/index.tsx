import React, { Suspense } from "react";
import PlaylistListSidebar from "../../components/user-playlists/playlist-list-sidebar";
import ProfileCard from "../../components/profile-card/profile-card";
import CreatePlaylistButton from "../../components/create-playlist-button";
import ProfileCardSkeleton from "../../components/skeletons/profile-card-skeleton";
import PlaylistListSkeleton from "../../components/skeletons/playlist-list-skeleton";

import ManagedPlaylistList from "../../components/managed-playlists/managed-playlist-list";
import ManagedPlaylistSkeleton from "../../components/skeletons/managed-playlist-skeleton";
import Link from "next/link";

async function Nav() {
  return (
    <nav className="bg-neutral-900 fixed h-screen max-h-screen w-80 flex flex-col justify-between px-4 py-4">
      <div className="top flex flex-1 flex-col gap-4 ">
        <Link href="/home">
          <h1 className="text-3xl font-bold">Playlist Planner</h1>
        </Link>

        <h3 className="text-xl font-bold">Your Planned Playlists</h3>
        <Suspense fallback={<ManagedPlaylistSkeleton />}>
          <ManagedPlaylistList />
        </Suspense>
        <CreatePlaylistButton />

        <div className="flex items-center justify-center gap-4">
          <div className="line w-1/3 bg-neutral-50/30 h-[1px]"></div>
          <span>or</span>
          <div className="line w-1/3 bg-neutral-50/30 h-[1px]"></div>
        </div>
        <h3 className="text-xl font-bold">Manage Existing Playlist</h3>

        <div className="flex-1 flex ">
          <Suspense fallback={<PlaylistListSkeleton />}>
            <PlaylistListSidebar />
          </Suspense>
        </div>
      </div>
      <div className="bottom">
        <Suspense fallback={<ProfileCardSkeleton />}>
          <ProfileCard />
        </Suspense>
      </div>
    </nav>
  );
}

export default Nav;
