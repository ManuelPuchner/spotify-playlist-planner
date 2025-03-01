import { auth } from "@/auth";
import Nav from "@/modules/layout/templates/nav";
import Player from "@/modules/layout/templates/player";
import React from "react";

async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (
    !session ||
    !session.user ||
    !session.accounts["spotify"] ||
    !session.accounts["spotify"].access_token
  ) {
    return <div>Unauthorized</div>;
  }

  const token = session?.accounts["spotify"].access_token;

  return (
    <div className="flex h-screen">
      <Nav />
      <div className="flex-1 ml-80">
        <main className="w-full">{children}</main>
        <Player token={token} />
      </div>
    </div>
  );
}

export default MainLayout;
