import { DateTime } from 'luxon';
import { useState } from 'react';
import isMobileView from '../../checkForMobileView';
import calculateEachDayOfMonth from '../../Hooks/calculateEachDayOfMonth';
import style from './Calendar.module.scss';
import { Event } from './CalendarTypes';
import CreateNewEvent from './CreateNewEvent/CreateNewEvent';

type Props = {};

const Calendar = (props: Props) => {
  const [addNewEvent, setAddNewEvent] = useState(false);
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({});

  const [selectedMonth, setSelectedMonth] = useState<number>(
    DateTime.local().month
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    DateTime.local().year
  );

  const mobileView = isMobileView();

  const eachDayOfMonth = calculateEachDayOfMonth({
    year: selectedYear,
    month: selectedMonth,
  }).dates;

  return (
    <div className='p-5'>
      <div className='flex justify-center h-20'>
        <div className='flex items-center'>
          <button
            onClick={() => {
              if (selectedMonth === 1) {
                setSelectedMonth(12);
                setSelectedYear(selectedYear - 1);
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
                setSelectedMonth(1);
                setSelectedYear(selectedYear + 1);
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
      <div className={style.calendarGridHeader}>
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
      </div>
      <div className={style.calendarGrid}>
        {eachDayOfMonth.map((day, index) => {
          return (
            <div
              key={index}
              className={`text-sm relative border-slate-300 ${
                mobileView ? 'border-2' : 'border-2 rounded-md'
              } hover:border-blue-400 ${
                mobileView ? style.mobileGridItem : style.gridItem
              }`}
            >
              <div
                className={`text-xs font-bold select-none h-full flex flex-col ${
                  ['Saturday', 'Sunday'].includes(day.name)
                    ? 'opacity-50'
                    : day.lastMonth
                    ? 'opacity-30 font-normal'
                    : 'opacity-100'
                } ${mobileView ? style.mobileDayText : style.dayText}`}
              >
                <div className=''>
                  {mobileView ? day.day : day.day + '. ' + day.name}
                </div>
                <div
                  className={`${style.startingDays} flex flex-col w-[70%]`}
                ></div>
                <div
                  className={`${style.endingDays} flex flex-col w-[30%]`}
                ></div>
                {events &&
                  events[day.date]?.length > 0 &&
                  events[day.date].map((event, index) => {
                    const tempStartDate = event.start === day.date;
                    const tempEndDate = event.end === day.date;
                    return tempStartDate ? (
                      <div
                        key={`${day.day}-${event.id}-${index}`}
                        className={`${
                          style.day
                        } text-white font-bold px-2 py-1 relative ${
                          tempStartDate
                            ? 'rounded-l-full self-end'
                            : tempEndDate && 'rounded-r-full self-start'
                        }`}
                        style={{
                          backgroundColor: event.color,
                          padding: '0.5rem',
                          width: '70%',
                          color: 'white',
                        }}
                      >
                        {event.title}
                      </div>
                    ) : tempEndDate ? (
                      <div
                        key={`${day.day}-${event.id}-${index}`}
                        className={`${style.day} text-white font-bold px-2 py-1 relative
                          rounded-r-full self-start'
                        `}
                        style={{
                          backgroundColor: event.color,
                          padding: '0.5rem',
                          width: '30%',
                          color: '#fff0',
                        }}
                      >
                        {event.title}
                      </div>
                    ) : (
                      <div
                        key={`${day.day}-${event.id}-${index}`}
                        className={`${style.day} text-white font-bold px-2 py-1 relative'
                        }`}
                        style={{
                          backgroundColor: event.color,
                          padding: '0.5rem',
                          width: '100%',
                          color: '#fff0',
                        }}
                      >
                        {event.title}
                      </div>
                    );
                  })}
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
      <CreateNewEvent
        show={addNewEvent}
        setShow={setAddNewEvent}
        events={events}
        setEvents={setEvents}
      />
    </div>
  );
};

export default Calendar;
