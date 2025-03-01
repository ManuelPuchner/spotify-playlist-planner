"use client";

import { getSpotifyUserProfile } from "@/lib/data/spotify/spotify-fetch-client";
import { Me } from "@/types/me";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProfileCardSkeleton from "../skeletons/profile-card-skeleton";

export default function ProfileCard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Me | null>(null);

  useEffect(() => {
    if (!session || !session.accounts.spotify?.access_token) {
      return;
    }

    getSpotifyUserProfile(session).then((res) => {
      if ("data" in res) {
        setProfile(res.data);
      }
    });
  }, [session]);

  if (!profile) {
    return <ProfileCardSkeleton />;
  }

  if (!session || !session.accounts.spotify?.access_token) {
    return <div>Please sign in to view your profile</div>;
  }

  return (
    <div className="flex items-center gap-4">
      <Image
        src={profile.images?.[0]?.url || "/default-profile.png"}
        alt="Profile Picture"
        width={50}
        height={50}
        priority
        className="rounded-full"
      />

      <div className="flex flex-col justify-start items-start">
        <h4>{profile.display_name}</h4>
        <button
          type="submit"
          onClick={() => signOut()}
          className="text-sm text-neutral-500 hover:underline"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
