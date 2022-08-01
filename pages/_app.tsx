import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "../public/Styles/globals.css";
import { ProtectedRoutes } from "../src/components/Routes";
import "../src/i18n";
import { persistor, store } from "../store/store";

declare global {
  interface Window {
    opera: any;
  }
}

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ProtectedRoutes
            Component={Component}
            pageProps={pageProps}
            router={router}
          />
        </PersistGate>
    </Provider>
  );
}

export default MyApp;
