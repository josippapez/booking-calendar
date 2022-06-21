import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { Day } from './../Components/Calendar/CalendarTypes';

type Props = {
  month: number;
  year: number;
};

const calculateEachDayOfMonth = (props: Props) => {
  const { month, year } = props;

  return {
    month,
    year,
    dates: useMemo(() => {
      const monthDates: Day[] = [];
      const start = DateTime.local(year, month).startOf('month');
      const end = DateTime.local(year, month).endOf('month');

      const daysInMonth = end.diff(start, 'days');
      for (let i = 0; i <= daysInMonth.days; i++) {
        const day = start.plus({ days: i });

        if (i === 0) {
          for (let index = start.get('weekday') - 1; index > 0; index--) {
            const dayOfLastMonth = start.minus({ days: index });
            monthDates.push({
              day: dayOfLastMonth.day,
              date: dayOfLastMonth.toFormat('yyyy-MM-dd'),
              name: dayOfLastMonth.toFormat('EEEE'),
              lastMonth: true,
            });
          }
        }
        monthDates.push({
          day: day.day,
          date: day.toFormat('yyyy-MM-dd'),
          name: day.toFormat('EEEE'),
          lastMonth: false,
        });
      }

      return monthDates;
    }, [month, year]),
  };
};

export default calculateEachDayOfMonth;
