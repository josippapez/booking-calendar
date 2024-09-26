'use client';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { PropsWithChildren } from 'react';

const isServer = typeof window === 'undefined';
const persister = createSyncStoragePersister({
  storage: isServer ? null : window?.localStorage,
});

// remove queryMounted information on first render
const storage = !isServer ? localStorage : null;
storage?.removeItem('queryMounted');

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount(query) {
        const queryMounted: Record<string, boolean> = JSON.parse(
          storage?.getItem('queryMounted') ?? '{}'
        );

        // on first mount invalidate the query (refetch the data)
        if (!queryMounted[query.queryHash]) {
          // Mark the query as mounted
          storage?.setItem(
            'queryMounted',
            JSON.stringify({ ...queryMounted, [query.queryHash]: true })
          );

          query.invalidate();
        }

        return true;
      },
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
