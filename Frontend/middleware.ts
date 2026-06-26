import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const envFlag = String(process.env.NEXT_PUBLIC_DISABLE_AUTH || "").toLowerCase();
	// Runtime overrides for development convenience
	const disableParam = req.nextUrl.searchParams.get("disableAuth");
	const disableAuthParam = disableParam === "1" || (disableParam ?? "").toLowerCase() === "true";
	const disableAuthCookie = req.cookies.get("disable_auth")?.value === "1";

	// Auth bypass removed – enforce authentication for all routes	
	const { pathname } = req.nextUrl;
	// Allow public paths
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/favicon.ico") ||
		pathname.startsWith("/public") ||
		pathname.startsWith("/api") ||
		pathname.startsWith("/login")
	) {
		return NextResponse.next();
	}

	const token = req.cookies.get("auth_token")?.value;
	if (!token) {
		const url = req.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("next", pathname);
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next|favicon.ico|public|api).*)"],
};


