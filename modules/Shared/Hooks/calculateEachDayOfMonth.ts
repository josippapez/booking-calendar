import { Day } from '@modules/Calendar/CalendarTypes';
import { DateTime } from 'luxon';
import { useCallback, useMemo, useState } from 'react';

type Props = {
  startMonth: number;
  startYear: number;
};

export const useCalculateEachDayOfMonth = ({
  startMonth,
  startYear,
}: Props): {
  month: number;
  year: number;
  setmonth: (month: number) => void;
  setyear: (year: number) => void;
  lastMonth: number;
  lastMonthYear: number;
  nextMonth: number;
  nextMonthYear: number;
  dates: Day[];
  lastMonthDates: Day[];
  nextMonthDates: Day[];
} => {
  const [month, setmonth] = useState(startMonth);
  const [year, setyear] = useState(startYear);

  let lastMonth = month - 1;
  let lastMonthYear = year;
  if (lastMonth === 0) {
    lastMonthYear--;
    lastMonth = 12;
  }
  let nextMonth = month + 1;
  let nextMonthYear = year;
  if (nextMonth === 13) {
    nextMonthYear++;
    nextMonth = 1;
  }
  const calculateDates = useCallback(
    (start: DateTime, end: DateTime): Day[] => {
      const monthDates: Day[] = [];
      const daysInMonth = end.diff(start, ['days', 'hours']);
      for (let i = 0; i <= daysInMonth.days; i++) {
        const day = start.plus({ days: i });

        if (i === 0) {
          for (let index = start.get('weekday') - 1; index > 0; index--) {
            const dayOfLastMonth = start.minus({ days: index });
            monthDates.push({
              day: dayOfLastMonth.day,
              date: dayOfLastMonth.toFormat('yyyy-MM-dd'),
              name: dayOfLastMonth.toFormat('EEEE'),
              year: dayOfLastMonth.toFormat('yyyy'),
              lastMonth: true,
              weekNumber: dayOfLastMonth.weekNumber,
            });
          }
        }
        monthDates.push({
          day: day.day,
          date: day.toFormat('yyyy-MM-dd'),
          name: day.toFormat('EEEE'),
          year: day.toFormat('yyyy'),
          weekNumber: day.weekNumber,
        });
        if (i === daysInMonth.days && end.get('weekday') !== 7) {
          for (let index = 1; index <= 7 - end.get('weekday'); index++) {
            const dayOfNextMonth = end.plus({ days: index });
            monthDates.push({
              day: dayOfNextMonth.day,
              date: dayOfNextMonth.toFormat('yyyy-MM-dd'),
              name: dayOfNextMonth.toFormat('EEEE'),
              year: dayOfNextMonth.toFormat('yyyy'),
              nextMonth: true,
              weekNumber: dayOfNextMonth.weekNumber,
            });
          }
        }
      }
      return monthDates;
    },
    []
  );

  const lastMonthDates = useMemo(() => {
    const start = DateTime.local(lastMonthYear, lastMonth).startOf('month');
    const end = DateTime.local(lastMonthYear, lastMonth).endOf('month');

    return calculateDates(start, end);
  }, [calculateDates, lastMonth, lastMonthYear]);

  const nextMonthDates = useMemo(() => {
    const start = DateTime.local(nextMonthYear, nextMonth).startOf('month');
    const end = DateTime.local(nextMonthYear, nextMonth).endOf('month');

    return calculateDates(start, end);
  }, [calculateDates, nextMonth, nextMonthYear]);

  const thisMonthDates = useMemo(() => {
    const start = DateTime.local(year, month).startOf('month');
    const end = DateTime.local(year, month).endOf('month');

    return calculateDates(start, end);
  }, [calculateDates, month, year]);

  return {
    month,
    year,
    setmonth,
    setyear,
    lastMonth,
    lastMonthYear,
    nextMonth,
    nextMonthYear,
    lastMonthDates,
    dates: thisMonthDates,
    nextMonthDates,
  };
};
