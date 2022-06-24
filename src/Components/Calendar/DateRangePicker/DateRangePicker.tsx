import { DateTime, Interval } from 'luxon';
import { useEffect, useState } from 'react';
import calculateEachDayOfMonth from '../../../Hooks/calculateEachDayOfMonth';
import Modal from '../../Shared/Modal/Modal';
import { Day, Event } from '../CalendarTypes';
import style from './DateRangePicker.module.scss';

type Props = {
  showDateRangePicker: boolean;
  setShowDateRangePicker: (state: boolean) => void;
  event: Event;
  setEvent: (event: Event) => void;
};

const DateRangePicker = (props: Props) => {
  const { showDateRangePicker, setShowDateRangePicker, setEvent, event } =
    props;

  const [selectedYear, setSelectedYear] = useState<number>(
    DateTime.local().year
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    DateTime.local().month
  );

  const eachDayOfMonth = calculateEachDayOfMonth({
    year: selectedYear,
    month: selectedMonth,
  }).dates;
  const eachDayOfNextMonth = calculateEachDayOfMonth({
    year: selectedMonth + 1 === 13 ? selectedYear + 1 : selectedYear,
    month: selectedMonth + 1 === 13 ? 1 : selectedMonth + 1,
  }).dates;

  const [currentDate, setCurrentDate] = useState('');

  const displayDateRangeDays = (day: Day, index: number) => {
    return (
      <div
        key={index}
        onMouseOver={() => {
          if (event.start) {
            setCurrentDate(day.date);
          }
        }}
        className={`rounded-full
              border-2 hover:border-blue-400 ${
                style['dateRange-Day']
              } font-bold select-none ${
          ['Saturday', 'Sunday'].includes(day.name)
            ? 'opacity-50'
            : day.lastMonth
            ? 'opacity-30 font-normal'
            : 'opacity-100'
        } ${
          event.start && event.end
            ? Interval.fromDateTimes(
                DateTime.fromISO(event.start),
                DateTime.fromISO(event.end).plus({ days: 1 })
              ).contains(DateTime.fromISO(day.date))
              ? 'bg-purple-400 text-white'
              : 'bg-white'
            : currentDate &&
              Interval.fromDateTimes(
                DateTime.fromISO(event.start),
                DateTime.fromISO(currentDate).plus({ days: 1 })
              ).contains(DateTime.fromISO(day.date))
            ? 'bg-purple-200'
            : 'bg-white'
        }`}
        onClick={() => {
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
            if (event.start === day.date) {
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
        }}
      >
        {day.day}
      </div>
    );
  };

  const daysHeader = () => {
    return (
      <div className={style.calendarGridHeader}>
        <div className={`${style.dayName} select-none font-bold`}>Mon</div>
        <div className={`${style.dayName} select-none font-bold`}>Tue</div>
        <div className={`${style.dayName} select-none font-bold`}>Wed</div>
        <div className={`${style.dayName} select-none font-bold`}>Thu</div>
        <div className={`${style.dayName} select-none font-bold`}>Fri</div>
        <div className={`${style.dayName} select-none font-bold`}>Sat</div>
        <div className={`${style.dayName} select-none font-bold`}>Sun</div>
      </div>
    );
  };

  return (
    <Modal
      animation='fade'
      show={showDateRangePicker}
      closeModal={() => setShowDateRangePicker(false)}
    >
      <div className='p-4 bg-white rounded-md relative'>
        <div className='flex justify-center select-none gap-3'>
          <div className='flex items-center border-2 w-fit rounded-md'>
            <button
              onClick={() => {
                if (selectedMonth === 1) {
                  setSelectedMonth(12);
                  setSelectedYear(selectedYear - 1);
                  return;
                }
                setSelectedMonth(selectedMonth - 1);
              }}
              className='bg-gray-200 hover:bg-gray-300 font-bold py-1 px-3'
            >
              {'<'}
            </button>
            <h2 className='w-fit px-5 min-w-[70px] text-center select-none font-bold'>
              {selectedMonth}
            </h2>
            <button
              onClick={() => {
                if (selectedMonth === 12) {
                  setSelectedMonth(1);
                  setSelectedYear(selectedYear + 1);
                  return;
                }
                setSelectedMonth(selectedMonth + 1);
              }}
              className='bg-gray-200 hover:bg-gray-300 font-bold py-1 px-3'
            >
              {'>'}
            </button>
          </div>
          <div className='flex items-center border-2 w-fit rounded-md'>
            <button
              onClick={() => {
                setSelectedYear(selectedYear - 1);
              }}
              className='bg-gray-200 hover:bg-gray-300 font-bold py-1 px-3'
            >
              {'<'}
            </button>
            <h2 className='w-fit px-5 min-w-[70px] text-center select-none font-bold'>
              {selectedYear}
            </h2>
            <button
              onClick={() => {
                setSelectedYear(selectedYear + 1);
              }}
              className='bg-gray-200 hover:bg-gray-300 font-bold py-1 px-3'
            >
              {'>'}
            </button>
          </div>
        </div>
        <div className={`${style.dateRangeGrid} my-4`}>
          <div>
            {daysHeader()}
            <div className={`${style.calendarGrid}`}>
              {eachDayOfMonth.map((day, index) =>
                displayDateRangeDays(day, index)
              )}
            </div>
          </div>
          <div>
            {daysHeader()}
            <div className={`${style.calendarGrid}`}>
              {eachDayOfNextMonth.map((day, index) =>
                displayDateRangeDays(day, index)
              )}
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <button
            className='hover:bg-slate-200 font-bold py-2 px-4 rounded'
            onClick={() => setShowDateRangePicker(false)}
          >
            Cancel
          </button>
          <button
            className='hover:bg-slate-200 font-bold py-2 px-4 rounded'
            onClick={() => {
              setEvent({
                ...event,
                start: '',
                end: '',
              });
            }}
          >
            Clear
          </button>
          <button
            className='hover:bg-slate-200 font-bold py-2 px-4 rounded'
            onClick={() => {
              setShowDateRangePicker(false);
              setEvent({
                ...event,
                start: event.start,
                end: event.end,
              });
            }}
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DateRangePicker;
