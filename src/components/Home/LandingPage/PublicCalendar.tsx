import { useCalculateEachDayOfMonth } from '@/Hooks';
import { Unsubscribe } from 'firebase/firestore';
import { DateTime, Info } from 'luxon';
import { InferGetServerSidePropsType, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getServerSideProps } from '../../../../pages/[id]';
import Images from '../../../../public/Styles/Assets/Images/Images';
import { FirebaseCollectionActions } from '../../../Hooks/FirebaseCollectionActions';
import { useMobileView } from '../../../checkForMobileView';
import { EventsByYear } from '../../Calendar/CalendarTypes';
import CreateNewReservation from '../../Calendar/CreateNewReservation/CreateNewReservation';
import style from './PublicCalendar.module.scss';

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const PublicCalendar: NextPage = (props: Props) => {
  const { apartmentEmail, apartmentLogo, apartmentName } = props;
  const { t, i18n } = useTranslation('PublicCalendar');
  const mobileView = useMobileView();
  const router = useRouter();

  const [events, setEvents] = useState<EventsByYear>({});
  const [displayNewReservation, setDisplayNewReservation] =
    useState<boolean>(false);

  const {
    lastMonthDates,
    dates,
    nextMonthDates,
    year,
    month,
    setyear,
    setmonth,
  } = useCalculateEachDayOfMonth({
    startYear: DateTime.local().year,
    startMonth: DateTime.local().month,
  });

  let touchMoveHorizontal: null | number = null;
  let currentScrollPosition: null | number = null;

  const calendarGrid = useRef<null | HTMLDivElement>(null);
  const unsubscribe = useRef<Unsubscribe | undefined>(undefined);

  useEffect(() => {
    const { listenById } = FirebaseCollectionActions('events');

    unsubscribe.current = listenById(`${router.query.id}/data/public`, data => {
      setEvents(data as EventsByYear);
    });

    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }
    };
  }, [router.query.id]);

  return (
    <div>
      <title>{apartmentName}</title>
      {apartmentName && (
        <div className='mb-5 flex items-center gap-10'>
          <div className=' text-2xl font-bold text-blue-700'>
            {apartmentName}
          </div>
          {apartmentLogo && (
            <div className='relative h-fit w-fit'>
              <Image
                src={apartmentLogo}
                alt={apartmentName}
                className='rounded'
                width={150}
                height={150}
              />
            </div>
          )}
        </div>
      )}
      <div className={`flex items-center justify-between`}>
        <div
          className={`${style.dateNavigation} flex select-none gap-3 drop-shadow-md`}
        >
          <div
            className={`flex items-center ${
              mobileView ? 'w-[165px]' : 'w-36'
            } h-10 rounded-md`}
          >
            <button
              disabled={DateTime.local(year, month).diffNow().as('months') < 0}
              onClick={() => {
                if (month === 1) {
                  setmonth(12);
                  setyear(year - 1);
                  return;
                }
                setmonth(month - 1);
              }}
              style={{
                backgroundImage: `url(/Styles/Assets/Images/left-arrow.svg)`,
                backgroundSize: '75%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
              className={`rounded-l-md p-5 hover:bg-neutral-100 disabled:bg-neutral-300`}
            />
            <h2 className='w-full select-none px-5 text-center font-bold'>
              {month}
            </h2>
            <button
              onClick={() => {
                if (month === 12) {
                  setmonth(1);
                  setyear(year + 1);
                  return;
                }
                setmonth(month + 1);
              }}
              style={{
                backgroundImage: `url(/Styles/Assets/Images/right-arrow.svg)`,
                backgroundSize: '75%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
              className={`rounded-r-md p-5 hover:bg-neutral-100`}
            />
          </div>
          <div className={`flex h-10 w-[165px] items-center rounded-md`}>
            <button
              disabled={DateTime.local(year).diffNow().as('year') < 0}
              onClick={() => {
                setyear(year - 1);

                setmonth(DateTime.now().month);
              }}
              style={{
                backgroundImage: `url(/Styles/Assets/Images/left-arrow.svg)`,
                backgroundSize: '75%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
              className={`rounded-l-md p-5 hover:bg-neutral-100 disabled:bg-neutral-300`}
            />
            <h2 className='w-full select-none px-5 text-center font-bold'>
              {year}
            </h2>
            <button
              onClick={() => {
                setyear(year + 1);
              }}
              style={{
                backgroundImage: `url(/Styles/Assets/Images/right-arrow.svg)`,
                backgroundSize: '75%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
              className={`rounded-r-md p-5 hover:bg-neutral-100`}
            />
          </div>
        </div>
        <div
          className={`${
            mobileView ? 'flex flex-col' : 'flex items-center'
          } select-none gap-3 drop-shadow-md`}
        >
          {!mobileView && (
            <div className='flex gap-3'>
              <div className='font-semibold'>{t('can_be_reserved')}:</div>
              <div className='flex'>
                <div className='h-6 w-6 border-2 bg-white' />
                <Image alt='' src={Images.CheckGreen} className='h-6 w-6' />
              </div>
              <div className='flex'>
                <div
                  className='h-6 w-6 border-2'
                  style={{
                    background:
                      'linear-gradient(to right bottom, white 50%, #DC2726 50.3%)',
                  }}
                />
                <Image alt='' src={Images.CheckGreen} className='h-6 w-6' />
              </div>
              <div className='flex'>
                <div className='h-6 w-6 border-2 bg-red-600' />
                <Image alt='' src={Images.XCircle} className='h-6 w-6' />
              </div>
            </div>
          )}
          <button
            className='h-fit rounded-md bg-blue-700 px-3 py-2 font-bold text-white hover:bg-blue-500'
            onClick={() => setDisplayNewReservation(true)}
          >
            {t('create_reservation')}
          </button>
        </div>
      </div>
      {mobileView && (
        <div className='mt-6 flex items-center justify-center gap-3 drop-shadow-md'>
          <div className='font-semibold'>{t('can_be_reserved')}:</div>
          <div className='flex'>
            <div className='h-6 w-6 border-2 bg-white' />
            <Image alt='' src={Images.CheckGreen} className='h-6 w-6' />
          </div>
          <div className='flex'>
            <div
              className='h-6 w-6 border-2'
              style={{
                background:
                  'linear-gradient(to right bottom, white 50%, #DC2726 50.3%)',
              }}
            />
            <Image alt='' src={Images.CheckGreen} className='h-6 w-6' />
          </div>
          <div className='flex'>
            <div className='h-6 w-6 border-2 bg-red-600' />
            <Image alt='' src={Images.XCircle} className='h-6 w-6' />
          </div>
        </div>
      )}
      <div
        ref={calendarGrid}
        className={`${style.calendar} relative drop-shadow-md transition-all duration-75`}
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
            if (
              month === 1 &&
              DateTime.local(year, month).diffNow().as('months') >= 0 &&
              DateTime.local(year, month).diffNow().as('year') >= 0
            ) {
              setmonth(12);
              setyear(year - 1);
              return;
            }
            if (DateTime.local(year, month).diffNow().as('months') >= 0) {
              setmonth(month - 1);
            }
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
            const startingDay =
              index > 0 &&
              events &&
              events[day.year] &&
              events[day.year][day.date]?.length &&
              !(index > 0
                ? events[day.year][dates[index - 1].date]?.length ||
                  events[Number(day.year) - 1]?.[dates[index - 1].date]?.length
                : events[lastMonthDates[lastMonthDates.length - 1].year][
                    lastMonthDates[lastMonthDates.length - 1].date
                  ]?.length);

            const endingDay =
              events &&
              events[day.year] &&
              events[day.year][day.date]?.length &&
              !(index < dates.length - 1
                ? events[day.year][dates[index + 1].date]?.length ||
                  events[Number(day.year) + 1]?.[dates[index + 1].date]?.length
                : events[nextMonthDates[0].year][nextMonthDates[0].date]
                    ?.length);

            return DateTime.fromISO(day.date).diffNow('day').days > -1 ? (
              <div
                key={index}
                className={`relative shadow-[0_-1px_1px_#cbd5e1]
                hover:border-2 hover:border-t-0 hover:border-blue-300 hover:shadow-[0_-2px_1px_#93C5FD] ${
                  mobileView ? style.mobileGridItem : style.gridItem
                }`}
              >
                <div
                  className={`flex h-full select-none flex-col overflow-hidden
                  font-semibold ${
                    ['Saturday', 'Sunday'].includes(day.name)
                      ? 'opacity-50'
                      : day.lastMonth
                      ? 'font-normal opacity-30'
                      : 'opacity-100'
                  } ${
                    events &&
                    events[day.year] &&
                    events[day.year][day.date]?.length > 0 &&
                    'text-white'
                  } ${startingDay && 'text-black'}`}
                >
                  <div className='absolute left-0 top-0'>{day.day}</div>
                  <div
                    className={`h-full ${
                      events &&
                      events[day.year] &&
                      events[day.year][day.date]?.length > 0 &&
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
            ) : (
              <div
                key={index}
                className={`relative shadow-[0_-1px_1px_#cbd5e1]
              hover:border-2 hover:border-t-0 hover:border-blue-300 hover:shadow-[0_-2px_1px_#93C5FD] ${
                mobileView ? style.mobileGridItem : style.gridItem
              }`}
              >
                <div
                  className={`flex h-full select-none flex-col overflow-hidden
                font-semibold ${
                  ['Saturday', 'Sunday'].includes(day.name)
                    ? 'opacity-50'
                    : day.lastMonth
                    ? 'font-normal opacity-30'
                    : 'opacity-100'
                }`}
                >
                  <div className='absolute left-0 top-0'>{day.day}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CreateNewReservation
        show={displayNewReservation}
        setShow={setDisplayNewReservation}
        currentReservations={events}
        apartmentEmail={apartmentEmail}
      />
    </div>
  );
};

export default PublicCalendar;
