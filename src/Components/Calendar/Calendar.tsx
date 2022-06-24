import { DateTime } from 'luxon';
import { useCallback, useState } from 'react';
import isMobileView from '../../checkForMobileView';
import calculateEachDayOfMonth from '../../Hooks/calculateEachDayOfMonth';
import style from './Calendar.module.scss';
import { Event } from './CalendarTypes';
import CreateNewEvent from './CreateNewEvent/CreateNewEvent';

type Props = {};

const Calendar = (props: Props) => {
  const [addNewEvent, setAddNewEvent] = useState(false);
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({
    '2022-06-08': [
      {
        id: '843141125',
        title: 'asodaskodkasd',
        start: '2022-06-08',
        end: '2022-06-10',
        color: '#a3f2ff',
        description: '',
        phone: '',
      },
      {
        id: '1909057210',
        title: 'tdrfghfghfgh',
        start: '2022-06-08',
        end: '2022-06-10',
        color: '#b2f726',
        description: '',
        phone: '',
      },
    ],
    '2022-06-09': [
      {
        id: '843141125',
        title: 'asodaskodkasd',
        start: '2022-06-08',
        end: '2022-06-10',
        color: '#a3f2ff',
        description: '',
        phone: '',
      },
      {
        id: '1909057210',
        title: 'tdrfghfghfgh',
        start: '2022-06-08',
        end: '2022-06-10',
        color: '#b2f726',
        description: '',
        phone: '',
      },
    ],
    '2022-06-10': [
      {
        id: '843141125',
        title: 'asodaskodkasd',
        start: '2022-06-08',
        end: '2022-06-10',
        color: '#a3f2ff',
        description: '',
        phone: '',
      },
      {
        id: '843141126',
        title: 'asodaskodkasd',
        start: '2022-06-10',
        end: '2022-06-12',
        color: '#fca1d9',
        description: '',
        phone: '',
      },
      {
        id: '1909057210',
        title: 'tdrfghfghfgh',
        start: '2022-06-08',
        end: '2022-06-10',
        color: '#b2f726',
        description: '',
        phone: '',
      },
    ],
    '2022-06-11': [
      {
        id: '843141126',
        title: 'asodaskodkasd',
        start: '2022-06-10',
        end: '2022-06-12',
        color: '#fca1d9',
        description: '',
        phone: '',
      },
    ],
    '2022-06-12': [
      {
        id: '843141126',
        title: 'asodaskodkasd',
        start: '2022-06-10',
        end: '2022-06-12',
        color: '#fca1d9',
        description: '',
        phone: '',
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

  const eachDayOfMonth = calculateEachDayOfMonth({
    year: selectedYear,
    month: selectedMonth,
  }).dates;

  const findOffsetOfEvent = useCallback(
    (event: Event) => {
      let biggestIndex = 0;
      for (
        let index = 0;
        index <=
        DateTime.fromISO(event.end).diff(DateTime.fromISO(event.start), 'days')
          .days;
        index++
      ) {
        const tempDate = DateTime.fromISO(event.start)
          .plus({ days: index })
          .toFormat('yyyy-MM-dd');
        const newIndex = events[tempDate].findIndex(e => e.id === event.id);
        if (newIndex > biggestIndex) {
          biggestIndex = newIndex;
        }
      }
      return biggestIndex;
    },
    [events]
  );

  let lastOffset = 0;

  return (
    <div className='p-5'>
      <div className='flex flex-col select-none gap-3'>
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
            className='bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4'
          >
            {'<'}
          </button>
          <h2 className='w-fit px-5 select-none font-bold'>{selectedMonth}</h2>
          <button
            onClick={() => {
              if (selectedMonth === 12) {
                setSelectedMonth(1);
                setSelectedYear(selectedYear + 1);
                return;
              }
              setSelectedMonth(selectedMonth + 1);
            }}
            className='bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4'
          >
            {'>'}
          </button>
        </div>
        <div className='flex items-center border-2 w-fit rounded-md'>
          <button
            onClick={() => {
              setSelectedYear(selectedYear - 1);
            }}
            className='bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4'
          >
            {'<'}
          </button>
          <h2 className='w-fit px-5 select-none font-bold'>{selectedYear}</h2>
          <button
            onClick={() => {
              setSelectedYear(selectedYear + 1);
            }}
            className='bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4'
          >
            {'>'}
          </button>
        </div>
      </div>
      <div className={style.calendar}>
        <div className={style.calendarGridHeader}>
          <div className={`${style.dayName} select-none font-bold`}>Mon</div>
          <div className={`${style.dayName} select-none font-bold`}>Tue</div>
          <div className={`${style.dayName} select-none font-bold`}>Wed</div>
          <div className={`${style.dayName} select-none font-bold`}>Thu</div>
          <div className={`${style.dayName} select-none font-bold`}>Fri</div>
          <div className={`${style.dayName} select-none font-bold`}>Sat</div>
          <div className={`${style.dayName} select-none font-bold`}>Sun</div>
        </div>
        <div className={style.calendarGrid}>
          {eachDayOfMonth.map((day, index) => {
            lastOffset = 0;
            return (
              <div
                key={index}
                className={`relative border-slate-300 border-t-2
              hover:border-blue-400 ${
                mobileView ? style.mobileGridItem : style.gridItem
              }`}
              >
                <div
                  className={`font-bold select-none h-full flex flex-col ${
                    ['Saturday', 'Sunday'].includes(day.name)
                      ? 'opacity-50'
                      : day.lastMonth
                      ? 'opacity-30 font-normal'
                      : 'opacity-100'
                  } ${mobileView ? style.mobileDayText : style.dayText}`}
                >
                  <div>{day.day}</div>
                  {events &&
                    events[day.date]?.length > 0 &&
                    events[day.date].map((event, index) => {
                      const tempStartDate = event.start === day.date;
                      const tempEndDate = event.end === day.date;
                      const offset = findOffsetOfEvent(event);

                      const emptyDivs = [];

                      for (let i = index + lastOffset; i < offset; i++) {
                        emptyDivs.push(<div key={i} className={`h-[40px]`} />);
                      }
                      console.log(index, offset, emptyDivs);

                      lastOffset = emptyDivs.length;
                      console.log(lastOffset);

                      return (
                        <>
                          {emptyDivs}
                          <div
                            id={`${day.day}-${event.id}`}
                            key={`${day.day}-${event.id}`}
                            className={`text-white font-bold px-2 py-1
                         ${
                           tempStartDate
                             ? 'self-end rounded-l-full'
                             : tempEndDate
                             ? 'self-start rounded-r-full'
                             : 'self-center'
                         }
                        `}
                            style={{
                              backgroundColor: event.color,
                              padding: '0.5rem',
                              width: tempStartDate
                                ? '70%'
                                : tempEndDate
                                ? '30%'
                                : '100%',
                              color: tempStartDate ? 'white' : '#fff0',
                            }}
                          >
                            {event.title}
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
        <CreateNewEvent
          show={addNewEvent}
          setShow={setAddNewEvent}
          events={events}
          setEvents={setEvents}
        />
      </div>
      <div className='fixed bottom-0 right-0 p-3 w-fit'>
        <button
          className='bg-slate-200 hover:bg-slate-500 font-bold py-2 px-4 rounded text-lg'
          onClick={() => setAddNewEvent(true)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Calendar;
