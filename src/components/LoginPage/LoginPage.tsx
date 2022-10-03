import { NextPage } from "next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useMobileView from "../../checkForMobileView";
import Login from "./Login";
import style from "./LoginPage.module.scss";

type Props = {};

const LoginPage: NextPage = (props: Props) => {
  const { t } = useTranslation("LoginPage");
  const isMobileView = useMobileView();
  const [displayLogin, setDisplayLogin] = useState(false);
  const [displayRegistration, setDisplayRegistration] = useState(false);

  return (
    <div
      className={`flex justify-center h-screen items-center full-bleed ${
        style[`login-background-${isMobileView ? "horizontal" : "vertical"}`]
      }`}
    >
      <div
        className={`w-full max-w-xl flex ${
          isMobileView
            ? "flex-col items-center justify-center gap-16"
            : "flex-row justify-between gap-6"
        }`}
      >
        <button
          className={`${style["button"]} ${style["button__register"]}`}
          onClick={() => {
            setDisplayRegistration(true);
          }}
        >
          {t("register")}
        </button>
        <button
          className={`${style["button"]} ${style["button__login"]}`}
          onClick={() => {
            setDisplayLogin(true);
          }}
        >
          {t("sign_in")}
        </button>
      </div>
      <Login
        translate={t}
        isMobileView={isMobileView}
        show={displayLogin || displayRegistration}
        setShow={() => {
          setDisplayLogin(false);
          setDisplayRegistration(false);
        }}
        register={displayRegistration}
      />
    </div>
  );
};

export default LoginPage;
