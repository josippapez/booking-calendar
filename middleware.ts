import { DEFAULT_LANGUAGE, LOCALES, countries } from '@modules/translations';
import { Routes } from 'consts';
import createMiddleware from 'next-intl/middleware';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const LOCALIZATION_KEY = 'NEXT_LOCALE';

const handleI18nRouting = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LANGUAGE,
  localeDetection: true,
  localePrefix: 'always',
});

function getLocaleAndRoute(request: NextRequest) {
  let previousRoute = request.headers.get('referer') ?? undefined;
  // always will be of one of these formats: /[locale]/[route] or /[route]
  const splitLink = request.nextUrl.clone().pathname.slice(1).split('/');
  const linkHasLocale = Object.keys(countries).includes(splitLink[0]);

  const linkLocale = linkHasLocale ? splitLink[0] : undefined;
  const cookieLocale =
    request.cookies.get(LOCALIZATION_KEY)?.value !== 'undefined'
      ? request.cookies.get(LOCALIZATION_KEY)?.value
      : undefined;
  const locale = linkLocale || cookieLocale || DEFAULT_LANGUAGE;

  const tempRoute = linkHasLocale
    ? splitLink.filter((item, index) => index !== 0).join('/')
    : splitLink.join('/');
  const routeWithoutLocale = '/' + tempRoute;

  return {
    locale,
    routeWithoutLocale,
    previousRoute,
  };
}

function isRouteInRoutes(route: string, customRoutes?: string[]) {
  const routes = customRoutes ?? Object.values(Routes);
  const routeMatches = !!routes.find(item => {
    if (item.includes(route)) {
      return true;
    }
    if (item.includes(':')) {
      const itemWithoutParams = item.split(':')[0];
      if (route.includes(itemWithoutParams)) {
        return true;
      }
    }
    return false;
  });

  return routeMatches;
}

function isInDynamicRoute(route: string, customRoutes?: string[]) {
  const routes = customRoutes ?? Object.values(Routes);

  const routeSplit = route.split('/');
  const routeWithoutDynamicParams =
    '/' +
    routeSplit
      .filter((item, index) => {
        if (index !== routeSplit.length - 1) {
          return item;
        }
      })
      .join('/');

  const routeMatches = !!routes.find(item => {
    if (item.includes(':')) {
      const itemWithoutParams = item.split('/:')[0];
      if (routeWithoutDynamicParams === itemWithoutParams) {
        return true;
      }
    }
  });

  return routeMatches;
}

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
) {
  const { locale, routeWithoutLocale } = getLocaleAndRoute(request);

  // 404 redirect if route is not in Routes
  if (!isRouteInRoutes(routeWithoutLocale)) {
    request.nextUrl.pathname = '/404';
    request.cookies.set('accept-language', locale);
    request.cookies.set(LOCALIZATION_KEY, locale);
    const Response = handleI18nRouting(request);
    Response.headers.set('x-default-locale', locale);
    return Response;
  }

  if (request.cookies.has('accessToken')) {
    // Redirect to home if user is logged in and tries to access login or register page
    if ([Routes.LOGIN].includes(routeWithoutLocale)) {
      request.nextUrl.pathname = '/' + locale + Routes.APARTMENTS;
      return NextResponse.redirect(request.nextUrl);
    }
  }

  // Redirect to home if user is not logged in and tries to access account pages
  if (
    !request.cookies.has('accessToken') &&
    [
      Routes.APARTMENTS,
      Routes.APARTMENT,
      Routes.GUESTS,
      Routes.INVOICE,
    ].includes(routeWithoutLocale)
  ) {
    request.nextUrl.pathname = '/' + locale + Routes.LOGIN;
    return NextResponse.redirect(request.nextUrl);
  }

  request.cookies.set(LOCALIZATION_KEY, locale);
  request.cookies.set('accept-language', locale);
  const Response = handleI18nRouting(request);
  Response.headers.set('x-default-locale', locale);
  return Response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets (static asset files in public directory)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|_vercel|assets|logo.png|favicon.ico|Styles/Assets|sw.js).*)',
  ],
};
