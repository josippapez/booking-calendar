import { Navbar } from '@modules/Shared/Navbar/Navbar';
import { AlertModalProvider } from '@modules/Shared/Providers/AlertModalProvider';
import { AuthProvider } from '@modules/Shared/Providers/AuthProvider';
import { TanstackQueryProvider } from '@modules/Shared/Providers/TanstackQueryProvider';
import {
  CountryCodes,
  DEFAULT_LANGUAGE,
  getCurrentTranslations,
} from '@modules/translations';
import '@styles/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';

export default async function LocaleLayout({
  children,
  params: { locale = DEFAULT_LANGUAGE },
}: {
  children: React.ReactNode;
  params: { locale: CountryCodes };
}) {
  const currentTranslations = await getCurrentTranslations(locale);
  const config = {
    messages: currentTranslations,
    locale: locale || DEFAULT_LANGUAGE,
  };

  return (
    <html lang={locale}>
      <body id='__next' className='relative'>
        <Suspense>
          <NextIntlClientProvider {...config}>
            <TanstackQueryProvider>
              <AuthProvider>
                <AlertModalProvider>
                  <Navbar />
                  {children}
                  <ToastContainer />
                </AlertModalProvider>
              </AuthProvider>
            </TanstackQueryProvider>
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
