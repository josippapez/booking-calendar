export enum DayName {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export type Day = {
  [key: string]: number | string | boolean | undefined;
  day: number;
  date: string;
  year: string;
  name: string;
  lastMonth?: boolean;
  nextMonth?: boolean;
  weekNumber: number;
};
