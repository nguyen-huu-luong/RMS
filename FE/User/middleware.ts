import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localeDetection: false,
});
 
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};