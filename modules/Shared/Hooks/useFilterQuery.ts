'use client';

import { debounce } from 'lodash';
import {
  useSearchParams as useNextSearchParams,
  usePathname,
  useRouter,
} from 'next/navigation';
import { useCallback, useMemo } from 'react';

const filterSearchParams = (
  params: URLSearchParams,
  filter: string,
  value: string | number
) => {
  const currentFilterParams = params.getAll(filter);
  let temp = currentFilterParams;
  temp = temp.filter(tempValue => tempValue !== value.toString());
  params.delete(filter);
  if (temp.length) {
    temp.forEach(tempValue => {
      params.append(filter, tempValue);
    });
  }
};

export const handleQueryFilterChange = (
  params: URLSearchParams,
  filter: string,
  value: string | number,
  checked: boolean
) => {
  if (checked) {
    filterSearchParams(params, filter, value);
  } else {
    params.append(filter, value.toString());
  }
};

export const useSearchParams = () => {
  const searchParams = useNextSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  return {
    params,
  };
};

export const useFilterQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const routing = useCallback(
    (replace?: boolean) => {
      const searchParamsString = '?' + params.params.toString();
      if (location.search === searchParamsString) return;
      (replace ? router.replace : router.push)(pathname + searchParamsString, {
        scroll: false,
      });
    },
    [router, pathname, params.params]
  );

  const handleFilterChange = useCallback(
    (filter: string, value: string | number, type?: 'single' | 'array') => {
      if (filter !== 'page') params.params.delete('page');

      if (type === 'single') {
        params.params.set(filter, value.toString());
        routing();
        return;
      }

      if (params.params.getAll(filter).includes(value.toString())) {
        handleQueryFilterChange(params.params, filter, value, true);
      } else {
        handleQueryFilterChange(params.params, filter, value, false);
      }
      routing();
    },
    [routing, params.params]
  );

  const handleFilterRemove = useCallback(
    (filter: string, value?: string | number) => {
      if (!value) {
        params.params.delete(filter);
      } else {
        handleQueryFilterChange(params.params, filter, value, true);
      }
      routing();
    },
    [routing, params.params]
  );

  const handleFilterRemoveAll = useCallback(
    (preventReroute?: boolean) => {
      while (params.params.keys().next().value) {
        params.params.delete(params.params.keys().next().value);
      }

      if (preventReroute) return;
      routing();
    },
    [params.params, routing]
  );

  const debouncedRouting = debounce(routing, 300);

  return {
    handleFilterChange,
    handleFilterRemove,
    handleFilterRemoveAll,
    params: params.params,
    reroute: routing,
    debouncedRouting,
  };
};
