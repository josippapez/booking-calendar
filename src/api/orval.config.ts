import { defineConfig } from 'orval';

const defaultQueryOverride = {
  useQuery: true,
  signal: true,
  useSuspenseQuery: true,
};

export default defineConfig({
  backOffice: {
    input: {
      target: './openapi.json',
      filters: {
        // match all strings that don't contain healthcheck
        //@ts-ignore-next-line
        tags: [/^(?!.*healthcheck).*$/],
      },
    },
    output: {
      clean: true,
      mode: 'tags-split',
      target: './openapi-config',
      schemas: './openapi-schemas',
      workspace: './',
      indexFiles: true,
      client: 'react-query',
      prettier: true,
      mock: false,
      allParamsOptional: true,
      override: {
        query: {
          useQuery: true,
          signal: true,
          useSuspenseQuery: true,
        },
        operations: {},
        mutator: {
          path: './custom-client.ts',
          name: 'customClient',
        },
      },
    },
  },
});
