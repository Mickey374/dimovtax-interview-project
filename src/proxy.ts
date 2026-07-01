import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import ROUTES from "@/constants/route";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = nextUrl.pathname === ROUTES.SIGN_IN || nextUrl.pathname === ROUTES.SIGN_UP;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // Allow NextAuth API routes to pass through
  if (isApiAuthRoute) {
    return;
  }

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isPublicRoute) {
    return Response.redirect(new URL(ROUTES.HOME, nextUrl));
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      // Redirect to signin if not logged in
      return Response.redirect(new URL(ROUTES.SIGN_IN, nextUrl));
    }
    if (userRole !== "ADMIN") {
      // Redirect non-admins to the home page
      return Response.redirect(new URL(ROUTES.HOME, nextUrl));
    }
  }

  // Protect all other routes
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(ROUTES.SIGN_IN, nextUrl));
  }

  // Allow the request to proceed
  return;
});

// Match all routes except for static files, images, and Next.js internals.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
