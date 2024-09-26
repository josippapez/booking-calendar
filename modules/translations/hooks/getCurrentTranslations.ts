import { DEFAULT_LANGUAGE, Locale, MappedLocales } from '@modules/translations/const';

export async function getCurrentTranslations(locale: Locale | undefined) {
  let translations;

  if (!locale) return;

  const language = MappedLocales.get(locale) ?? DEFAULT_LANGUAGE;

  try {
    translations = await import(`@public/translations/${language}.json`).then(
      module => module.default
    );
  } catch (error) {
    translations = await import(`@public/translations/en-US.json`).then(
      module => module.default
    );
  }

  return translations;
}
