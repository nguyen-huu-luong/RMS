import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { locales } from "./config";
import { NextResponse, NextRequest } from "next/server";
const publicPages = ["/signin"];

function protectCustomersRoute(req: any) {
    if (
        req.nextUrl.pathname.startsWith("/customers") &&
        req.nextauth.user?.role !== "manager"
    ) {
        return NextResponse.rewrite(new URL("/denied", req.url));
    }
    return req;
}

const intlMiddleware = createIntlMiddleware({
    locales,
    localePrefix: "as-needed",
    defaultLocale: "vi",
});

const authMiddleware = withAuth(
    (req) => {
        return intlMiddleware(req);
    },
    {
        callbacks: {
            authorized: ({ token }) => token != null,
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
