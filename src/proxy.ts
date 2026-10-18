import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const protectedRoutes = [
  "/recipe",
  "/recipes",
  "/pantry",
  "/dashboard",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check whether the requested path requires authentication.
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Verify the user's Better Auth session.
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Redirect unauthenticated users to the homepage.
  if (!session) {
    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/recipe/:path*",
    "/recipes/:path*",
    "/pantry/:path*",
    "/dashboard/:path*",
  ],
};