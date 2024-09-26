import { Locale } from "@modules/translations/const/language";
import { useLocale } from "next-intl";
import enUS from "public/translations/en-US.json";
import hr from "public/translations/hr.json";

type Messages = typeof enUS & typeof hr;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}

declare module "next-intl" {
  function useLocale(): Locale;

  export { useLocale };
}
