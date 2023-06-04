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

export type Event = {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  color?: string;
  phone: string;
  booking?: boolean;
  price?: string;
  weekNumber?: number;
};

export type PublicEventsByYear = {
  [key: string]: { [key: string]: { start: string; end: string }[] };
};
export type EventsByYear = { [key: string]: { [key: string]: Event[] } };

export type PublicEvent = {
  id: string;
  start: string;
  end: string;
};
