import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/treatments(.*)',
  '/home-treatment(.*)',
  '/products(.*)',
  '/product-gallery(.*)',
  '/best-deal(.*)',
  '/blog(.*)',
  '/prime-insight(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/reservation(.*)',
  '/api/treatments(.*)',
  '/api/best-deals(.*)',
  '/api/blog(.*)',
  '/api/reservations(.*)',
  '/api/categories(.*)',
  '/api/vouchers(.*)',
  '/api/webhooks(.*)',
  // Clerk OAuth callbacks
  '/api/auth(.*)',
  // Static files
  '/(.*\\.mp4$)',
  '/(.*\\.webm$)',
  '/(.*\\.png$)',
  '/(.*\\.jpg$)',
  '/(.*\\.jpeg$)',
  '/(.*\\.svg$)',
  '/(.*\\.ico$)',
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const pathname = req.nextUrl.pathname;

  if (pathname === '/prime-insight' || pathname.startsWith('/prime-insight/')) {
    return;
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
