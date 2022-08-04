import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "../public/Styles/globals.css";
import { AuthProvider } from "../src/AuthProvider";
import { ProtectedRoutes } from "../src/components/Routes";
import PageLoader from "../src/components/Shared/Loader/PageLoader";
import "../src/i18n";
import { persistor, store } from "../store/store";

declare global {
  interface Window {
    opera: any;
  }
}

function MyApp({ Component, pageProps, router }: AppProps) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <PersistGate loading={null} persistor={persistor}>
          {loading ? (
            <PageLoader />
          ) : (
            <ProtectedRoutes
              Component={Component}
              pageProps={pageProps}
              router={router}
            />
          )}
        </PersistGate>
      </AuthProvider>
    </Provider>
  );
}

export default MyApp;
