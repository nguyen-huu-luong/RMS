import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { locales } from "./config";
import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
const publicPages = ["/signin"];
const authRoutes = ["/", "/customers", "/bussiness", "/chat", "/leads", 
                    "/marketing", "/organization", "/overview", "/profile", 
                    "/report", "/sale", "/setting"];

const intlMiddleware = createIntlMiddleware({
    locales,
    localePrefix: "as-needed",
    defaultLocale: "vi",
});

const authMiddleware = withAuth(
    async (request) => {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token) {
            const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

            if (isAuthRoute) {
                const redirectUrl = new URL("/signin", request.url);
                redirectUrl.searchParams.set("callbackUrl", request.nextUrl.href);
                // return NextResponse.redirect(redirectUrl);
            }
        } 
        
        return intlMiddleware(request);
        
    },

    {
        callbacks: {
            authorized: (session) => {
                console.log(session.token?.role)
                return session.token?.role === "manager" ||  session.token?.role === "employee" || session.token?.role === "chef";
            },
        },
        pages: {
            signIn: "/signin",
        },
    }
);

export default function middleware(req: NextRequest) {
    const publicPathnameRegex = RegExp(
        `^(/(${locales.join("|")}))?(${publicPages
            .flatMap((p) => (p === "/" ? ["", "/"] : p))
            .join("|")})/?$`,
        "i"
    );
    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

    if (isPublicPage) {
        return intlMiddleware(req);
    } else {
        return (authMiddleware as any)(req);
    }
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};
