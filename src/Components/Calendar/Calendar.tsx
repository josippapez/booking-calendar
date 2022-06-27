import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import { useParams } from 'react-router';
import isMobileView from '../../checkForMobileView';
import calculateEachDayOfMonth from '../../Hooks/calculateEachDayOfMonth';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeEvent, saveEvents } from '../../store/reducers/events';
import style from './Calendar.module.scss';
import { Event } from './CalendarTypes';
import CreateNewEvent from './CreateNewEvent/CreateNewEvent';
import DayDetails from './DayDetails/DayDetails';

type Props = {};

const Calendar = (props: Props) => {
  const dispatch = useAppDispatch();
  const naviagtionParams = useParams();
  const firestore = useFirestore();

  const eventsData = useAppSelector(state => state.events.events);
  const [showDayDetails, setShowDayDetails] = useState(false);
  const [addNewEvent, setAddNewEvent] = useState(false);
  const [events, setEvents] = useState(eventsData);
  const [selectedDay, setSelectedDay] = useState<null | string>(null);
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
      let smallestIndex = 999;
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
        if (newIndex < smallestIndex) {
          smallestIndex = newIndex;
        }
      }
      return { biggestIndex, smallestIndex };
    },
    [events]
  );

  const getEventsById = async (id: string) => {
    const event = await (
      await firestore.collection('events').doc(id).get()
    ).data();

    if (JSON.stringify(eventsData) !== JSON.stringify(event)) {
      dispatch(
        saveEvents(
          event as {
            [key: string]: Event[];
          }
        )
      );
    }
  };

  useEffect(() => {
    if (naviagtionParams && naviagtionParams.id) {
      getEventsById(naviagtionParams.id);
    }
  }, []);

  useEffect(() => {
    if (JSON.stringify(eventsData) !== JSON.stringify(events)) {
      dispatch(saveEvents(events));
      if (naviagtionParams && naviagtionParams.id) {
        firestore.collection('events').doc(naviagtionParams.id).set(events);
      }
    }
  }, [events]);

  useEffect(() => {
    setEvents(eventsData);
  }, [eventsData]);

  const calculateBiggestIndexByWeekNumber = useCallback(() => {
    let biggestIndex = 0;
    for (const day of eachDayOfMonth) {
      const eventsForDay = events[day.date];
      if (eventsForDay && eventsForDay.length > biggestIndex) {
        biggestIndex = eventsForDay.length;
      }
    }

    return biggestIndex;
  }, [events, eachDayOfMonth]);

  return (
    <div>
      <div className='flex justify-between'>
        <div className='font-bold text-xl'>Calendar</div>
        <div className='flex flex-row select-none gap-3'>
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
            <h2 className='w-fit px-5 select-none font-bold'>
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
            const objectOfDivs: JSX.Element[] = [];
            if (events && events[day.date]) {
              for (
                let index = 0;
                index < calculateBiggestIndexByWeekNumber();
                index++
              ) {
                objectOfDivs[index] = (
                  <div key={`${index}-${day.date}`} className={`h-[40px]`} />
                );
              }
            }

            return (
              <div
                key={index}
                className={`relative border-slate-300 border-t-2
              hover:border-blue-400 ${
                mobileView ? style.mobileGridItem : style.gridItem
              }`}
                onClick={() => {
                  if (events[day.date]) {
                    setSelectedDay(day.date);
                    setShowDayDetails(true);
                  }
                }}
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
                    events[day.date].map(event => {
                      const offset = findOffsetOfEvent(event);
                      const tempStartDate = event.start === day.date;
                      const tempEndDate = event.end === day.date;
                      objectOfDivs[offset.biggestIndex] = (
                        <div
                          id={`${day.day}-${event.id}`}
                          key={`${day.day}-${event.id}`}
                          className={`text-white flex font-bold px-2 py-1
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
                          {event.booking && tempStartDate && (
                            <div
                              className={`rounded-full w-6 text-center bg-gray-600`}
                            >
                              B
                            </div>
                          )}
                          {event.title}
                        </div>
                      );
                    }) &&
                    objectOfDivs}
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
        <DayDetails
          show={showDayDetails}
          setShow={setShowDayDetails}
          events={selectedDay ? events[selectedDay] : []}
          isMobileView={mobileView}
          removeEvent={id => dispatch(removeEvent(id))}
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
