import { Invoice } from '@modules/Invoice/Invoice';
import { Loader } from '@modules/Shared/Loader/Loader';
import { countries } from '@modules/translations';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

export default async function InvoicePage({
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
      <Invoice />
    </Suspense>
  );
}
