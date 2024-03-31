import { ProtectedRoutes } from '@/Core';
import i18n from '@/i18n';
import { PageLoader } from '@modules/Shared/Loader/PageLoader';
import { Settings } from 'luxon';
import { AppProps } from 'next/app';
import { useEffect } from 'react';
import '@public/Styles/globals.css';

declare global {
  interface Window {
    opera: any;
  }
}

function MyApp({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.init();
    }
    Settings.defaultLocale = i18n.language;
  }, []);

  return (
    <PageLoader>
      <ProtectedRoutes
        Component={Component}
        pageProps={pageProps}
        router={router}
      />
    </PageLoader>
  );
}

export default MyApp;
