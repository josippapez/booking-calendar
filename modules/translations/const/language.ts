/**
 * @description Constant that defines default language
 */
export const DEFAULT_LANGUAGE = 'en-US';
// TODO: Enable other languages when translations are ready
export const LOCALES = ['hr', 'en-US'] as const;

export type Locale = typeof LOCALES[number];

export const MappedLocales = new Map([
  ["hr", 'hr'],
  ["en-US", 'en-US'],
]);
