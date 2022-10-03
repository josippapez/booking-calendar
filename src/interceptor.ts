import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import { logout } from "../store/authActions/authActions";

let subscribers: Function[] = [];
let isAlreadyFetchingAccessToken = false;

export const addSubscriber = (callback: Function) => {
  subscribers.push(callback);
};

export function parseJwt(token: string | undefined) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

export const refreshAuthentication = async () => {
  return await axios
    .get("authentication/refresh", {
      headers: {
        Authorization: `Bearer ${Cookies.get("refreshToken")}`,
      },
    })
    .then(response => {
      Cookies.set("accessToken", response.data, {
        expires: DateTime.fromSeconds(parseJwt(response.data).exp).toJSDate(),
      });
      return response;
    })
    .catch(error => error);
};

export const onAccessTokenFetched = () => {
  subscribers.forEach(callback => {
    callback();
  });
  subscribers = [];
};

export const refreshAccessTokenAndReattemptRequest = async (
  error: AxiosError,
  refreshToken: {
    iat: number;
    exp: number;
  }
) => {
  try {
    const { config } = error;
    if (!refreshToken) {
      return Promise.reject(error);
    }
    const originalRequest = new Promise(resolve => {
      addSubscriber(() => {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${Cookies.get("accessToken")}`;
        resolve(axios(config));
      });
    });
    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
      const response = await refreshAuthentication();
      if (response.status !== 200) await logout();
      if (!response.data) return Promise.reject(error);
      Cookies.set("accessToken", response.data, {
        expires: DateTime.fromSeconds(parseJwt(response.data).exp).toJSDate(),
      });
      const accessTokenExpiration = parseJwt(response.data).exp;
      if (
        !accessTokenExpiration ||
        accessTokenExpiration.exp <= DateTime.utc().toUnixInteger()
      ) {
        await logout();
      }
      onAccessTokenFetched();
      isAlreadyFetchingAccessToken = false;
    }
    return originalRequest;
  } catch (err) {
    await logout();
    return Promise.reject(err);
  }
};

export const intercept = () => {
  axios.interceptors.request.use(
    request => {
      const refreshTokenExpiration = parseJwt(Cookies.get("refreshToken"));
      if (
        refreshTokenExpiration &&
        refreshTokenExpiration.exp <= DateTime.utc().toUnixInteger()
      ) {
        logout();
      }
      return request;
    },
    error => {
      const accessTokenExpiration = parseJwt(Cookies.get("accessToken"));
      const refreshTokenExpiration = parseJwt(Cookies.get("refreshToken"));
      if (
        !refreshTokenExpiration ||
        (refreshTokenExpiration &&
          refreshTokenExpiration.exp <= DateTime.utc().toUnixInteger())
      ) {
        logout();
      }
      if (
        !Cookies.get("accessToken") ||
        (accessTokenExpiration &&
          accessTokenExpiration.exp <= DateTime.utc().toUnixInteger())
      ) {
        return refreshAccessTokenAndReattemptRequest(
          error,
          refreshTokenExpiration
        );
      }
      Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (!Cookies.get("accessToken") && Cookies.get("refreshToken")) {
        const refreshTokenExpiration = parseJwt(Cookies.get("refreshToken"));
        return refreshAccessTokenAndReattemptRequest(
          error,
          refreshTokenExpiration
        );
      }
      if (!Cookies.get("accessToken") && !Cookies.get("refreshToken")) {
        logout();
      }
      return Promise.reject(error);
    }
  );
};
