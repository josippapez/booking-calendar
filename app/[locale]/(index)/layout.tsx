import { DEFAULT_LANGUAGE, LOCALES } from '@modules/translations';
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale = DEFAULT_LANGUAGE },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!LOCALES.includes(locale as any)) notFound();

  unstable_setRequestLocale(locale);
  return <>{children}</>;
}
