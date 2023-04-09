import { Navbar } from '@modules/Shared';
import { useMobileView } from '@modules/Shared/Hooks/useMobileView';
import { AlertModalProvider, AuthProvider } from '@modules/Shared/Providers';
import { Routes } from 'consts';
import Cookies from 'js-cookie';
import { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/store/store';

export const ProtectedRoutes = ({ Component, pageProps, router }: AppProps) => {
  const mobileView = useMobileView();

  useEffect(() => {
    const element = document.getElementById('__next');
    if (mobileView && element !== null) {
      element.style.maxHeight = window.innerHeight + 'px';
      element.style.height = window.innerHeight + 'px';
    }
  }, [router, mobileView]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <AlertModalProvider>
            <Navbar userAuthenticated={!!Cookies.get('accessToken')} />
            <div
              className={`min-w-screen page-container h-fit w-full overflow-x-hidden ${
                mobileView
                  ? router.asPath !== Routes.LOGIN && 'py-10'
                  : router.asPath !== Routes.LOGIN && 'py-16'
              } select-none`}
            >
              <ToastContainer />
              <Component {...pageProps} />
            </div>
          </AlertModalProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
};
