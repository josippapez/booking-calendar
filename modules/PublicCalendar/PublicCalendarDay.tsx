import { Events } from '@/store/reducers/events';
import { Day } from '@modules/Calendar/CalendarTypes';
import { useMobileView } from '@modules/Shared/Hooks/useMobileView';
import { DateTime } from 'luxon';
import { FC } from 'react';
import style from './PublicCalendar.module.scss';

type Props = {
  events: Events;
  day: Day;
};

export const PublicCalendarDay: FC<Props> = ({ day, events }) => {
  const mobileView = useMobileView();

  const dayIsDifferentMonth =
    day.lastMonth || day.nextMonth ? 'font-normal opacity-30' : 'opacity-100';

  const dayIsWeekendOrDifferentMonth = ['Saturday', 'Sunday'].includes(day.name)
    ? 'opacity-50'
    : dayIsDifferentMonth;

  const dayEventsExist =
    events?.[day.year] && events[day.year][day.date]?.length > 0;

  const startingDay =
    dayEventsExist &&
    !events[day.year][day.date].find(event => event.start !== day.date);

  const endingDay =
    dayEventsExist &&
    !events[day.year][day.date].find(event => event.end !== day.date);

  //only show current and new reservations
  const dateIsAfterToday = DateTime.fromISO(day.date).diffNow('day').days > -1;

  if (!events || dateIsAfterToday) {
    return (
      <div
        className={`relative shadow-[0_-1px_1px_#cbd5e1]
      hover:border-2 hover:border-t-0 hover:border-blue-300 hover:shadow-[0_-2px_1px_#93C5FD] ${
        mobileView ? style.mobileGridItem : style.gridItem
      }`}
      >
        <div
          className={`flex h-full select-none flex-col overflow-hidden
        font-semibold ${dayIsWeekendOrDifferentMonth}`}
        >
          <div className='absolute left-0 top-0'>{day.day}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative shadow-[0_-1px_1px_#cbd5e1]
      hover:border-2 hover:border-t-0 hover:border-blue-300 hover:shadow-[0_-2px_1px_#93C5FD] ${
        mobileView ? style.mobileGridItem : style.gridItem
      }`}
    >
      <div
        className={`flex h-full select-none flex-col overflow-hidden
        font-semibold ${dayIsWeekendOrDifferentMonth} ${
          dayEventsExist && 'text-white'
        } ${startingDay && '!text-black'}`}
      >
        <div className='absolute left-0 top-0'>{day.day}</div>
        <div
          className={`h-full ${dayEventsExist && 'bg-red-600'}
          `}
          style={{
            background: startingDay
              ? 'linear-gradient(to right bottom, transparent 50%, #DC2726 50.3%)'
              : endingDay
              ? 'linear-gradient(to right bottom, #DC2726 50%, transparent 50.3%)'
              : '',
          }}
        />
      </div>
    </div>
  );
};
