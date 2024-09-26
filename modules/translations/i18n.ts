import { DEFAULT_LANGUAGE, MappedLocales } from '@modules/translations/const';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  let translations;

  const language = MappedLocales.get(locale) ?? DEFAULT_LANGUAGE;

  try {
    translations = await import(`@public/translations/${language}.json`).then(
      (module) => module.default,
    );
  } catch (error) {
    translations = await import(`@public/translations/en-US.json`).then(
      (module) => module.default,
    );
  }

  return {
    messages: translations,
  };
});
