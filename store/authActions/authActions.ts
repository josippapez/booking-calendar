import axios from "axios";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import { parseJwt } from "../../src/interceptor";
import { setUser } from "../reducers/user";
import { persistor, store } from "../store";

export const signUpWithEmailAndPasword = async (
  email: string,
  password: string
) => {
  return axios
    .post("authentication/register", { email, password })
    .then(res => {
      Cookies.set("accessToken", res.data.accessToken, {
        expires: DateTime.fromSeconds(
          parseJwt(res.data.accessToken).exp
        ).toJSDate(),
      });
      Cookies.set("refreshToken", res.data.refreshToken, {
        expires: DateTime.fromSeconds(
          parseJwt(res.data.refreshToken).exp
        ).toJSDate(),
      });
      store.dispatch(setUser(res.data));
    })
    .catch(err => {
      return err.response.data;
    });
};

export const logInWithEmailAndPasword = async (
  email: string,
  password: string
) => {
  return axios
    .post("authentication/login", { email, password })
    .then(res => {
      Cookies.set("accessToken", res.data.accessToken, {
        expires: DateTime.fromSeconds(
          parseJwt(res.data.accessToken).exp
        ).toJSDate(),
      });
      Cookies.set("refreshToken", res.data.refreshToken, {
        expires: DateTime.fromSeconds(
          parseJwt(res.data.refreshToken).exp
        ).toJSDate(),
      });
      store.dispatch(setUser(res.data.user));
    })
    .catch(err => {
      return err.response.data;
    });
};

export const logout = async () => {
  await persistor.purge();
  await persistor.flush();
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};
