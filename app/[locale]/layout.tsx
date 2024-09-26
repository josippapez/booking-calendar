import { Providers } from '@modules/Shared/Providers/Providers';
import {
  DEFAULT_LANGUAGE,
  getCurrentTranslations,
  Locale,
} from '@modules/translations';
import { NextIntlClientProvider } from 'next-intl';
import { Suspense } from 'react';

export default async function LocaleLayout({
  children,
  params: { locale = DEFAULT_LANGUAGE },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const currentTranslations = await getCurrentTranslations(locale);

  return (
    <html lang={locale}>
      <body id='__next' className='relative'>
        <NextIntlClientProvider locale={locale} messages={currentTranslations}>
          <Suspense>
            <Providers>{children}</Providers>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
