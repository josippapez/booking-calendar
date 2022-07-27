import { DateTime } from "luxon";
import { useMemo } from "react";
import { Day } from "../components/Calendar/CalendarTypes";

type Props = {
  month: number;
  year: number;
};

const useCalculateEachDayOfMonth = (
  props: Props
): {
  month: number;
  year: number;
  dates: Day[];
  lastMonthDates: Day[];
  nextMonthDates: Day[];
} => {
  const { month, year } = props;

  const calculateDates = (
    start: DateTime,
    end: DateTime,
    monthDates: Day[]
  ): Day[] => {
    const daysInMonth = end.diff(start, "days");
    for (let i = 0; i <= daysInMonth.days; i++) {
      const day = start.plus({ days: i });

      if (i === 0) {
        for (let index = start.get("weekday") - 1; index > 0; index--) {
          const dayOfLastMonth = start.minus({ days: index });
          monthDates.push({
            day: dayOfLastMonth.day,
            date: dayOfLastMonth.toFormat("yyyy-MM-dd"),
            name: dayOfLastMonth.toFormat("EEEE"),
            lastMonth: true,
            weekNumber: dayOfLastMonth.weekNumber,
          });
        }
      }
      monthDates.push({
        day: day.day,
        date: day.toFormat("yyyy-MM-dd"),
        name: day.toFormat("EEEE"),
        lastMonth: false,
        weekNumber: day.weekNumber,
      });
    }
    return monthDates;
  };

  return {
    month,
    year,
    lastMonthDates: useMemo(() => {
      let lastMonth = month - 1;
      let lastMonthYear = year;
      if (lastMonth === 0) {
        lastMonthYear--;
        lastMonth = 12;
      }
      const monthDates: Day[] = [];
      const start = DateTime.local(lastMonthYear, lastMonth).startOf("month");
      const end = DateTime.local(lastMonthYear, lastMonth).endOf("month");

      return calculateDates(start, end, monthDates);
    }, [month, year]),
    dates: useMemo(() => {
      const monthDates: Day[] = [];
      const start = DateTime.local(year, month).startOf("month");
      const end = DateTime.local(year, month).endOf("month");

      return calculateDates(start, end, monthDates);
    }, [month, year]),
    nextMonthDates: useMemo(() => {
      let nextMonth = month + 1;
      let nextMonthYear = year;
      if (nextMonth === 13) {
        nextMonthYear++;
        nextMonth = 1;
      }
      const monthDates: Day[] = [];
      const start = DateTime.local(nextMonthYear, nextMonth).startOf("month");
      const end = DateTime.local(nextMonthYear, nextMonth).endOf("month");

      return calculateDates(start, end, monthDates);
    }, [month, year]),
  };
};

export default useCalculateEachDayOfMonth;
