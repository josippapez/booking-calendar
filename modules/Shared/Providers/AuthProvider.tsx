'use client';

import {
  useFilterQuery,
  useSearchParams,
} from '@modules/Shared/Hooks/useFilterQuery';
import Cookies from 'js-cookie';
import React, { createContext, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { handleFilterRemove } = useFilterQuery();
  const params = useSearchParams();

  const accessTokenParam = params.params.get('accessToken');
  const refreshTokenParam = params.params.get('refreshToken');

  // listen for token changes
  // call setUser and write new token as a cookie
  useEffect(() => {
    if (accessTokenParam) {
      Cookies.set('accessToken', accessTokenParam, { expires: 14 });
      handleFilterRemove('accessToken');
    }
    if (refreshTokenParam) {
      Cookies.set('refreshToken', refreshTokenParam, { expires: 14 });
      handleFilterRemove('refreshToken');
    }
  }, []);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
