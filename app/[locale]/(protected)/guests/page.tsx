import { Guests } from '@modules/Guests/Guests';
import { Loader } from '@modules/Shared/Loader/Loader';
import { countries } from '@modules/translations';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

export default async function GuestsPage({
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
      <Guests />
    </Suspense>
  );
}
