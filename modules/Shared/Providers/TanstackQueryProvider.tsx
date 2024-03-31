'use client';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { PropsWithChildren } from 'react';
import 'react-toastify/dist/ReactToastify.css';

const isServer = typeof window === 'undefined';

const persister = createSyncStoragePersister({
  storage: isServer ? null : window?.localStorage,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: 'always',
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 20, // 20 seconds
    },
    mutations: {
      gcTime: 1000 * 60,
    },
  },
});

export const TanstackQueryProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </PersistQueryClientProvider>
  );
};
