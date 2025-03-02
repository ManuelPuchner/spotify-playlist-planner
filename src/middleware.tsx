import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "./auth";
import NextAuth from "next-auth";

const { auth } = NextAuth(authOptions);
export default auth(async function middleware(req: NextRequest) {
  console.log("middleware");
  const session = await auth();
  if (!session) {
    return Response.redirect(
      new URL("/api/auth/signin", req.nextUrl).toString()
    );
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/home",
    "/playlists",
    "/playlist/:path",
    "/playlist/:path/planning/:path",
  ],
};
