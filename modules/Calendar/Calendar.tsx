'use client';

import {
  useApartmentsControllerFindAllSuspense,
  useEventsControllerFindAllForUserSuspense,
} from '@/api';
import { Event } from '@modules/Calendar/CalendarTypes';
import { CreateNewEvent } from '@modules/Calendar/CreateNewEvent/CreateNewEvent';
import { DayDetails } from '@modules/Calendar/DayDetails/DayDetails';
import { DatePickerHeader } from '@modules/Shared/DatePicker/Header/DatePickerHeader';
import { Dropdown } from '@modules/Shared/Dropdown/Dropdown';
import { useCalculateEachDayOfMonth } from '@modules/Shared/Hooks/calculateEachDayOfMonth';
import { useSearchParams } from '@modules/Shared/Hooks/useFilterQuery';
import { useMobileView } from '@modules/Shared/Hooks/useMobileView';
import { useRouter } from '@modules/translations';
import { Routes } from 'consts';
import { DateTime, Info } from 'luxon';
import { useLocale, useTranslations } from 'next-intl';
import { FC, ReactElement, useCallback, useRef, useState } from 'react';
import style from './Calendar.module.scss';

export const Calendar: FC = () => {
  const locale = useLocale();
  const t = useTranslations('Calendar');
  const { params } = useSearchParams();
  const apartmentId = params.get('id') || '';
  const router = useRouter();

  const { data: eventsData } = useEventsControllerFindAllForUserSuspense(
    apartmentId,
    {
      query: {
        queryKey: ['events', apartmentId],
      },
    }
  );

  const { data: apartments } = useApartmentsControllerFindAllSuspense({
    query: {
      queryKey: ['apartments'],
    },
  });

  const currentApartment = apartments?.find(
    apartment => apartment.id === apartmentId
  );

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

        const eventsForYear =
          eventsData.data?.[DateTime.fromISO(startDate).year.toString()];
        const eventsForYearAndDate = eventsForYear?.[tempDate];
        if (eventsForYearAndDate) {
          const newIndex = eventsForYearAndDate.findIndex(
            e => e.id === event.id
          );
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
    [eventsData.data, month, year]
  );

  const calculateBiggestIndexByWeekNumber = useCallback(() => {
    let biggestIndex = 0;
    for (const day of dates) {
      const eventsForYearAndDate = eventsData.data?.[day.year]?.[day.date];
      if (eventsForYearAndDate) {
        if (eventsForYearAndDate.length > biggestIndex) {
          biggestIndex = eventsForYearAndDate.length;
        }
      }
    }

    return biggestIndex;
  }, [eventsData, dates]);

  if (!apartmentId) throw new Error('No apartment id provided');

  const selectedDayYear = selectedDay?.split('-')[0];
  const eventsForSelectedDay = selectedDayYear
    ? eventsData.data?.[selectedDayYear]?.[selectedDay]
    : [];

  return (
    <>
      <title>{currentApartment?.name}</title>
      <div
        className={`flex h-fit justify-between ${
          mobileView ? 'flex-col' : 'flex-row'
        }`}
      >
        <div className={`flex gap-3 font-bold ${mobileView && 'mb-6'}`}>
          <Dropdown
            placeholder='Select apartment'
            data={apartments?.map(apartment => {
              return {
                id: apartment.id,
                name: apartment.name,
                value: apartment,
              };
            })}
            selected={apartmentId}
            setData={item => {
              if (item.id !== apartmentId) {
                router.push(`${Routes.APARTMENT}?id=${item.id}`);
              }
            }}
          />
          <button
            className='h-10 rounded-md bg-blue-500 px-3 text-white drop-shadow-md hover:bg-blue-400'
            onClick={() =>
              router.push(`${Routes.PUBLIC_APARTMENT}?id=${apartmentId}`)
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
          {Info.weekdaysFormat('short', { locale }).map((day, index) => (
            <div
              key={index}
              className={`${style.dayName} select-none font-bold`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className={style.calendarGrid}>
          {dates.map((day, index) => {
            const objectOfDivs: ReactElement[] = [];
            const eventsForYearAndDate =
              eventsData.data?.[day.year]?.[day.date];
            if (eventsForYearAndDate) {
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
                  if (eventsForYearAndDate) {
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
                  {eventsForYearAndDate &&
                    eventsForYearAndDate?.length > 0 &&
                    eventsForYearAndDate.map(event => {
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
            events={eventsForSelectedDay ?? []}
            isMobileView={mobileView}
          />
        )}
        {(addNewEvent || showEditEvent) && (
          <CreateNewEvent
            show={addNewEvent}
            showEdit={showEditEvent}
            selectedDay={selectedDay}
            selectedEventToEdit={selectedEventToEdit}
            setShowEdit={setShowEditEvent}
            setShow={setAddNewEvent}
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
