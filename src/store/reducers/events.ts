import { EventsByYear } from '@modules/Calendar/CalendarTypes';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

export interface EventsData {
  events: EventsByYear;
}

const initialState: EventsData = {
  events: {},
};

export const events = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<EventsByYear>) => {
      state.events = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, (state, action) => {
      state.events = {};
    });
  },
});

export const { setEvents } = events.actions;

export default events.reducer;
