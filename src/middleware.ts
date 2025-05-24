import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const PUBLIC_PATHS = ["/login"];
  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isRootPath = pathname === "/";

  // Case 1: User NOT logged in and trying to access protected routes
  if (!isPublicPath && !token && !isRootPath) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    resetCookies(res);
    return res;
  }

  // Case 2: User is logged in and trying to access a public page like signin or verify-otp
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Case 3: Root path — decide what you want
  if (isRootPath) {
    return token
      ? NextResponse.redirect(new URL("/dashboard", req.url))
      : NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

function resetCookies(response: NextResponse) {
  response.cookies.set("token", "", { maxAge: -1 });
}
export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*|favicon.ico).*)"],
};
