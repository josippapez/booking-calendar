import { PublicEventsData } from '@/api';
import { Day } from '@modules/Calendar/CalendarTypes';
import { cltm } from '@modules/Shared/utils';
import { DateTime } from 'luxon';
import { FC } from 'react';

type Props = {
  events: PublicEventsData;
  day: Day;
};

export const PublicCalendarDay: FC<Props> = ({ day, events }) => {
  const yearEvents = events?.[day.year];
  const dayEvents = yearEvents?.[day.date];
  const dayEventsExist = dayEvents && dayEvents.length > 0;

  const startingDay =
    dayEventsExist && !dayEvents.find(event => event.start !== day.date);

  const endingDay =
    dayEventsExist && !dayEvents.find(event => event.end !== day.date);

  //only show current and new reservations
  const dateIsAfterToday = DateTime.fromISO(day.date).diffNow('day').days > -1;

  if (!dayEvents || !dateIsAfterToday) {
    return (
      <div className='relative h-auto min-h-[160px] shadow-[0_-1px_1px_#cbd5e1] hover:border-2 hover:border-t-0 hover:border-blue-300 hover:shadow-[0_-2px_1px_#93C5FD] max-md:min-h-[100px] max-md:w-auto'>
        <div
          className={cltm(
            'flex h-full select-none flex-col overflow-hidden font-semibold',
            day.lastMonth || day.nextMonth
              ? 'font-normal opacity-30'
              : 'opacity-100',
            ['Saturday', 'Sunday'].includes(day.name) && 'opacity-50'
          )}
        >
          <div className='absolute left-0 top-0'>{day.day}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cltm(
        'relative shadow-[0_-1px_1px_#cbd5e1] hover:border-2 hover:border-t-0 hover:border-blue-300 hover:shadow-[0_-2px_1px_#93C5FD]',
        'h-auto min-h-[160px] max-md:min-h-[100px] max-md:w-auto'
      )}
    >
      <div
        className={cltm(
          'flex h-full select-none flex-col overflow-hidden font-semibold',
          day.lastMonth || day.nextMonth
            ? 'font-normal opacity-30'
            : 'opacity-100',
          ['Saturday', 'Sunday'].includes(day.name) && 'opacity-50',
          dayEventsExist && 'text-white',
          startingDay && 'text-black'
        )}
      >
        <div className='absolute left-0 top-0'>{day.day}</div>
        <div
          className={cltm(
            'h-full',
            dayEventsExist && 'bg-gradient-to-r from-[#DC2726] to-[#DC2726]',
            startingDay &&
              'bg-gradient-to-br from-transparent via-transparent via-50% to-[#DC2726] to-50%',
            endingDay &&
              'bg-gradient-to-br from-[#DC2726] from-50% via-transparent via-50% to-transparent'
          )}
        />
      </div>
    </div>
  );
};
