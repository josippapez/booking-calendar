import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { Guest } from "../../src/components/Guests/GuestsModal/AddNewGuest";

export type Guests = {
  [key: string]: {
    [key: string]: Guest;
  };
};
export interface GuestsData {
  guests: Guests;
}

const initialState: GuestsData = {
  guests: {},
};

export const guests = createSlice({
  name: "guests",
  initialState,
  reducers: {
    setGuests: (state, action: PayloadAction<Guests>) => {
      state.guests = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, (state, action) => {
      state.guests = {};
    });
  },
});

export const { setGuests } = guests.actions;

export default guests.reducer;
