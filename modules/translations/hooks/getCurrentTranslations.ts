import { countries } from '@modules/translations/const';

export async function getCurrentTranslations(locale: string | undefined) {
  let translations;

  if (!locale) return;

  const language = (
    countries[locale] || countries['en-US']
  ).language.toLowerCase();

  try {
    translations = await import(`@public/translations/${language}.json`).then(
      (module) => module.default,
    );
  } catch (error) {
    translations = await import(`@public/translations/en-US.json`).then(
      (module) => module.default,
    );
  }

  return translations;
}
