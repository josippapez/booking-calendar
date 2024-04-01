import { Apartments } from '@modules/Apartments/Apartments';
import { countries } from '@modules/translations';
import { unstable_setRequestLocale } from 'next-intl/server';

export default function ApartmentsPage({
  searchParams,
  params: { locale },
}: {
  searchParams: Record<string, string>;
  params: {
    locale: keyof typeof countries;
  };
}) {
  unstable_setRequestLocale(locale);
  return <Apartments />;
}
