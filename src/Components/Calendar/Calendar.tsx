import { DateTime } from 'luxon';
import { useState } from 'react';
import isMobileView from '../../checkForMobileView';
import Modal from '../Shared/Modal/Modal';
import style from './Calendar.module.scss';

type Props = {};

enum DayName {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

type Day = {
  [key: string]: number | string | boolean;
  day: number;
  date: string;
  name: string;
  lastMonth: boolean;
};

type Event = {
  id: string;
  title: string;
  start: string;
  end: string;
  description: string;
  phone: string;
  extendedProps?: {
    [key: string]: any;
  };
};

const Calendar = (props: Props) => {
  const [currentDate, setCurrentDate] = useState(DateTime.local());
  const [addNewEvent, setAddNewEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    id: window.crypto.getRandomValues(new Uint32Array(1)).toString(),
    title: '',
    start: '',
    end: '',
    description: '',
    phone: '',
  });
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({
    '2022-06-17': [
      {
        id: '2098508254',
        title: 'Test',
        start: '2022-06-17',
        end: '2022-06-18',
        description: 'test',
        phone: '123124124',
      },
    ],
  });

  const [selectedMonth, setSelectedMonth] = useState<number>(
    DateTime.local().month
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    DateTime.local().year
  );

  const mobileView = isMobileView();

  const eachDayOfMonth = () => {
    const monthDates: Day[] = [];
    const start = DateTime.local(selectedYear, selectedMonth).startOf('month');
    const end = DateTime.local(selectedYear, selectedMonth).endOf('month');

    const daysInMonth = end.diff(start, 'days');
    for (let i = 0; i <= daysInMonth.days; i++) {
      const day = start.plus({ days: i });

      if (i === 0) {
        for (let index = start.get('weekday') - 1; index > 0; index--) {
          const dayOfLastMonth = start.minus({ days: index });
          monthDates.push({
            day: dayOfLastMonth.day,
            date: dayOfLastMonth.toFormat('yyyy-MM-dd'),
            name: dayOfLastMonth.toFormat('EEEE'),
            lastMonth: true,
          });
        }
      }
      monthDates.push({
        day: day.day,
        date: day.toFormat('yyyy-MM-dd'),
        name: day.toFormat('EEEE'),
        lastMonth: false,
      });
    }

    return monthDates;
  };
  console.log(events);

  const eachDayOfRange = (startDate: string, endDate: string) => {
    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);
    const monthDates: Day[] = [];

    const daysInMonth = end.diff(start, 'days');
    for (let i = 0; i <= daysInMonth.days; i++) {
      const day = start.plus({ days: i });
      monthDates.push({
        day: day.day,
        date: day.toFormat('yyyy-MM-dd'),
        name: day.toFormat('EEEE'),
        lastMonth: false,
      });
    }

    return monthDates;
  };

  return (
    <div className='p-5'>
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

      <div
        className={mobileView ? style.mobileCalendarGrid : style.calendarGrid}
      >
        <div className={`${style.dayName} text-xs select-none font-bold`}>
          Mon
        </div>
        <div className={`${style.dayName} text-xs select-none font-bold`}>
          Tue
        </div>
        <div className={`${style.dayName} text-xs select-none font-bold`}>
          Wed
        </div>
        <div className={`${style.dayName} text-xs select-none font-bold`}>
          Thu
        </div>
        <div className={`${style.dayName} text-xs select-none font-bold`}>
          Fri
        </div>
        <div className={`${style.dayName} text-xs select-none font-bold`}>
          Sat
        </div>
        <div className={`${style.dayName} text-xs select-none font-bold`}>
          Sun
        </div>
        {eachDayOfMonth().map((day, index) => {
          return (
            <div
              key={index}
              className={`text-sm ${
                mobileView ? 'border-2' : 'border-2 rounded-md'
              } hover:border-blue-400 ${
                mobileView ? style.mobileGridItem : style.gridItem
              }`}
            >
              <div
                className={`text-xs font-bold select-none ${
                  ['Saturday', 'Sunday'].includes(day.name)
                    ? 'opacity-50'
                    : day.lastMonth
                    ? 'opacity-30 font-normal'
                    : 'opacity-100'
                } ${mobileView ? style.mobileDayText : style.dayText}`}
              >
                {mobileView ? day.day : day.day + '. ' + day.name}
                {events && events[day.date]?.length > 0 && (
                  <div className={style.eventCount}>
                    {events[day.date].length}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className='fixed bottom-0 right-0 m-4'>
        <button
          className='bg-slate-200 hover:bg-slate-500 font-bold py-2 px-4 rounded text-lg'
          onClick={() => setAddNewEvent(true)}
        >
          +
        </button>
      </div>

      <Modal show={addNewEvent} closeModal={() => setAddNewEvent(false)}>
        <div className='p-4 bg-white rounded-md'>
          <h2 className='text-center font-bold'>Add New Reservation</h2>
          <div className='flex justify-center'>
            <input
              className='bg-slate-100 border-2 border-slate-300 rounded-md p-2'
              type='text'
              placeholder='Title'
              onChange={e =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
          </div>
          <div className='flex justify-center'>
            <input
              className='bg-slate-100 border-2 border-slate-300 rounded-md p-2'
              type='text'
              placeholder='Description'
              onChange={e =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
          </div>
          <div className='flex justify-center'>
            <input
              className='bg-slate-100 border-2 border-slate-300 rounded-md p-2'
              type='text'
              placeholder='Phone'
              onChange={e =>
                setNewEvent({ ...newEvent, phone: e.target.value })
              }
            />
          </div>
          <div className='flex justify-center'>
            <input
              className='bg-slate-100 border-2 border-slate-300 rounded-md p-2 w-full'
              type='date'
              onChange={e =>
                setNewEvent({
                  ...newEvent,
                  start: e.target.value,
                })
              }
            />
          </div>
          <div className='flex justify-center'>
            <input
              className='bg-slate-100 border-2 border-slate-300 rounded-md p-2 w-full'
              type='date'
              onChange={e => setNewEvent({ ...newEvent, end: e.target.value })}
            />
          </div>
          <div className='flex justify-center'>
            <button
              className='bg-slate-200 hover:bg-slate-500 font-bold py-2 px-4 rounded text-lg'
              onClick={() => {
                // create object with keys that mach the dates between newEvent start and end with luxon
                const dates = eachDayOfRange(newEvent.start, newEvent.end);
                console.log(dates);

                setEvents({
                  ...events,
                  // add new event into the arrays with date key between start and end
                  ...dates.reduce(
                    (acc, date) => ({
                      ...acc,
                      [date.date]: [...(events[date.date] || []), newEvent],
                    }),
                    {}
                  ),
                  //[newEvent.start]: [...(events[newEvent.start] || []), newEvent],
                });
                //setAddNewEvent(false);
              }}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
