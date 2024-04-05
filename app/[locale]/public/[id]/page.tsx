import { PublicEventsResponse } from '@/api';
import { PublicCalendar } from '@modules/PublicCalendar/PublicCalendar';
import { generateSeo } from '@modules/Shared/generateSeo';
import { countries } from '@modules/translations';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params: { locale, id },
}: {
  params: {
    locale: string;
    id: string;
  };
}) {
  const t = await getTranslations({
    locale,
    namespace: 'PublicCalendar.Metadata',
  });

  const data: PublicEventsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BE_API_URL}/publicEvents/${id}?month=${new Date()
      .getMonth()
      .toString()}&year=${new Date().getFullYear().toString()}`,
    {
      next: {
        tags: [`public-calendar-${id}`],
      },
    }
  ).then(res => res.json());

  return generateSeo({
    title: t('title', {
      name: data.apartmentName,
    }),
    description: t('description', {
      name: data.apartmentName,
    }),
  });
}

export default async function PublicCalendarPage({
  searchParams,
  params: { locale, id },
}: {
  searchParams: Record<string, string>;
  params: {
    locale: keyof typeof countries;
    id: string;
  };
}) {
  const data: PublicEventsResponse & {
    statusCode: number;
  } = await fetch(
    `${process.env.NEXT_PUBLIC_BE_API_URL}/publicEvents/${id}?month=${new Date()
      .getMonth()
      .toString()}&year=${new Date().getFullYear().toString()}`,
    {
      next: {
        tags: [`public-calendar-${id}`],
      },
    }
  ).then(res => res.json());

  if (data.statusCode === 404 || data.statusCode === 500) {
    notFound();
  }

  const { apartmentEmail, apartmentLogo, apartmentName, events } = data;

  return (
    <PublicCalendar
      apartmentEmail={apartmentEmail}
      apartmentLogo={apartmentLogo}
      apartmentName={apartmentName}
      publicEvents={events}
    />
  );
}
