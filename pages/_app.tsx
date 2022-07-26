import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { PersistGate } from "redux-persist/integration/react";
import { ProtectedRoutes } from "../src/components/Routes";
import { persistor, rrfProps, store } from "../store/store";
import "../src/i18n";
import "../public/Styles/globals.css";

declare global {
  interface Window {
    opera: any;
  }
}

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <PersistGate loading={null} persistor={persistor}>
          <ProtectedRoutes
            Component={Component}
            pageProps={pageProps}
            router={router}
          />
        </PersistGate>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default MyApp;
