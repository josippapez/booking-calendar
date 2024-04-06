import { EventObject, PublicEventsData } from '@/api';
import { Day } from '@modules/Calendar/CalendarTypes';
import { DatePickerDates } from '@modules/Shared/DatePicker/Dates/DatePickerDates';
import { DatePickerHeader } from '@modules/Shared/DatePicker/Header/DatePickerHeader';
import { useCalculateEachDayOfMonth } from '@modules/Shared/Hooks/calculateEachDayOfMonth';
import { Modal } from '@modules/Shared/Modal/Modal';
import { cltm } from '@modules/Shared/utils';
import { DateTime, Interval } from 'luxon';
import { useTranslations } from 'next-intl';
import { FC, useCallback, useState } from 'react';
import style from './DateRangePicker.module.scss';

type Props = {
  showDateRangePicker: boolean;
  setShowDateRangePicker: (state: boolean) => void;
  event: EventObject;
  setEvent: (event: EventObject) => void;
  disableForCurrentReservations?: boolean;
  currentReservations?: PublicEventsData;
};

export const DateRangePicker: FC<Props> = ({
  showDateRangePicker,
  setShowDateRangePicker,
  setEvent,
  event,
  currentReservations,
  disableForCurrentReservations,
}) => {
  const t = useTranslations('DateRangePicker');

  const eventStartingDate = event.start ? DateTime.fromISO(event.start) : null;
  const startYear = eventStartingDate?.year ?? DateTime.local().year;
  const startMonth = eventStartingDate?.month ?? DateTime.local().month;
  const eachDayOfMonth = useCalculateEachDayOfMonth({
    startYear: startYear,
    startMonth: startMonth,
  });

  const { month, year, setmonth, setyear } = eachDayOfMonth;

  const [currentDate, setCurrentDate] = useState('');

  const displayDateRangeDays = useCallback(
    (day: Day, index: number) => {
      const isToday = DateTime.local().hasSame(
        DateTime.fromISO(day.date),
        'day'
      );
      const currentReservationForYearDate =
        currentReservations?.[day.year]?.[day.date];
      const disabled =
        disableForCurrentReservations &&
        (DateTime.fromISO(day.date).diffNow('day').days < -1 ||
          (currentReservationForYearDate &&
            currentReservationForYearDate.length > 0 &&
            (currentReservationForYearDate.length >= 2
              ? currentReservationForYearDate.map(reservation => {
                  const start = DateTime.fromISO(reservation.start);
                  const end = DateTime.fromISO(reservation.end);
                  const interval = Interval.fromDateTimes(start, end);
                  return interval.contains(DateTime.fromISO(day.date));
                })
              : currentReservationForYearDate[0].end !== day.date &&
                currentReservationForYearDate[0].start !== day.date)));

      let selectedDaysContainDisabled: string[] | undefined = [];
      if (currentDate && currentReservations && event.start && !event.end) {
        selectedDaysContainDisabled = Interval.fromDateTimes(
          DateTime.fromISO(event.start),
          DateTime.fromISO(currentDate)
        )
          .splitBy({ days: 1 })
          .map(day => day.toISODate().split('/'))
          .find((date, index) => {
            const firsDayYear = date[0].split('-')[0];
            const secondDayYear = date[1].split('-')[0];
            const reservationFirstDay =
              currentReservations[firsDayYear]?.[date[0]];
            const reservationSecondDay =
              currentReservations[secondDayYear]?.[date[1]];
            if (
              reservationFirstDay &&
              reservationSecondDay &&
              reservationFirstDay?.length &&
              reservationSecondDay.length
            ) {
              if (
                reservationFirstDay?.length >= 2 &&
                reservationSecondDay?.length >= 2
              ) {
                return true;
              }

              return (
                reservationFirstDay[0].start === date[0] ||
                reservationSecondDay[0].end === date[1]
              );
            }
            return undefined;
          });
      }

      return (
        <button
          key={index}
          onMouseOver={() => {
            if (event.start) {
              setCurrentDate(day.date);
            }
          }}
          onFocus={() => {
            if (event.start) {
              setCurrentDate(day.date);
            }
          }}
          onTouchStart={() => {
            if (event.start) {
              setCurrentDate(day.date);
            }
          }}
          className={cltm(
            'cursor-pointer',
            style['dateRange-Day'],
            'select-none font-bold',
            isToday && 'border-2 border-blue-500',
            ['Saturday', 'Sunday'].includes(day.name)
              ? 'bg-opacity-60 text-neutral-500'
              : day.lastMonth || day.nextMonth
              ? 'font-normal opacity-60'
              : '',
            event.start === day.date && 'rounded-l-full !bg-sky-600 text-white',
            event.end === day.date && 'rounded-r-full !bg-sky-600 text-white',
            event.start && event.end && !disabled
              ? Interval.fromDateTimes(
                  DateTime.fromISO(event.start),
                  DateTime.fromISO(event.end).plus({ days: 1 })
                ).contains(DateTime.fromISO(day.date))
                ? 'bg-sky-300 !text-white'
                : 'bg-white'
              : !disabled &&
                currentDate &&
                Interval.fromDateTimes(
                  DateTime.fromISO(event.start),
                  DateTime.fromISO(currentDate).plus({ days: 1 })
                ).contains(DateTime.fromISO(day.date))
              ? 'bg-sky-200'
              : 'bg-white',
            disabled
              ? 'disabled: opacity-10 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-inherit'
              : 'hover:bg-sky-300 hover:text-white',
            selectedDaysContainDisabled?.length && 'cursor-not-allowed'
          )}
          disabled={Boolean(disabled)}
          onMouseUp={() => {
            if (!disabled) {
              if (event.start && event.end) {
                setEvent({
                  ...event,
                  start: day.date,
                  end: '',
                });
                return;
              }
              if (!event.start) {
                setEvent({
                  ...event,
                  start: day.date,
                });
                return;
              }
              if (event.start) {
                if (
                  event.start === day.date ||
                  selectedDaysContainDisabled?.length
                ) {
                  return;
                }
                if (
                  DateTime.fromISO(event.start).diff(
                    DateTime.fromISO(day.date),
                    'days'
                  ).days > 0
                ) {
                  setEvent({
                    ...event,
                    start: day.date,
                  });
                  return;
                }
                setEvent({
                  ...event,
                  end: day.date,
                });
              }
            }
          }}
        >
          {day.day}
        </button>
      );
    },
    [
      currentDate,
      currentReservations,
      disableForCurrentReservations,
      event,
      setEvent,
    ]
  );

  return (
    <Modal
      animation='fade'
      show={showDateRangePicker}
      closeModal={() => setShowDateRangePicker(false)}
    >
      <div className='relative rounded-md bg-white p-4'>
        <DatePickerHeader
          hideOnlyYearButton
          selectedMonth={month}
          selectedYear={year}
          setSelectedMonth={setmonth}
          setSelectedYear={setyear}
        />
        <div className={`${style.dateRangeGrid} my-4`}>
          <DatePickerDates
            showNextMonth
            dates={eachDayOfMonth}
            customDisplayDate={displayDateRangeDays}
          />
        </div>
        <div className='flex justify-end'>
          <button
            className='rounded px-4 py-2 font-bold hover:bg-slate-200'
            onClick={() => {
              setShowDateRangePicker(false);
              setEvent({ ...event, start: '', end: '' });
            }}
          >
            {t('cancel')}
          </button>
          <button
            className='rounded px-4 py-2 font-bold hover:bg-slate-200'
            onClick={() => {
              setEvent({
                ...event,
                start: '',
                end: '',
              });
            }}
          >
            {t('clear')}
          </button>
          <button
            className='rounded px-4 py-2 font-bold hover:bg-slate-200'
            onClick={() => {
              setShowDateRangePicker(false);
              setEvent({
                ...event,
                start: event.start,
                end: event.end,
              });
            }}
          >
            {t('done')}
          </button>
        </div>
      </div>
    </Modal>
  );
};
