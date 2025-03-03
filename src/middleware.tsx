import { NextRequest, NextResponse } from "next/server";

import { prisma } from "./prisma";

export default async function middleware(req: NextRequest) {
  const token =
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  try {
    const session = await prisma.session.findUnique({
      where: {
        sessionToken: token,
        expires: { gt: new Date() },
      },
      include: { user: true },
    });
    if (!session) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
  } catch (error) {
    console.error("Error verifying session: ", error);
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home",
    "/playlists",
    "/playlist/:path",
    "/playlist/:path/planning/:path",
  ],
};
