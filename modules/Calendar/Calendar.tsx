import { FirebaseService } from '@/store/FirebaseService';
import {
  removeEventForApartment,
  saveEventsForApartment,
} from '@/store/firebaseActions/eventActions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectApartment } from '@/store/reducers/apartments';
import { Events, setEvents } from '@/store/reducers/events';
import { Event } from '@modules/Calendar/CalendarTypes';
import { CreateNewEvent } from '@modules/Calendar/CreateNewEvent/CreateNewEvent';
import { DayDetails } from '@modules/Calendar/DayDetails/DayDetails';
import { DatePickerHeader } from '@modules/Shared/DatePicker/Header/DatePickerHeader';
import { Dropdown } from '@modules/Shared/Dropdown/Dropdown';
import { useCalculateEachDayOfMonth } from '@modules/Shared/Hooks/calculateEachDayOfMonth';
import { useMobileView } from '@modules/Shared/Hooks/useMobileView';
import { Routes } from 'consts';
import { FirebaseError } from 'firebase/app';
import { doc, getDoc } from 'firebase/firestore';
import { DateTime, Info } from 'luxon';
import { useRouter } from 'next/router';
import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import style from './Calendar.module.scss';

const firebase = FirebaseService.getInstance();

export const Calendar: FC = () => {
  const { t, i18n } = useTranslation('Calendar');
  const dispatch = useAppDispatch();
  const navigate = useRouter();

  const id = useRef('');

  const eventsData = useAppSelector(state => state.events.events);
  const apartments = useAppSelector(state => state.apartments);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [showDayDetails, setShowDayDetails] = useState(false);
  const [addNewEvent, setAddNewEvent] = useState(false);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState<null | Event>(
    null
  );
  const [selectedDay, setSelectedDay] = useState<null | string>(null);

  const mobileView = useMobileView();

  const { dates, setmonth, setyear, year, month } = useCalculateEachDayOfMonth({
    startYear: DateTime.local().year,
    startMonth: DateTime.local().month,
  });

  const calendarGrid = useRef<null | HTMLDivElement>(null);

  let touchMoveHorizontal: null | number = null;
  let currentScrollPosition: null | number = null;

  const findOffsetOfEvent = useCallback(
    (event: Event) => {
      let biggestIndex = 0;
      let smallestIndex = 999;
      const eventStartSplit = event.start.split('-');
      const eventEndSplit = event.end.split('-');
      let endDate = event.end;
      let startDate = event.start;

      if (
        Number(eventEndSplit[0]) > year ||
        (Number(eventEndSplit[0]) === year && Number(eventEndSplit[1]) > month)
      ) {
        endDate = DateTime.fromObject({
          month,
        })
          .endOf('month')
          .toFormat('yyyy-MM-dd');
      }

      if (
        Number(eventStartSplit[0]) > year ||
        (Number(eventStartSplit[0]) === year &&
          Number(eventStartSplit[1]) > month)
      ) {
        startDate = DateTime.fromObject({
          month,
        })
          .startOf('month')
          .toFormat('yyyy-MM-dd');
      }

      for (
        let index = 0;
        index <=
        DateTime.fromISO(endDate).diff(DateTime.fromISO(startDate), 'days')
          .days;
        index++
      ) {
        const tempDate = DateTime.fromISO(startDate)
          .plus({ days: index })
          .toFormat('yyyy-MM-dd');
        if (
          eventsData?.[DateTime.fromISO(startDate).year] &&
          eventsData[DateTime.fromISO(startDate).year][tempDate]
        ) {
          const newIndex = eventsData[DateTime.fromISO(startDate).year][
            tempDate
          ].findIndex(e => e.id === event.id);
          if (newIndex > biggestIndex) {
            biggestIndex = newIndex;
          }
          if (newIndex < smallestIndex) {
            smallestIndex = newIndex;
          }
        }
      }
      return { biggestIndex, smallestIndex };
    },
    [eventsData]
  );

  const getEventsById = async (id: string) => {
    try {
      const event = await getDoc(
        doc(firebase.getFirestore(), 'events', `${id}/data/private`)
      ).then(doc => doc.data());

      if (JSON.stringify(eventsData) !== JSON.stringify(event)) {
        dispatch(setEvents(event as Events));
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'permission-denied') {
          navigate.push(Routes.LOGIN);
        }
      }
    }
  };

  useEffect(() => {
    if (
      navigate &&
      navigate.query.id &&
      typeof navigate.query.id === 'string'
    ) {
      id.current = navigate.query.id;
      getEventsById(id.current);
    }
  }, [navigate]);

  const calculateBiggestIndexByWeekNumber = useCallback(() => {
    let biggestIndex = 0;
    for (const day of dates) {
      if (eventsData?.[day.year] && eventsData[day.year][day.date]) {
        const eventsForDay = eventsData[day.year][day.date];
        if (eventsForDay && eventsForDay.length > biggestIndex) {
          biggestIndex = eventsForDay.length;
        }
      }
    }

    return biggestIndex;
  }, [eventsData, dates]);

  return (
    <>
      <title>{apartments.selectedApartment?.name}</title>
      <div
        className={`flex h-fit justify-between ${
          mobileView ? 'flex-col' : 'flex-row'
        }`}
      >
        <div className={`flex gap-3 font-bold ${mobileView && 'mb-6'}`}>
          <Dropdown
            placeholder='Select apartment'
            data={Object.keys(apartments?.apartments).map(key => {
              return {
                id: apartments.apartments[key].id,
                name: apartments.apartments[key].name,
                value: apartments.apartments[key],
              };
            })}
            selected={navigate.query.id as string}
            setData={item => {
              if (item.id !== (navigate.query.id as string)) {
                dispatch(selectApartment(apartments.apartments[item.id]));
                navigate.push({
                  pathname: Routes.APARTMENT,
                  query: { id: item.id },
                });
              }
            }}
          />
          <button
            className='h-10 rounded-md bg-blue-500 px-3 text-white drop-shadow-md hover:bg-blue-400'
            onClick={() =>
              navigate.push({
                pathname: Routes.PUBLIC_APARTMENT,
                query: { id: id.current },
              })
            }
          >
            {t('public_view')}
          </button>
        </div>
        <DatePickerHeader
          hideOnlyYearButton
          selectedMonth={month}
          selectedYear={year}
          setSelectedMonth={setmonth}
          setSelectedYear={setyear}
          className={style.dateNavigation}
        />
      </div>
      <div
        ref={calendarGrid}
        className={`${
          style.calendar
        } relative drop-shadow-md transition-all duration-75 ${
          mobileView && 'full-bleed'
        }`}
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
            if (month === 12) {
              setmonth(1);
              setyear(year + 1);
              return;
            }
            setmonth(month + 1);
          } else if (
            touchMoveHorizontal &&
            touchMoveHorizontal - e.changedTouches.item(0).clientX < -50
          ) {
            touchMoveHorizontal = null;
            if (month === 1) {
              setmonth(12);
              setyear(year - 1);
              return;
            }
            setmonth(month - 1);
          }
        }}
      >
        <div className={style.calendarGridHeader}>
          {Info.weekdaysFormat('short', { locale: i18n.language }).map(
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
          {dates.map((day, index) => {
            const objectOfDivs: ReactElement[] = [];
            if (
              eventsData &&
              eventsData[day.year] &&
              eventsData[day.year][day.date]
            ) {
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
                  hover:border-2 hover:border-t-0 hover:border-blue-300 hover:shadow-[0_-2px_1px_#93C5FD] ${
                    mobileView ? style.mobileGridItem : style.gridItem
                  }`}
                onClick={() => {
                  if (
                    eventsData &&
                    eventsData[day.year] &&
                    eventsData[day.year][day.date]
                  ) {
                    setSelectedDay(day.date);
                    setShowDayDetails(true);
                  } else {
                    setSelectedDay(day.date);
                    setAddNewEvent(true);
                  }
                }}
              >
                <div
                  className={`flex h-full select-none flex-col ${
                    ['Saturday', 'Sunday'].includes(day.name)
                      ? 'opacity-50'
                      : day.lastMonth || day.nextMonth
                      ? 'font-normal opacity-30'
                      : 'opacity-100'
                  } ${mobileView ? style.mobileDayText : style.dayText}`}
                >
                  <div>{day.day}</div>
                  {eventsData &&
                    eventsData[day.year] &&
                    eventsData[day.year][day.date]?.length > 0 &&
                    eventsData[day.year][day.date].map(event => {
                      const offset = findOffsetOfEvent(event);
                      const tempStartDate = event.start === day.date;
                      const tempEndDate = event.end === day.date;
                      objectOfDivs[offset.biggestIndex] = (
                        <div
                          id={`${day.day}-${event.id}`}
                          key={`${day.day}-${event.id}`}
                          className={`flex min-h-[40px] px-2 py-1 font-bold
                          text-white
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
                              className={`w-6 rounded-full bg-gray-600 text-center`}
                            >
                              B
                            </div>
                          )}
                          <div className='overflow-hidden text-ellipsis whitespace-nowrap'>
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
        {showDayDetails && (
          <DayDetails
            show={true}
            setShow={setShowDayDetails}
            setShowEdit={setShowEditEvent}
            setSelectedDay={setSelectedDay}
            setSelectedEventToEdit={setSelectedEventToEdit}
            setAddNewEvent={setAddNewEvent}
            events={
              selectedDay && eventsData?.[selectedDay.split('-')[0]]
                ? eventsData[selectedDay.split('-')[0]][selectedDay]
                : []
            }
            isMobileView={mobileView}
            removeEvent={event => dispatch(removeEventForApartment(event.id))}
          />
        )}
        {(addNewEvent || showEditEvent) && (
          <CreateNewEvent
            events={eventsData}
            show={addNewEvent}
            showEdit={showEditEvent}
            selectedDay={selectedDay}
            selectedEventToEdit={selectedEventToEdit}
            setShowEdit={setShowEditEvent}
            setShow={setAddNewEvent}
            setEvents={events => dispatch(saveEventsForApartment(events))}
          />
        )}
      </div>
      <div className='fixed bottom-0 right-0 w-fit p-3 drop-shadow-md'>
        <button
          className='rounded bg-blue-500 px-4 py-2 text-lg font-bold text-white hover:bg-neutral-400'
          onClick={() => setAddNewEvent(true)}
        >
          +
        </button>
      </div>
    </>
  );
};
