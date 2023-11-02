import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18nConfig";

export default createMiddleware({
	// A list of all locales that are supported
	locales,

	defaultLocale,
	// localeDetection: true,
	// localePrefix: "always",
});

export const config = {
	// Skip all paths that should not be internationalized. This example skips
	// certain folders and all pathnames with a dot (e.g. favicon.ico)
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
