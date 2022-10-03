import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TFunction } from "react-i18next";
import {
  logInWithEmailAndPasword,
  signInWithGoogle,
  signUpWithEmailAndPasword,
} from "../../../store/authActions/authActions";
import { useAppDispatch } from "../../../store/hooks";
import { setUser } from "../../../store/reducers/user";
import Modal from "../Shared/Modal/Modal";
import style from "./LoginPage.module.scss";

type Props = {
  translate: TFunction;
  isMobileView: boolean;
  show: boolean;
  setShow: (state: boolean) => void;
  register: boolean;
};

type ValidationObject = {
  path: string[];
  message: string;
  validation: string;
  code: string;
  [key: string]: any;
};

const Login = (props: Props) => {
  const { show, setShow, register, isMobileView, translate } = props;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [validationError, setValidationError] = useState<{
    email: null | ValidationObject;
    password: null | ValidationObject;
  }>({
    email: null,
    password: null,
  });

  useEffect(() => {
    return () => {
      setLoginError("");
      setValidationError({
        email: null,
        password: null,
      });
    };
  }, [show]);

  return (
    <Modal
      animation={
        register
          ? isMobileView
            ? "slide-bottom"
            : "slide-right"
          : isMobileView
          ? "slide-top"
          : "slide-left"
      }
      position={isMobileView ? "center" : register ? "right" : "left"}
      width={isMobileView ? "screen" : "50%"}
      show={show}
      closeModal={() => {
        setShow(false);
      }}
    >
      <div className="h-screen bg-white p-10 page-container relative">
        <div
          className={style["close-button"]}
          onClick={() => {
            setShow(false);
          }}
        />
        <div>
          <div className="font-bold text-xl mb-3">
            {translate(`header_${register ? "register" : "login"}`)}
          </div>
          <form className="rounded m-auto pt-6 pb-8 flex flex-col gap-10">
            <div className="">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="email"
              >
                {translate("email")}
              </label>
              <input
                className={`h-12 appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500 invalid:border-red-500 ${
                  validationError.email && "border-red-500"
                }`}
                pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
                id="email"
                type="text"
                placeholder="email@example.com"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setValidationError({
                    ...validationError,
                    email: null,
                  });
                }}
              />
              {validationError.email && (
                <p className="text-red-500 text-xs italic">
                  {translate(validationError.email.message)}
                </p>
              )}
            </div>
            <div className="">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="password"
              >
                {translate("password")}
              </label>
              <input
                className={`h-12 appearance-none border rounded-md w-full text-gray-700 leading-tight focus:border-blue-500 ${
                  validationError.password && "border-red-500"
                }`}
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={e => {
                  setValidationError({
                    ...validationError,
                    password: null,
                  });
                  setPassword(e.target.value);
                }}
              />
              {validationError.password && (
                <p className="text-red-500 text-xs italic">
                  {translate(validationError.password.message, {
                    minimum_characters: validationError.password.minimum,
                  })}
                </p>
              )}
            </div>
            <div className="text-red-500">{translate(loginError)}</div>
            <div className="flex items-center justify-center gap-5">
              <button
                className="bg-blue-700 h-12 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  setLoginError("");
                  (register
                    ? signUpWithEmailAndPasword(email, password)
                    : logInWithEmailAndPasword(email, password)
                  ).then(
                    (
                      error:
                        | {
                            statusCode: number;
                            message: string;
                            name: undefined;
                            issues: undefined;
                          }
                        | {
                            statusCode: undefined;
                            message: undefined;
                            issues: {
                              [key: string]: {
                                code: string;
                                message: string;
                                path: string[];
                                validation: string;
                              };
                            };
                            name: string;
                          }
                    ) => {
                      if (error) {
                        if (error.message) {
                          setLoginError(error.message);
                        } else {
                          if (error.issues) {
                            const errors = {};
                            Object.values(error.issues).map(issue => {
                              Object.assign(errors, {
                                [issue.path[0]]: issue,
                              });
                            });
                            setValidationError(
                              errors as {
                                email: ValidationObject;
                                password: ValidationObject;
                              }
                            );
                          }
                        }
                      } else {
                        router.push("/apartments");
                      }
                    }
                  );
                }}
              >
                {translate(register ? "register" : "sign_in")}
              </button>
              <div>{translate("OR")}</div>
              <button
                className={`p-6 bg-gray-200 hover:bg-gray-100 rounded focus:outline-none focus:shadow-outline ${style.google}`}
                type="button"
                onClick={() => {
                  setLoginError("");
                  signInWithGoogle().then(res => {
                    console.log(res);

                    if (res && res.id && res.email && res.accessToken) {
                      dispatch(
                        setUser({
                          id: res.id,
                          email: res.email,
                          role: res.accessToken,
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
    </Modal>
  );
};

export default Login;
