import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import isMobileView from "../checkForMobileView";
import { useAppSelector } from "../../store/hooks";
import PageLoader from "./Shared/Loader/PageLoader";
import Navbar from "./Shared/Navbar/Navbar";

export const ProtectedRoutes = ({ Component, pageProps, router }: AppProps) => {
  const route = useRouter();
  const user = useAppSelector(state => state.user.user);

  useEffect(() => {
    const element = document.getElementById("__next");
    if (isMobileView() && element !== null) {
      element.style.maxHeight = window.innerHeight + "px";
      element.style.height = window.innerHeight + "px";
    }
  }, [route, user]);

  const checkForAuthentication = () => {
    if (user && user.accessToken) {
      if (window.location.pathname === "/") {
        route.push("/apartments");
        return false;
      }
    } else {
      if (["apartments"].includes(window.location.pathname.split("/")[1])) {
        route.push("/");
        return false;
      }
    }
    return true;
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <Navbar userAuthenticated={!!user.accessToken} />
      <div
        className={`${
          user.accessToken ? "min-h-[calc(100%_-_60px)]" : "min-h-full"
        } min-w-screen w-full overflow-x-hidden page-container ${
          isMobileView()
            ? "py-10 px-2.5"
            : window.location.pathname !== "/" && "py-16 px-[5%]"
        } select-none`}
      >
        {checkForAuthentication() ? <Component {...pageProps} /> : null}
      </div>
    </Suspense>
  );
};
