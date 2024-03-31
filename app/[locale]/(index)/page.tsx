import { LoginPage } from '@modules/LoginPage/LoginPage';
import { generateSeo } from '@modules/Shared/generateSeo';
import { countries } from '@modules/translations';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale },
}: {
  params: {
    locale: string;
  };
}) {
  const t = await getTranslations({ locale, namespace: 'LoginPage.Metadata' });

  return generateSeo({
    title: t('title'),
    description: t('description'),
  });
}

export default async function Login({
  searchParams,
  params: { locale },
}: {
  searchParams: Record<string, string>;
  params: {
    locale: keyof typeof countries;
  };
}) {
  return <LoginPage />;
}
