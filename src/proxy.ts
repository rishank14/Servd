import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { aj } from "@/lib/arcjet";

const protectedRoutes = [
  "/recipe",
  "/recipes",
  "/pantry",
  "/dashboard",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply Arcjet protection first
  const decision = await aj.protect(request);

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // Check whether the requested path requires authentication
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Verify the user's Better Auth session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Redirect unauthenticated users to the homepage
  if (!session) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};