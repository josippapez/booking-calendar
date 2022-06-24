import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '../../Components/Calendar/CalendarTypes';

export interface EventsData {
  events: { [key: string]: Event[] };
}

const initialState: Partial<EventsData> = {
  events: {},
};

export const events = createSlice({
  name: 'events',
  initialState,
  reducers: {
    saveEvents: (state, action: PayloadAction<EventsData>) => {
      state.events = action.payload.events;
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      if (state.events && state.events[action.payload]) {
        delete state.events[action.payload];
      }
    },
  },
});

export const { saveEvents, removeEvent } = events.actions;

export default events.reducer;
