import axios from "axios";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect } from "react";
import { logout } from "../store/authActions/authActions";
import { useAppSelector } from "../store/hooks";
import { parseJwt } from "./interceptor";

const AuthContext = createContext<{
  user: null | { id: string; email: string; role: string };
}>({
  user: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: any) {
  const router = useRouter();
  const user = useAppSelector(state => state.user.user);

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Cookies.get("accessToken");
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_BE_API_URL;
  }, [user, Cookies.get()]);

  const refreshTokenIfNeeded = async () => {
    if (
      !Cookies.get("accessToken") ||
      Cookies.get("accessToken") === "undefined"
    ) {
      if (Cookies.get("refreshToken")) {
        await axios
          .get(`/authentication/refresh`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("refreshToken")}`,
            },
          })
          .then(res => {
            Cookies.set("accessToken", res.data.accessToken, {
              expires: DateTime.fromSeconds(
                parseJwt(res.data.accessToken).exp
              ).toJSDate(),
            });
          })
          .catch(async err => {
            await logout();
            router.push("/");
          });
      }
    }
  };

  useEffect(() => {
    refreshTokenIfNeeded();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
