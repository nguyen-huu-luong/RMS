// import createMiddleware from 'next-intl/middleware';
// import {pathnames, locales, localePrefix} from './config';

// export default createMiddleware({
//   defaultLocale: 'vi',
//   locales,
//   pathnames,
//   localePrefix
// });

// export const config = {
//   matcher: [
//     '/',
//     '/(vi|en)/:path*',
//     '/((?!_next|_vercel|.*\\..*).*)'
//   ]
// };
import {NextRequest} from 'next/server';
import {withAuth} from 'next-auth/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import {locales} from './config';

const publicPages = [
  '/',
  '/signin',
  '/register',
  '/chat',
  '/about',
  '/news'
];

const intlMiddleware = createIntlMiddleware({
  locales,
  localePrefix: 'as-needed',
  defaultLocale: 'vi'
});

const authMiddleware = withAuth(
  (req) => intlMiddleware(req),
  {
    callbacks: {
      authorized: ({token}) => token != null
    },
    pages: {
      signIn: '/signin'
    }
  }
);

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};