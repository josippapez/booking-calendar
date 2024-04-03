'use client';

import { AuthProvider } from '@modules/Shared/Providers/AuthProvider';
import { TanstackQueryProvider } from '@modules/Shared/Providers/TanstackQueryProvider';
import { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <TanstackQueryProvider>
      <AuthProvider>
        {children}
        <ToastContainer />
      </AuthProvider>
    </TanstackQueryProvider>
  );
};
