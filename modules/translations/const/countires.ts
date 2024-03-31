export type Locale = {
  translationLanguage?: string;
  language: string;
  country: string;
  label: string;
  host?: string;
  pathPrefix?: string;
};
export const countries: Record<string, Locale> = {
  hr: {
    language: 'HR',
    country: 'HR',
    label: 'croatia', // Labels to be shown in the country selector
    pathPrefix: '/hr', // The path prefix for the country
  },
  'en-US': {
    translationLanguage: 'US',
    language: 'EN',
    country: 'US',
    label: 'unitedStates',
    pathPrefix: '/us',
  },
};

export const getCountryVariables = (locale: string) => {
  return {
    country: countries[locale].country,
    language: countries[locale].language,
  };
};
