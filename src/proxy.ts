import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";
  
  const isUrlAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isUrlCheckout = req.nextUrl.pathname.startsWith("/checkout");

  // 1. Admin/Seller Route Protection Matrix
  if (isUrlAdmin) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.nextUrl));
    if (!isAdmin) return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // 2. 🌟 NEW: Customer Checkout Protection Interceptor
  // Agar guest user Bina login ke order place karne checkout page par jana chahega:
  if (isUrlCheckout && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl);
    // callbackUrl capture karne se user login hote hi wapis automatic checkout par aa jayega
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  // Matching explicit security boundaries
  matcher: ["/admin/:path*", "/checkout/:path*"],
};