'use client';

import { AuthProvider } from '@modules/Shared/Providers/AuthProvider';
import { TanstackQueryProvider } from '@modules/Shared/Providers/TanstackQueryProvider';
import { cn } from '@/lib/utils';
import Error from '@public/Styles/Assets/Images/error.svg';
import Info from '@public/Styles/Assets/Images/info.svg';
import Success from '@public/Styles/Assets/Images/success.svg';
import Warning from '@public/Styles/Assets/Images/warning.svg';
import { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <TanstackQueryProvider>
      <AuthProvider>
        {children}
        <ToastContainer
          position='bottom-right'
          icon={({ type }) => {
            switch (type) {
              case 'success':
                return (
                  <Success className='!h-[24px] !min-h-[24px] !w-[24px] !min-w-[24px]' />
                );
              case 'warning':
                return (
                  <Warning className='!h-[24px] !min-h-[24px] !w-[24px] !min-w-[24px]' />
                );
              case 'error':
                return (
                  <Error className='!h-[24px] !min-h-[24px] !w-[24px] !min-w-[24px]' />
                );
              case 'info':
                return (
                  <Info className='!h-[24px] !min-h-[24px] !w-[24px] !min-w-[24px] text-info' />
                );
              default:
                return null;
            }
          }}
          hideProgressBar
          className={context => cn(context?.defaultClassName, 'grid gap-5')}
          autoClose={5000}
          toastClassName={context =>
            cn(
              "grid text-black grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-2xl bg-white py-3 px-4 shadow-[0_4px_16px_0_rgba(0,0,0,0.08)] [grid-template-areas:_'title_action'_'description_action']",
              context?.type === 'success' && 'bg-success-light',
              context?.type === 'warning' && 'bg-warning-light',
              context?.type === 'error' && 'bg-error-light',
              context?.type === 'info' && 'bg-info-light'
            )
          }
          bodyClassName='gap-2'
        />
      </AuthProvider>
    </TanstackQueryProvider>
  );
};
