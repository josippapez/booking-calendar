import { generateSeo } from '@modules/Shared/generateSeo';
import { DEFAULT_LANGUAGE, LOCALES } from '@modules/translations';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'Apartments.Metadata' });

  return generateSeo({
    title: t('title'),
    description: t('description'),
  });
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
  return <Suspense>{children}</Suspense>;
}
