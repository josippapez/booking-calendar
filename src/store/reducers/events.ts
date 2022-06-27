import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { Event } from '../../Components/Calendar/CalendarTypes';

type Events = {
  [key: string]: Event[];
};
export interface EventsData {
  events: Events;
}

const initialState: EventsData = {
  events: {},
};

export const events = createSlice({
  name: 'events',
  initialState,
  reducers: {
    saveEvents: (state, action: PayloadAction<Events>) => {
      state.events = action.payload;
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      if (state.events) {
        const tempEvents = {} as Events;
        Object.keys(state.events).map(key => {
          const filtered = state.events[key].filter(
            event => event.id !== action.payload
          );
          if (filtered.length > 0) {
            tempEvents[key] = filtered;
          }
        });
        state.events = tempEvents;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, (state, action) => {
      state.events = {};
    });
  },
});

export const { saveEvents, removeEvent } = events.actions;

export default events.reducer;
