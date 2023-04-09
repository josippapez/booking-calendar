import { Day, Event } from '@modules/Calendar';
import { DatePickerDates, DatePickerHeader } from '@modules/Shared/DatePicker';
import { useCalculateEachDayOfMonth } from '@modules/Shared/Hooks';
import { Modal } from '@modules/Shared/Modal/Modal';
import { DateTime, Interval } from 'luxon';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Events } from '@/store/reducers/events';
import style from './DateRangePicker.module.scss';

type Props = {
  showDateRangePicker: boolean;
  setShowDateRangePicker: (state: boolean) => void;
  event: Event;
  setEvent: (event: Event) => void;
  disableForCurrentReservations?: boolean;
  currentReservations?: Events;
};

export const DateRangePicker: FC<Props> = ({
  showDateRangePicker,
  setShowDateRangePicker,
  setEvent,
  event,
  currentReservations,
  disableForCurrentReservations,
}) => {
  const { t } = useTranslation('DateRangePicker');

  const eachDayOfMonth = useCalculateEachDayOfMonth({
    startYear: DateTime.local().year,
    startMonth: DateTime.local().month,
  });

  const { month, year, setmonth, setyear } = eachDayOfMonth;

  const [currentDate, setCurrentDate] = useState('');

  const displayDateRangeDays = (day: Day, index: number) => {
    const isToday = DateTime.local().hasSame(DateTime.fromISO(day.date), 'day');
    const disabled =
      disableForCurrentReservations &&
      (DateTime.fromISO(day.date).diffNow('day').days < -1 ||
        (currentReservations &&
          currentReservations[day.year] &&
          currentReservations[day.year][day.date]?.length > 0 &&
          (currentReservations[day.year][day.date]?.length >= 2
            ? currentReservations[day.year][day.date].map(reservation => {
                const start = DateTime.fromISO(reservation.start);
                const end = DateTime.fromISO(reservation.end);
                const interval = Interval.fromDateTimes(start, end);
                return interval.contains(DateTime.fromISO(day.date));
              })
            : currentReservations[day.year][day.date][0].end !== day.date &&
              currentReservations[day.year][day.date][0].start !== day.date)));

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
          if (
            currentReservations[firsDayYear] &&
            currentReservations[secondDayYear] &&
            currentReservations[firsDayYear][date[0]]?.length &&
            currentReservations[secondDayYear][date[1]]?.length
          ) {
            if (
              currentReservations[firsDayYear][date[0]]?.length >= 2 &&
              currentReservations[secondDayYear][date[1]]?.length >= 2
            ) {
              return true;
            }

            return (
              currentReservations[firsDayYear][date[0]][0].start === date[0] ||
              currentReservations[secondDayYear][date[1]][0].end === date[1]
            );
          }
          return undefined;
        });
    }

    return (
      <div
        key={index}
        onMouseOver={() => {
          if (event.start) {
            setCurrentDate(day.date);
          }
        }}
        onTouchStart={() => {
          if (event.start) {
            setCurrentDate(day.date);
          }
        }}
        className={`cursor-pointer
        ${style['dateRange-Day']} select-none font-bold
        ${isToday && 'border-2 border-blue-500'}
        ${
          ['Saturday', 'Sunday'].includes(day.name)
            ? 'bg-opacity-60 text-neutral-500'
            : day.lastMonth
            ? 'font-normal opacity-30'
            : ''
        }
        ${event.start === day.date && 'rounded-l-full !bg-sky-600 text-white'}
        ${event.end === day.date && 'rounded-r-full !bg-sky-600 text-white'}
        ${
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
            : 'bg-white'
        }
        ${
          disabled
            ? 'cursor-not-allowed opacity-10'
            : 'hover:bg-sky-300 hover:text-white'
        }
        ${selectedDaysContainDisabled?.length && 'cursor-not-allowed'}`}
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
      </div>
    );
  };

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
