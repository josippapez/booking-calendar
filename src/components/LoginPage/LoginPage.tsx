import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  signInEmailAndPassword,
  signInWithGoogle,
} from "../../../store/firebaseActions/authActions";
import { useAppDispatch } from "../../../store/hooks";
import { setUser } from "../../../store/reducers/user";
import style from "./LoginPage.module.scss";

type Props = {};

const LoginPage: NextPage = (props: Props) => {
  const { t } = useTranslation("LoginPage");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  return (
    <div className="flex justify-center h-screen items-center">
      <div className="w-full max-w-xs">
        <div className="font-bold text-xl mb-3">{t("header")}</div>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              {t("email")}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="email@example.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              {t("password")}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="text-red-500 mb-6">{t(loginError)}</div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => {
                setLoginError("");
                signInEmailAndPassword(email, password).then(
                  (error: string | undefined) => {
                    if (error) {
                      setLoginError(error);
                    } else {
                      router.push("/apartments");
                    }
                  }
                );
              }}
            >
              {t("sign_in")}
            </button>
          </div>
          <div className="flex items-center justify-evenly">
            <button
              className={`p-6 mt-4 bg-gray-200 hover:bg-gray-100 rounded focus:outline-none focus:shadow-outline ${style.google}`}
              type="button"
              onClick={() => {
                setLoginError("");
                signInWithGoogle().then(res => {
                  if (res && res.id && res.email && res.accessToken) {
                    dispatch(
                      setUser({
                        id: res.id,
                        email: res.email,
                        accessToken: res.accessToken,
                      })
                    );
                    router.push("/apartments");
                  }
                });
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
