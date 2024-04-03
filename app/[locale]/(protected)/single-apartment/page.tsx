import { Calendar } from '@modules/Calendar/Calendar';
import { Loader } from '@modules/Shared/Loader/Loader';
import { countries } from '@modules/translations';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

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

  return (
    <Suspense fallback={<Loader isLoading />}>
      <Calendar />
    </Suspense>
  );
}
