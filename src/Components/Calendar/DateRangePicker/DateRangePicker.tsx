import { DateTime, Interval } from 'luxon';
import { useState } from 'react';
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
    year: selectedYear,
    month: selectedMonth + 1,
  }).dates;

  const [currentDate, setCurrentDate] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const displayDateRangeDays = (day: Day, index: number) => {
    return (
      <div
        key={index}
        onMouseOver={() => {
          if (dateRange.start) {
            setCurrentDate(day.date);
          }
        }}
        className={`rounded-full
              border-2 hover:border-blue-400 ${
                style['dateRange-Day']
              } text-base font-bold select-none ${
          ['Saturday', 'Sunday'].includes(day.name)
            ? 'opacity-50'
            : day.lastMonth
            ? 'opacity-30 font-normal'
            : 'opacity-100'
        } ${
          dateRange.start && dateRange.end
            ? Interval.fromDateTimes(
                DateTime.fromISO(dateRange.start),
                DateTime.fromISO(dateRange.end).plus({ days: 1 })
              ).contains(DateTime.fromISO(day.date))
              ? 'bg-purple-400'
              : 'bg-white'
            : currentDate &&
              Interval.fromDateTimes(
                DateTime.fromISO(dateRange.start),
                DateTime.fromISO(currentDate).plus({ days: 1 })
              ).contains(DateTime.fromISO(day.date))
            ? 'bg-purple-200'
            : 'bg-white'
        }`}
        onClick={() => {
          if (dateRange.start && dateRange.end) {
            setDateRange({
              start: day.date,
              end: '',
            });
            return;
          }
          if (!dateRange.start) {
            setDateRange({
              ...dateRange,
              start: day.date,
            });
            return;
          }
          if (dateRange.start) {
            if (dateRange.start === day.date) {
              return;
            }
            if (
              DateTime.fromISO(dateRange.start).diff(
                DateTime.fromISO(day.date),
                'days'
              ).days > 0
            ) {
              setDateRange({
                ...dateRange,
                start: day.date,
              });
              return;
            }
            setDateRange({
              ...dateRange,
              end: day.date,
            });
          }
        }}
      >
        {day.day}
      </div>
    );
  };

  return (
    <Modal
      width='auto'
      height='80%'
      animation='fade'
      show={showDateRangePicker}
      closeModal={() => setShowDateRangePicker(false)}
    >
      <div className='p-4 bg-white rounded-md relative'>
        <div className='flex justify-center h-20'>
          <div className='flex items-center'>
            <button
              onClick={() => {
                if (selectedMonth === 1) {
                  return;
                }
                setSelectedMonth(selectedMonth - 1);
              }}
              className='bg-slate-50 hover:bg-slate-300 font-bold py-2 px-4 rounded'
            >
              {'<'}
            </button>
            <h2>{selectedMonth}</h2>
            <button
              onClick={() => {
                if (selectedMonth === 12) {
                  return;
                }
                setSelectedMonth(selectedMonth + 1);
              }}
              className='bg-slate-50 hover:bg-slate-300 font-bold py-2 px-4 rounded'
            >
              {'>'}
            </button>
          </div>
          <div className='flex items-center'>
            <button
              onClick={() => {
                setSelectedYear(selectedYear - 1);
              }}
              className='bg-slate-50 hover:bg-slate-300 font-bold py-2 px-4 rounded'
            >
              {'<'}
            </button>
            <h2>{selectedYear}</h2>
            <button
              onClick={() => {
                setSelectedYear(selectedYear + 1);
              }}
              className='bg-slate-50 hover:bg-slate-300 font-bold py-2 px-4 rounded'
            >
              {'>'}
            </button>
          </div>
        </div>
        <div className={`${style.dateRangeGrid} my-4`}>
          <div className={`${style.calendarGrid}`}>
            {eachDayOfMonth.map((day, index) =>
              displayDateRangeDays(day, index)
            )}
          </div>
          <div className={`${style.calendarGrid}`}>
            {eachDayOfNextMonth.map((day, index) =>
              displayDateRangeDays(day, index)
            )}
          </div>
        </div>
        <div className='flex justify-between'>
          <button
            className='bg-slate-200 hover:bg-slate-500 font-bold py-2 px-4 rounded'
            onClick={() => setShowDateRangePicker(false)}
          >
            Cancel
          </button>
          <button
            className='bg-slate-200 hover:bg-slate-500 font-bold py-2 px-4 rounded'
            onClick={() => {
              setDateRange({
                start: '',
                end: '',
              });
            }}
          >
            Clear
          </button>
          <button
            className='bg-slate-200 hover:bg-slate-500 font-bold py-2 px-4 rounded'
            onClick={() => {
              setShowDateRangePicker(false);
              setEvent({
                ...event,
                start: dateRange.start,
                end: dateRange.end,
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
