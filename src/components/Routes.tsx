import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import useMobileView from "../checkForMobileView";
import AlertModal from "./Shared/AlertModal/AlertModal";
import Navbar from "./Shared/Navbar/Navbar";

export const ProtectedRoutes = ({ Component, pageProps, router }: AppProps) => {
  const user = useAppSelector(state => state.user.user);
  const mobileView = useMobileView();
  const [displayPage, setDisplayPage] = useState(false);

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
          "/invoice",
          "/guests",
        ].includes(router.route)
      ) {
        router.push("/apartments");
      }
    } else {
      if (!["/", "/[id]"].includes(router.route)) {
        router.push("/");
      }
    }
    setDisplayPage(true);
  };

  useEffect(() => {
    checkForAuthentication();
  }, [router]);

  return (
    <>
      <Navbar userAuthenticated={!!user.accessToken} />
      <div
        className={`min-w-screen w-full overflow-x-hidden page-container ${
          mobileView
            ? window.location.pathname !== "/" && "py-10"
            : window.location.pathname !== "/" && "py-16"
        } select-none`}
      >
        {displayPage ? <Component {...pageProps} /> : null}
      </div>
      <AlertModal />
    </>
  );
};
