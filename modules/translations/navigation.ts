import { LOCALES } from '@modules/translations';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const localePrefix = 'always'; // Default

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales: LOCALES, localePrefix });
