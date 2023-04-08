import { AlertModalProvider } from '@/AlertModalProvider';
import { AuthProvider } from '@/AuthProvider';
import { ProtectedRoutes } from '@/components/Routes';
import i18n from '@/i18n';
import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from 'store/store';
import '../public/Styles/globals.css';
import { PageLoader } from '@/components/Shared/Loader/PageLoader';

declare global {
  interface Window {
    opera: any;
  }
}

function MyApp({ Component, pageProps, router }: AppProps) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    i18n.init();
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', end);
    router.events.on('routeChangeError', end);
    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', end);
      router.events.off('routeChangeError', end);
    };
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <PersistGate loading={null} persistor={persistor}>
          <PageLoader isLoading={loading}>
            <AlertModalProvider>
              <ProtectedRoutes
                Component={Component}
                pageProps={pageProps}
                router={router}
              />
            </AlertModalProvider>
          </PageLoader>
        </PersistGate>
      </AuthProvider>
    </Provider>
  );
}

export default MyApp;
