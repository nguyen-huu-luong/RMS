import {Pathnames} from 'next-intl/navigation';

export const locales = ['vi', 'en'] as const;

export const pathnames = {
  '/': '/',
  '/pathnames': {
    vi: '/pathnames',
    en: '/pfadnamen'
  }
} satisfies Pathnames<typeof locales>;

export const localePrefix = 'as-needed';

export type AppPathnames = keyof typeof pathnames;