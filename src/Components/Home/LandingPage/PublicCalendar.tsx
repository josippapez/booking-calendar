import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import { useNavigate, useParams } from 'react-router';
import isMobileView from '../../../checkForMobileView';
import calculateEachDayOfMonth from '../../../Hooks/calculateEachDayOfMonth';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setEvents } from '../../../store/reducers/events';
import Images from '../../../Styles/Assets/Images/Images';
import { Event } from '../../Calendar/CalendarTypes';
import style from './PublicCalendar.module.scss';

type Props = {};

const PublicCalendar = (props: Props) => {
  const dispatch = useAppDispatch();
  const naviagtionParams = useParams();
  const navigate = useNavigate();
  const firestore = useFirestore();

  const eventsData = useAppSelector(state => state.events.events);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    DateTime.local().month
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    DateTime.local().year
  );

  const mobileView = isMobileView();
  1;
  const { dates, nextMonthDates, lastMonthDates } = calculateEachDayOfMonth({
    year: selectedYear,
    month: selectedMonth,
  });

  const getEventsById = async (id: string) => {
    const event = (
      await firestore.collection('events').doc(`${id}/data/public`).get()
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

  return (
    <div
      className={`${isMobileView() ? 'py-10 px-2.5' : 'page-container p-10'}`}
    >
      <div className={`${style.dateNavigation} flex select-none gap-3`}>
        <div className='flex items-center border-t-2 border-b-2 w-36 rounded-md h-10'>
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
            className='bg-gray-200 hover:bg-gray-300 p-5 rounded-l-md'
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
            className='bg-gray-200 hover:bg-gray-300 p-5 rounded-r-md'
          />
        </div>
        <div className='flex items-center border-t-2 border-b-2 w-[165px] rounded-md h-10'>
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
            className='bg-gray-200 hover:bg-gray-300 p-5 rounded-l-md'
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
            className='bg-gray-200 hover:bg-gray-300 p-5 rounded-r-md'
          />
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
          {dates.map((day, index) => {
            const startingDay =
              index > 0 &&
              eventsData[day.date]?.length &&
              !eventsData[dates[index - 1].date]?.length;

            const endingDay =
              eventsData[day.date]?.length &&
              !(index < dates.length - 1
                ? eventsData[dates[index + 1].date]?.length
                : eventsData[nextMonthDates[0].date]?.length);

            return (
              <div
                key={index}
                className={`relative border-slate-300 border-t-2
                hover:border-blue-300 hover:border-2 ${
                  mobileView ? style.mobileGridItem : style.gridItem
                }`}
              >
                <div
                  className={`font-bold select-none h-full flex flex-col
                  overflow-hidden ${
                    ['Saturday', 'Sunday'].includes(day.name)
                      ? 'opacity-50'
                      : day.lastMonth
                      ? 'opacity-30 font-normal'
                      : 'opacity-100'
                  } ${eventsData[day.date]?.length > 0 && 'text-white'} ${
                    (endingDay || startingDay) && 'text-black'
                  }`}
                >
                  <div className='absolute top-0 left-0'>{day.day}</div>
                  <div
                    className={`h-full ${
                      eventsData[day.date]?.length > 0 && 'bg-red-600'
                    }
                    `}
                    style={{
                      background: startingDay
                        ? 'linear-gradient(to right top, transparent 50%, #DC2726 50.3%)'
                        : endingDay
                        ? 'linear-gradient(to right top, #DC2726 50%, transparent 50.3%)'
                        : '',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PublicCalendar;
