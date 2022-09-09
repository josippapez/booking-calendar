import { DateTime, Info } from "luxon";
import { useTranslation } from "react-i18next";
import { Day } from "../../../Calendar/CalendarTypes";
import style from "./DatePickerDates.module.scss";

type Props = {
  currentMonthDates: Day[];
  nextMonthDates?: Day[];
  initialDate?: string;
  setDate?: (date: string) => void;
  disabledCondition?: boolean;
  customDisplayDate?: (day: Day, index: number) => JSX.Element;
};

const DatePickerDates = (props: Props) => {
  const {
    initialDate,
    setDate,
    disabledCondition,
    customDisplayDate,
    currentMonthDates,
    nextMonthDates,
  } = props;
  const { i18n } = useTranslation("DateRangePicker");

  const displayDate = (day: Day, index: number) => {
    if (customDisplayDate) {
      return customDisplayDate(day, index);
    }
    return defaultDisplayDate(day, index);
  };

  const defaultDisplayDate = (day: Day, index: number) => {
    const isToday = DateTime.local().hasSame(DateTime.fromISO(day.date), "day");
    const disabled = disabledCondition;

    return (
      <div
        key={index}
        className={`cursor-pointer
        ${initialDate === day.date && style.selectedDate}
        ${isToday && "border-2 border-blue-500"}
        ${style["dateRange-Day"]} font-bold select-none
        ${
          ["Saturday", "Sunday"].includes(day.name)
            ? "bg-opacity-60 text-neutral-500"
            : day.lastMonth
            ? "opacity-30 font-normal"
            : ""
        }`}
        onMouseUp={() => {
          if (!disabled && setDate) {
            setDate(day.date);
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
        {Info.weekdaysFormat("short", { locale: i18n.language }).map(
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
    <>
      {currentMonthDates && (
        <div>
          {daysHeader()}
          <div className={`${style.calendarGrid}`}>
            {currentMonthDates.map((day, index) => displayDate(day, index))}
          </div>
        </div>
      )}
      {nextMonthDates && (
        <div>
          {daysHeader()}
          <div className={`${style.calendarGrid}`}>
            {nextMonthDates.map((day, index) => displayDate(day, index))}
          </div>
        </div>
      )}
    </>
  );
};

export default DatePickerDates;
