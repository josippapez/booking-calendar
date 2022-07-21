import { DateTime, Info } from 'luxon';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFirestore } from 'react-redux-firebase';
import { useNavigate, useParams } from 'react-router';
import isMobileView from '../../checkForMobileView';
import calculateEachDayOfMonth from '../../Hooks/calculateEachDayOfMonth';
import {
  removeEventForApartment,
  saveEventsForApartment,
} from '../../store/firebaseActions/eventActions';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectApartment } from '../../store/reducers/apartments';
import { setEvents } from '../../store/reducers/events';
import Images from '../../Styles/Assets/Images/Images';
import Dropdown from '../Shared/Dropdown/Dropdown';
import style from './Calendar.module.scss';
import { Event } from './CalendarTypes';
import CreateNewEvent from './CreateNewEvent/CreateNewEvent';
import DayDetails from './DayDetails/DayDetails';

type Props = {};

const Calendar = (props: Props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const naviagtionParams = useParams();
  const navigate = useNavigate();
  const firestore = useFirestore();

  const eventsData = useAppSelector(state => state.events.events);
  const apartments = useAppSelector(state => state.apartments);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [showDayDetails, setShowDayDetails] = useState(false);
  const [addNewEvent, setAddNewEvent] = useState(false);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState<null | Event>(
    null
  );
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

  const calendarGrid = useRef<null | HTMLDivElement>(null);

  let touchMoveHorizontal: null | number = null;
  let currentScrollPosition: null | number = null;

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
        const newIndex = eventsData[tempDate].findIndex(e => e.id === event.id);
        if (newIndex > biggestIndex) {
          biggestIndex = newIndex;
        }
        if (newIndex < smallestIndex) {
          smallestIndex = newIndex;
        }
      }
      return { biggestIndex, smallestIndex };
    },
    [eventsData]
  );

  const getEventsById = async (id: string) => {
    const event = (
      await firestore.collection('events').doc(`${id}/data/private`).get()
    ).data();

    if (JSON.stringify(eventsData) !== JSON.stringify(event)) {
      dispatch(
        setEvents(
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
  }, [navigate]);

  const calculateBiggestIndexByWeekNumber = useCallback(() => {
    let biggestIndex = 0;
    for (const day of eachDayOfMonth) {
      const eventsForDay = eventsData[day.date];
      if (eventsForDay && eventsForDay.length > biggestIndex) {
        biggestIndex = eventsForDay.length;
      }
    }

    return biggestIndex;
  }, [eventsData, eachDayOfMonth]);

  return (
    <div className={`${mobileView ? 'py-10 px-2.5' : 'page-container p-10'}`}>
      <div
        className={`flex justify-between ${
          mobileView ? 'flex-col' : 'flex-row'
        }`}
      >
        <div className={`font-bold flex gap-3 ${mobileView && 'mb-6'}`}>
          <Dropdown
            placeholder='Select apartment'
            data={Object.keys(apartments?.apartments).map(key => {
              return {
                id: apartments.apartments[key].id,
                name: apartments.apartments[key].name,
                value: apartments.apartments[key],
              };
            })}
            selected={naviagtionParams.id}
            setData={item => {
              if (item !== naviagtionParams.id) {
                dispatch(selectApartment(apartments.apartments[item]));
                navigate(`/apartments/${item}`);
              }
            }}
          />
          <button
            className='bg-blue-500 hover:bg-blue-400 rounded-md h-10 px-3 text-white drop-shadow-md'
            onClick={() => navigate(`/${naviagtionParams.id}`)}
          >
            {t('public_view')}
          </button>
        </div>
        <div
          className={`${style.dateNavigation} flex select-none gap-3 drop-shadow-md`}
        >
          <div
            className={`flex items-center ${
              isMobileView() ? 'w-[165px]' : 'w-36'
            } rounded-md h-10`}
          >
            <button
              onClick={() => {
                if (selectedMonth === 1) {
                  setSelectedMonth(12);
                  setSelectedYear(selectedYear - 1);
                  return;
                }
                setSelectedMonth(selectedMonth - 1);
              }}
              style={{
                backgroundImage: `url(${Images.LeftArrow})`,
                backgroundSize: '75%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
              className='bg-neutral-50 hover:bg-neutral-100 p-5 rounded-l-md'
            />
            <h2 className='w-full text-center px-5 select-none font-bold'>
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
              style={{
                backgroundImage: `url(${Images.RightArrow})`,
                backgroundSize: '75%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
              className='bg-neutral-50 hover:bg-neutral-100 p-5 rounded-r-md'
            />
          </div>
          <div className='flex items-center w-[165px] rounded-md h-10'>
            <button
              onClick={() => {
                setSelectedYear(selectedYear - 1);
              }}
              style={{
                backgroundImage: `url(${Images.LeftArrow})`,
                backgroundSize: '75%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
              className='bg-neutral-50 hover:bg-neutral-100 p-5 rounded-l-md'
            />
            <h2 className='w-full text-center px-5 select-none font-bold'>
              {selectedYear}
            </h2>
            <button
              onClick={() => {
                setSelectedYear(selectedYear + 1);
              }}
              style={{
                backgroundImage: `url(${Images.RightArrow})`,
                backgroundSize: '75%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
              className='bg-neutral-50 hover:bg-neutral-100 p-5 rounded-r-md'
            />
          </div>
        </div>
      </div>
      <div
        ref={calendarGrid}
        className={`${style.calendar} transition-all duration-75 drop-shadow-md relative`}
        onTouchStart={e => {
          touchMoveHorizontal = e.targetTouches.item(0).clientX;
          currentScrollPosition = e.touches.item(0).pageX;
        }}
        onTouchMove={e => {
          if (
            calendarGrid.current &&
            touchMoveHorizontal &&
            currentScrollPosition &&
            (currentScrollPosition > e.touches.item(0).pageX + 30 ||
              (touchMoveHorizontal &&
                currentScrollPosition < e.touches.item(0).pageX - 30))
          ) {
            currentScrollPosition = e.touches.item(0).pageX;
            calendarGrid.current.style.left = `${
              e.touches.item(0).pageX - touchMoveHorizontal
            }px`;
          }
        }}
        onTouchEnd={e => {
          if (calendarGrid.current) {
            calendarGrid.current.style.left = '0px';
            currentScrollPosition = null;
          }
          if (
            touchMoveHorizontal &&
            touchMoveHorizontal - e.changedTouches.item(0).clientX > 50
          ) {
            touchMoveHorizontal = null;
            if (selectedMonth === 12) {
              setSelectedMonth(1);
              setSelectedYear(selectedYear + 1);
              return;
            }
            setSelectedMonth(selectedMonth + 1);
          } else if (
            touchMoveHorizontal &&
            touchMoveHorizontal - e.changedTouches.item(0).clientX < -50
          ) {
            touchMoveHorizontal = null;
            if (selectedMonth === 1) {
              setSelectedMonth(1);
              setSelectedYear(selectedYear - 1);
              return;
            }
            setSelectedMonth(selectedMonth - 1);
          }
        }}
      >
        <div className={style.calendarGridHeader}>
          {Info.weekdaysFormat('short', { locale: i18n.languages[0] }).map(
            (day, index) => (
              <div
                key={index}
                className={`${style.dayName} select-none font-bold`}
              >
                {day}
              </div>
            )
          )}
        </div>
        <div className={style.calendarGrid}>
          {eachDayOfMonth.map((day, index) => {
            const objectOfDivs: JSX.Element[] = [];
            if (eventsData && eventsData[day.date]) {
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
                className={`relative shadow-[0_-1px_1px_#cbd5e1]
                  hover:shadow-[0_-2px_1px_#93C5FD] hover:border-2 hover:border-t-0 hover:border-blue-300 ${
                    mobileView ? style.mobileGridItem : style.gridItem
                  }`}
                onClick={() => {
                  if (eventsData[day.date]) {
                    setSelectedDay(day.date);
                    setShowDayDetails(true);
                  }
                }}
              >
                <div
                  className={`select-none h-full flex flex-col ${
                    ['Saturday', 'Sunday'].includes(day.name)
                      ? 'opacity-50'
                      : day.lastMonth
                      ? 'opacity-30 font-normal'
                      : 'opacity-100'
                  } ${mobileView ? style.mobileDayText : style.dayText}`}
                >
                  <div>{day.day}</div>
                  {eventsData &&
                    eventsData[day.date]?.length > 0 &&
                    eventsData[day.date].map(event => {
                      const offset = findOffsetOfEvent(event);
                      const tempStartDate = event.start === day.date;
                      const tempEndDate = event.end === day.date;
                      objectOfDivs[offset.biggestIndex] = (
                        <div
                          id={`${day.day}-${event.id}`}
                          key={`${day.day}-${event.id}`}
                          className={`text-white flex font-bold px-2 py-1
                          min-h-[40px]
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
                          <div className='text-ellipsis whitespace-nowrap overflow-hidden'>
                            {event.title}
                          </div>
                        </div>
                      );
                    }) &&
                    objectOfDivs}
                </div>
              </div>
            );
          })}
        </div>
        <DayDetails
          show={showDayDetails}
          setShow={setShowDayDetails}
          setShowEdit={setShowEditEvent}
          setSelectedDay={setSelectedDay}
          setSelectedEventToEdit={setSelectedEventToEdit}
          events={selectedDay ? eventsData[selectedDay] : []}
          isMobileView={mobileView}
          removeEvent={id => dispatch(removeEventForApartment(id))}
        />
        <CreateNewEvent
          show={addNewEvent}
          showEdit={showEditEvent}
          setShowEdit={setShowEditEvent}
          setShow={setAddNewEvent}
          selectedEventToEdit={selectedEventToEdit}
          events={eventsData}
          setEvents={events => dispatch(saveEventsForApartment(events))}
        />
      </div>
      <div className='fixed bottom-0 right-0 p-3 w-fit drop-shadow-md'>
        <button
          className='bg-neutral-200 hover:bg-neutral-400 hover:text-white font-bold py-2 px-4 rounded text-lg'
          onClick={() => setAddNewEvent(true)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Calendar;
