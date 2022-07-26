import { DateTime, Info, Interval } from "luxon";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Events } from "../../../../store/reducers/events";
import Images from "../../../../public/Styles/Assets/Images/Images";
import calculateEachDayOfMonth from "../../../Hooks/calculateEachDayOfMonth";
import Modal from "../../Shared/Modal/Modal";
import { Day, Event } from "../CalendarTypes";
import style from "./DateRangePicker.module.scss";

type Props = {
  showDateRangePicker: boolean;
  setShowDateRangePicker: (state: boolean) => void;
  event: Event;
  setEvent: (event: Event) => void;
  disableForCurrentReservations?: boolean;
  currentReservations?: Events;
};

const DateRangePicker = (props: Props) => {
  const {
    showDateRangePicker,
    setShowDateRangePicker,
    setEvent,
    event,
    currentReservations,
    disableForCurrentReservations,
  } = props;

  const { t, i18n } = useTranslation();

  const [selectedYear, setSelectedYear] = useState<number>(
    DateTime.local().year
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    DateTime.local().month
  );

  const eachDayOfMonth = calculateEachDayOfMonth({
    year: selectedYear,
    month: selectedMonth,
  }).dates;
  const eachDayOfNextMonth = calculateEachDayOfMonth({
    year: selectedMonth + 1 === 13 ? selectedYear + 1 : selectedYear,
    month: selectedMonth + 1 === 13 ? 1 : selectedMonth + 1,
  }).dates;

  const [currentDate, setCurrentDate] = useState("");

  const displayDateRangeDays = (day: Day, index: number) => {
    const disabled =
      disableForCurrentReservations &&
      (DateTime.fromISO(day.date).diffNow("day").days < -1 ||
        (currentReservations &&
          currentReservations[day.date]?.length > 0 &&
          (currentReservations[day.date]?.length >= 2
            ? currentReservations[day.date].map(reservation => {
                const start = DateTime.fromISO(reservation.start);
                const end = DateTime.fromISO(reservation.end);
                const interval = Interval.fromDateTimes(start, end);
                return interval.contains(DateTime.fromISO(day.date));
              })
            : currentReservations[day.date][0].end !== day.date &&
              currentReservations[day.date][0].start !== day.date)));

    let selectedDaysContainDisabled: string[] | undefined = [];
    if (currentDate && currentReservations && event.start && !event.end) {
      selectedDaysContainDisabled = Interval.fromDateTimes(
        DateTime.fromISO(event.start),
        DateTime.fromISO(currentDate)
      )
        .splitBy({ days: 1 })
        .map(day => day.toISODate().split("/"))
        .find(
          day =>
            currentReservations[day[0]]?.length > 0 &&
            currentReservations[day[1]]?.length > 0
        );
    }

    return (
      <div
        key={index}
        onMouseOver={() => {
          if (event.start) {
            setCurrentDate(day.date);
          }
        }}
        onTouchStart={() => {
          if (event.start) {
            setCurrentDate(day.date);
          }
        }}
        className={`cursor-pointer
        ${style["dateRange-Day"]} font-bold select-none
        ${
          ["Saturday", "Sunday"].includes(day.name)
            ? "bg-opacity-60 text-neutral-500"
            : day.lastMonth
            ? "opacity-30 font-normal"
            : ""
        }
        ${event.start === day.date && "!bg-sky-600 text-white rounded-l-full"}
        ${event.end === day.date && "!bg-sky-600 text-white rounded-r-full"}
        ${
          event.start && event.end && !disabled
            ? Interval.fromDateTimes(
                DateTime.fromISO(event.start),
                DateTime.fromISO(event.end).plus({ days: 1 })
              ).contains(DateTime.fromISO(day.date))
              ? "bg-sky-300 !text-white"
              : "bg-white"
            : !disabled &&
              currentDate &&
              Interval.fromDateTimes(
                DateTime.fromISO(event.start),
                DateTime.fromISO(currentDate).plus({ days: 1 })
              ).contains(DateTime.fromISO(day.date))
            ? "bg-sky-200"
            : "bg-white"
        }
        ${
          disabled
            ? "opacity-10 cursor-not-allowed"
            : "hover:bg-sky-300 hover:text-white"
        }
        ${selectedDaysContainDisabled?.length && "cursor-not-allowed"}`}
        onMouseUp={() => {
          if (!disabled) {
            if (event.start && event.end) {
              setEvent({
                ...event,
                start: day.date,
                end: "",
              });
              return;
            }
            if (!event.start) {
              setEvent({
                ...event,
                start: day.date,
              });
              return;
            }
            if (event.start) {
              if (
                event.start === day.date ||
                selectedDaysContainDisabled?.length
              ) {
                return;
              }
              if (
                DateTime.fromISO(event.start).diff(
                  DateTime.fromISO(day.date),
                  "days"
                ).days > 0
              ) {
                setEvent({
                  ...event,
                  start: day.date,
                });
                return;
              }
              setEvent({
                ...event,
                end: day.date,
              });
            }
          }
        }}
      >
        {day.day}
      </div>
    );
  };

  const daysHeader = () => {
    return (
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
    );
  };

  return (
    <Modal
      animation="fade"
      show={showDateRangePicker}
      closeModal={() => setShowDateRangePicker(false)}
    >
      <div className="p-4 bg-white rounded-md relative">
        <div className="flex justify-center select-none gap-3 drop-shadow-md">
          <div className="flex items-center w-36 rounded-md h-10">
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
                backgroundImage: `url(/Styles/Assets/Images/left-arrow.svg)`,
                backgroundSize: "75%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              className="bg-neutral-50 hover:bg-neutral-100 rounded-l-md p-5"
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
              className="bg-neutral-50 hover:bg-neutral-100 rounded-r-md p-5"
            />
          </div>
          <div className="flex items-center w-[165px] rounded-md h-10">
            <button
              onClick={() => {
                setSelectedYear(selectedYear - 1);
              }}
              style={{
                backgroundImage: `url(/Styles/Assets/Images/left-arrow.svg)`,
                backgroundSize: "75%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
              className="bg-neutral-50 hover:bg-neutral-100 rounded-l-md p-5"
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
              className="bg-neutral-50 hover:bg-neutral-100 rounded-r-md p-5"
            />
          </div>
        </div>
        <div className={`${style.dateRangeGrid} my-4`}>
          <div>
            {daysHeader()}
            <div className={`${style.calendarGrid}`}>
              {eachDayOfMonth.map((day, index) =>
                displayDateRangeDays(day, index)
              )}
            </div>
          </div>
          <div>
            {daysHeader()}
            <div className={`${style.calendarGrid}`}>
              {eachDayOfNextMonth.map((day, index) =>
                displayDateRangeDays(day, index)
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="hover:bg-slate-200 font-bold py-2 px-4 rounded"
            onClick={() => {
              setShowDateRangePicker(false);
              setEvent({ ...event, start: "", end: "" });
            }}
          >
            {t("cancel")}
          </button>
          <button
            className="hover:bg-slate-200 font-bold py-2 px-4 rounded"
            onClick={() => {
              setEvent({
                ...event,
                start: "",
                end: "",
              });
            }}
          >
            {t("clear")}
          </button>
          <button
            className="hover:bg-slate-200 font-bold py-2 px-4 rounded"
            onClick={() => {
              setShowDateRangePicker(false);
              setEvent({
                ...event,
                start: event.start,
                end: event.end,
              });
            }}
          >
            {t("done")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DateRangePicker;
