import { Calendar } from '@modules/Calendar/Calendar';
import { countries } from '@modules/translations';
import { unstable_setRequestLocale } from 'next-intl/server';

export default async function ApartmentCalendarPage({
  searchParams,
  params: { locale },
}: {
  searchParams: Record<string, string>;
  params: {
    locale: keyof typeof countries;
  };
}) {
  unstable_setRequestLocale(locale);

  const { id } = searchParams;

  if (!id) {
    throw new Error('No id provided');
  }

  return <Calendar />;
}
