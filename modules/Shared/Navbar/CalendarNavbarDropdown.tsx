import { useAppSelector } from '@/store/hooks';
import { useCloseOnClickOutside } from '@modules/Shared/Hooks/useCloseOnClickOutside';
import { Routes } from 'consts';
import Link from 'next/link';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const CalendarNavbarDropdown: FC = () => {
  const { t } = useTranslation('Navbar');
  const apartments = useAppSelector(state => state.apartments);

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
          {Object.entries(apartments.apartments).map(([key, value]) => (
            <Link
              href={{
                pathname: Routes.APARTMENT,
                query: {
                  id: value.id,
                },
              }}
              key={value.id}
              className='rounded p-2 hover:bg-gray-200'
              onClick={() => setShowCalendarSelection(false)}
            >
              {value.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
