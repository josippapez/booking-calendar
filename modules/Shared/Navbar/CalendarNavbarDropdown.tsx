import { useApartmentsControllerFindAll } from '@/api';
import { useCloseOnClickOutside } from '@modules/Shared/Hooks/useCloseOnClickOutside';
import { Routes } from 'consts';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC, useRef, useState } from 'react';

export const CalendarNavbarDropdown: FC = () => {
  const t = useTranslations('Navbar');

  const { data: apartments } = useApartmentsControllerFindAll({
    query: {
      queryKey: ['apartments'],
    },
  });

  const calendarNavbarDropdownRef = useRef(null);
  const [showCalendarSelection, setShowCalendarSelection] = useState(false);

  useCloseOnClickOutside(calendarNavbarDropdownRef, () =>
    setShowCalendarSelection(false)
  );
  return (
    <div className='relative' ref={calendarNavbarDropdownRef}>
      <button
        className='block rounded bg-blue-700 py-2 pl-3 pr-4 text-white dark:text-white md:bg-transparent md:p-0 md:text-blue-700'
        onClick={() => setShowCalendarSelection(!showCalendarSelection)}
      >
        {t('calendar')}
      </button>
      {showCalendarSelection && (
        <div className='absolute top-5 flex w-max flex-col gap-2 rounded-md border border-gray-200 bg-white p-2 text-base drop-shadow'>
          {apartments?.map(apartment => (
            <Link
              href={{
                pathname: Routes.APARTMENT,
                query: {
                  id: apartment.id,
                },
              }}
              key={apartment.id}
              className='rounded p-2 hover:bg-gray-200'
              onClick={() => setShowCalendarSelection(false)}
            >
              {apartment.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
