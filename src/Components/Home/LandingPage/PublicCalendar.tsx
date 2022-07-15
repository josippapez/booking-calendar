import { DateTime, Info } from 'luxon';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFirestore } from 'react-redux-firebase';
import { useNavigate, useParams } from 'react-router';
import isMobileView from '../../../checkForMobileView';
import calculateEachDayOfMonth from '../../../Hooks/calculateEachDayOfMonth';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setEvents } from '../../../store/reducers/events';
import Images from '../../../Styles/Assets/Images/Images';
import { Event } from '../../Calendar/CalendarTypes';
import CreateNewReservation from '../../Calendar/CreateNewReservation/CreateNewReservation';
import style from './PublicCalendar.module.scss';

type Props = {};

const PublicCalendar = (props: Props) => {
  const { t, i18n } = useTranslation();
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
  const [displayNewReservation, setDisplayNewReservation] =
    useState<boolean>(false);
  const [apartmentEmail, setApartmentEmail] = useState('');

  const mobileView = isMobileView();
  1;
  const { dates, nextMonthDates } = calculateEachDayOfMonth({
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

  const getApartmentEmail = async (id: string) => {
    const eventsUserId = (
      await firestore.collection('events').doc(`${id}`).get()
    ).data();

    if (eventsUserId) {
      const apartment = (
        await firestore
          .collection('apartments')
          .doc(`${eventsUserId.userId}`)
          .get()
      ).data();
      if (!apartment) {
        return;
      }
      setApartmentEmail(apartment[id].email);
    }
  };

  useEffect(() => {
    if (naviagtionParams && naviagtionParams.id) {
      getEventsById(naviagtionParams.id);
      getApartmentEmail(naviagtionParams.id);
    }
  }, [navigate]);

  return (
    <div
      className={`${isMobileView() ? 'py-10 px-2.5' : 'page-container p-10'}`}
    >
      <div
        className={`flex ${
          isMobileView() ? 'justify-around' : 'justify-between'
        }  items-center`}
      >
        <div className={`${style.dateNavigation} flex select-none gap-3`}>
          <div
            className={`flex items-center border-t-2 border-b-2 ${
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
              className={`bg-gray-200 hover:bg-gray-300 rounded-l-md p-5`}
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
              className={`bg-gray-200 hover:bg-gray-300 rounded-r-md p-5`}
            />
          </div>
          <div
            className={`flex items-center border-t-2 border-b-2 rounded-md h-10 w-[165px]`}
          >
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
              className={`bg-gray-200 hover:bg-gray-300 rounded-l-md p-5`}
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
              className={`bg-gray-200 hover:bg-gray-300 rounded-r-md p-5`}
            />
          </div>
        </div>
        <div
          className={`${
            isMobileView() ? 'flex flex-col' : 'flex items-center'
          } gap-3`}
        >
          {!isMobileView() && (
            <div className='flex gap-3'>
              <div>{t('can_be_reserved')}:</div>
              <div className='flex'>
                <div className='h-6 w-6 border-2 bg-white' />
                <img src={Images.CheckGreen} className='h-6 w-6' />
              </div>
              <div className='flex'>
                <div
                  className='h-6 w-6 border-2'
                  style={{
                    background:
                      'linear-gradient(to right bottom, transparent 50%, #DC2726 50.3%)',
                  }}
                />
                <img src={Images.CheckGreen} className='h-6 w-6' />
              </div>
              <div className='flex'>
                <div className='h-6 w-6 bg-red-600 border-2' />
                <img src={Images.XCircle} className='h-6 w-6' />
              </div>
            </div>
          )}
          <button
            className='bg-blue-500 hover:bg-blue-400 rounded-md font-bold text-white px-3 py-2 h-fit'
            onClick={() => setDisplayNewReservation(true)}
          >
            {t('create_reservation')}
          </button>
        </div>
      </div>
      {isMobileView() && (
        <div className='flex gap-3 mt-3 items-center justify-center'>
          <div>{t('can_be_reserved')}:</div>
          <div className='flex'>
            <div className='h-6 w-6 border-2 bg-white' />
            <img src={Images.CheckGreen} className='h-6 w-6' />
          </div>
          <div className='flex'>
            <div
              className='h-6 w-6 border-2'
              style={{
                background:
                  'linear-gradient(to right bottom, transparent 50%, #DC2726 50.3%)',
              }}
            />
            <img src={Images.CheckGreen} className='h-6 w-6' />
          </div>
          <div className='flex'>
            <div className='h-6 w-6 bg-red-600 border-2' />
            <img src={Images.XCircle} className='h-6 w-6' />
          </div>
        </div>
      )}
      <div className={style.calendar}>
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
          {dates.map((day, index) => {
            const startingDay =
              index > 0 &&
              eventsData &&
              eventsData[day.date]?.length &&
              !eventsData[dates[index - 1].date]?.length;

            const endingDay =
              eventsData &&
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
                  } ${
                    eventsData &&
                    eventsData[day.date]?.length > 0 &&
                    'text-white'
                  } ${startingDay && 'text-black'}`}
                >
                  <div className='absolute top-0 left-0'>{day.day}</div>
                  <div
                    className={`h-full ${
                      eventsData &&
                      eventsData[day.date]?.length > 0 &&
                      'bg-red-600'
                    }
                    `}
                    style={{
                      background: startingDay
                        ? 'linear-gradient(to right bottom, transparent 50%, #DC2726 50.3%)'
                        : endingDay
                        ? 'linear-gradient(to right bottom, #DC2726 50%, transparent 50.3%)'
                        : '',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CreateNewReservation
        show={displayNewReservation}
        setShow={setDisplayNewReservation}
        currentReservations={eventsData}
        apartmentEmail={apartmentEmail}
      />
    </div>
  );
};

export default PublicCalendar;
