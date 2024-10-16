
// src/middleware.ts

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Define your custom logic here, e.g., checking if the user is authenticated
  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users from protected routes
  if (pathname.startsWith('/dashboard')) {
    // Add your authentication check logic here
    // For example:
    const isAuthenticated = false; // Replace with actual check
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  }

  return NextResponse.next();
}

// // Specify the paths to apply this middleware
// export const config = {
//   matcher: ['/', '/about', '/dashboard/:path*', '/api/:path*'], // Add other paths as needed
// };
//
