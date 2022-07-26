import { DateTime, Info } from "luxon";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFirestore } from "react-redux-firebase";
import isMobileView from "../src/checkForMobileView";
import CreateNewReservation from "../src/components/Calendar/CreateNewReservation/CreateNewReservation";
import calculateEachDayOfMonth from "../src/Hooks/calculateEachDayOfMonth";
import { setEvents } from "../store/reducers/events";
import Images from "../public/Styles/Assets/Images/Images";
import style from "../src/components/Home/LandingPage/PublicCalendar.module.scss";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Event } from "../src/components/Calendar/CalendarTypes";

type Props = {};

const PublicCalendar: NextPage = (props: Props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useRouter();
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
  const [apartmentEmail, setApartmentEmail] = useState("");
  const [apartmentName, setApartmentName] = useState("");
  const [apartmentLogo, setApartmentLogo] = useState("");

  const mobileView = useMemo(() => isMobileView(), []);

  const { dates, nextMonthDates } = calculateEachDayOfMonth({
    year: selectedYear,
    month: selectedMonth,
  });

  let touchMoveHorizontal: null | number = null;
  let currentScrollPosition: null | number = null;

  const calendarGrid = useRef<null | HTMLDivElement>(null);

  const getEventsById = async (id: string) => {
    const event = (
      await firestore.collection("events").doc(`${id}/data/public`).get()
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
      await firestore.collection("events").doc(`${id}`).get()
    ).data();

    if (eventsUserId) {
      const apartment = (
        await firestore
          .collection("apartments")
          .doc(`${eventsUserId.userId}`)
          .get()
      ).data();
      if (!apartment) {
        return;
      }
      setApartmentLogo(apartment[id].image);
      setApartmentEmail(apartment[id].email);
      setApartmentName(apartment[id].name);
    }
  };

  useEffect(() => {
    if (
      navigate &&
      navigate.query.id &&
      typeof navigate.query.id === "string"
    ) {
      getEventsById(navigate.query.id);
      getApartmentEmail(navigate.query.id);
    }
  }, [navigate.query.id]);

  return (
    <div>
      {apartmentName && (
        <div className="mb-5 flex items-center gap-10">
          <div className=" font-bold text-2xl text-blue-700">
            {apartmentName}
          </div>
          {apartmentLogo && (
            <div className="relative h-20 w-48">
              <Image
                src={apartmentLogo}
                alt={apartmentName}
                layout="fill"
                objectFit="contain"
                className="rounded"
              />
            </div>
          )}
        </div>
      )}
      <div className={`flex justify-between items-center`}>
        <div
          className={`${style.dateNavigation} flex select-none gap-3 drop-shadow-md`}
        >
          <div
            className={`flex items-center ${
              mobileView ? "w-[165px]" : "w-36"
            } rounded-md h-10`}
          >
            <button
              disabled={
                DateTime.local(selectedYear, selectedMonth)
                  .diffNow()
                  .as("months") < 0
              }
              onClick={() => {
                if (selectedMonth === 1) {
                  setSelectedMonth(12);
                  setSelectedYear(selectedYear - 1);
                  return;
                }
                setSelectedMonth(selectedMonth - 1);
              }}
              style={{
                backgroundImage: `url(/Styles/Assets/Images/left-arrow.svg)`,
                backgroundSize: "75%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              className={`hover:bg-neutral-100 p-5 rounded-l-md disabled:bg-neutral-300`}
            />
            <h2 className="w-full text-center px-5 select-none font-bold">
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
                backgroundImage: `url(/Styles/Assets/Images/right-arrow.svg)`,
                backgroundSize: "75%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              className={`hover:bg-neutral-100 p-5 rounded-r-md`}
            />
          </div>
          <div className={`flex items-center rounded-md h-10 w-[165px]`}>
            <button
              disabled={DateTime.local(selectedYear).diffNow().as("year") < 0}
              onClick={() => {
                setSelectedYear(selectedYear - 1);
                if (
                  DateTime.local(selectedYear - 1, selectedMonth)
                    .diffNow()
                    .as("year") < 0
                ) {
                  setSelectedMonth(DateTime.now().month);
                }
              }}
              style={{
                backgroundImage: `url(/Styles/Assets/Images/left-arrow.svg)`,
                backgroundSize: "75%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              className={`hover:bg-neutral-100 p-5 rounded-l-md disabled:bg-neutral-300`}
            />
            <h2 className="w-full text-center px-5 select-none font-bold">
              {selectedYear}
            </h2>
            <button
              onClick={() => {
                setSelectedYear(selectedYear + 1);
              }}
              style={{
                backgroundImage: `url(/Styles/Assets/Images/right-arrow.svg)`,
                backgroundSize: "75%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              className={`hover:bg-neutral-100 p-5 rounded-r-md`}
            />
          </div>
        </div>
        <div
          className={`${
            mobileView ? "flex flex-col" : "flex items-center"
          } gap-3 select-none drop-shadow-md`}
        >
          {!mobileView && (
            <div className="flex gap-3">
              <div className="font-semibold">{t("can_be_reserved")}:</div>
              <div className="flex">
                <div className="h-6 w-6 border-2 bg-white" />
                <Image alt="" src={Images.CheckGreen} className="h-6 w-6" />
              </div>
              <div className="flex">
                <div
                  className="h-6 w-6 border-2"
                  style={{
                    background:
                      "linear-gradient(to right bottom, white 50%, #DC2726 50.3%)",
                  }}
                />
                <Image alt="" src={Images.CheckGreen} className="h-6 w-6" />
              </div>
              <div className="flex">
                <div className="h-6 w-6 bg-red-600 border-2" />
                <Image alt="" src={Images.XCircle} className="h-6 w-6" />
              </div>
            </div>
          )}
          <button
            className="bg-blue-500 hover:bg-blue-400 rounded-md font-bold text-white px-3 py-2 h-fit"
            onClick={() => setDisplayNewReservation(true)}
          >
            {t("create_reservation")}
          </button>
        </div>
      </div>
      {mobileView && (
        <div className="flex gap-3 mt-6 items-center justify-center drop-shadow-md">
          <div className="font-semibold">{t("can_be_reserved")}:</div>
          <div className="flex">
            <div className="h-6 w-6 border-2 bg-white" />
            <Image alt="" src={Images.CheckGreen} className="h-6 w-6" />
          </div>
          <div className="flex">
            <div
              className="h-6 w-6 border-2"
              style={{
                background:
                  "linear-gradient(to right bottom, white 50%, #DC2726 50.3%)",
              }}
            />
            <Image alt="" src={Images.CheckGreen} className="h-6 w-6" />
          </div>
          <div className="flex">
            <div className="h-6 w-6 bg-red-600 border-2" />
            <Image alt="" src={Images.XCircle} className="h-6 w-6" />
          </div>
        </div>
      )}
      <div
        ref={calendarGrid}
        className={`${style.calendar} drop-shadow-md transition-all duration-75 relative`}
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
            calendarGrid.current.style.left = "0px";
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
          {Info.weekdaysFormat("short", { locale: i18n.languages[0] }).map(
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

            return DateTime.fromISO(day.date).diffNow("day").days > -1 ? (
              <div
                key={index}
                className={`relative shadow-[0_-1px_1px_#cbd5e1]
                hover:shadow-[0_-2px_1px_#93C5FD] hover:border-2 hover:border-t-0 hover:border-blue-300 ${
                  mobileView ? style.mobileGridItem : style.gridItem
                }`}
              >
                <div
                  className={`font-semibold select-none h-full flex flex-col
                  overflow-hidden ${
                    ["Saturday", "Sunday"].includes(day.name)
                      ? "opacity-50"
                      : day.lastMonth
                      ? "opacity-30 font-normal"
                      : "opacity-100"
                  } ${
                    eventsData &&
                    eventsData[day.date]?.length > 0 &&
                    "text-white"
                  } ${startingDay && "text-black"}`}
                >
                  <div className="absolute top-0 left-0">{day.day}</div>
                  <div
                    className={`h-full ${
                      eventsData &&
                      eventsData[day.date]?.length > 0 &&
                      "bg-red-600"
                    }
                    `}
                    style={{
                      background: startingDay
                        ? "linear-gradient(to right bottom, transparent 50%, #DC2726 50.3%)"
                        : endingDay
                        ? "linear-gradient(to right bottom, #DC2726 50%, transparent 50.3%)"
                        : "",
                    }}
                  />
                </div>
              </div>
            ) : (
              <div
                key={index}
                className={`relative shadow-[0_-1px_1px_#cbd5e1]
              hover:shadow-[0_-2px_1px_#93C5FD] hover:border-2 hover:border-t-0 hover:border-blue-300 ${
                mobileView ? style.mobileGridItem : style.gridItem
              }`}
              >
                <div
                  className={`font-semibold select-none h-full flex flex-col
                overflow-hidden ${
                  ["Saturday", "Sunday"].includes(day.name)
                    ? "opacity-50"
                    : day.lastMonth
                    ? "opacity-30 font-normal"
                    : "opacity-100"
                }`}
                >
                  <div className="absolute top-0 left-0">{day.day}</div>
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
