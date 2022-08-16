import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import useMobileView from "../checkForMobileView";
import Navbar from "./Shared/Navbar/Navbar";

export const ProtectedRoutes = ({ Component, pageProps, router }: AppProps) => {
  const user = useAppSelector(state => state.user.user);
  const mobileView = useMobileView();

  useEffect(() => {
    const element = document.getElementById("__next");
    if (mobileView && element !== null) {
      element.style.maxHeight = window.innerHeight + "px";
      element.style.height = window.innerHeight + "px";
    }
  }, [router, user, mobileView]);

  const checkForAuthentication = () => {
    if (user && user.accessToken) {
      if (
        ![
          "/apartments",
          "/apartments/[id]",
          "/[id]",
          "/receipt",
          "/guests"
        ].includes(router.route)
      ) {
        router.push("/apartments");
        return;
      }
    } else {
      if (!["/", "/[id]"].includes(router.route)) {
        router.push("/");
        return false;
      }
    }
    return true;
  };

  return (
    <>
      <Navbar userAuthenticated={!!user.accessToken} />
      <div
        className={`${
          user.accessToken ? "min-h-[calc(100%_-_60px)]" : "min-h-full"
        } min-w-screen w-full overflow-x-hidden page-container ${
          mobileView
            ? window.location.pathname !== "/" && "py-10"
            : window.location.pathname !== "/" && "py-16"
        } select-none`}
      >
        {checkForAuthentication() ? <Component {...pageProps} /> : null}
      </div>
    </>
  );
};
