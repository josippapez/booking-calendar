import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

export type Apartment = {
  id: string;
  name: string;
  address: string;
  email: string;
  image: string;
  iban?: string;
  pid?: string;
  owner?: string;
};

type Apartments = Apartment[];

export interface ApartmentsData {
  apartments: Apartments;
  selectedApartment: Apartment | null;
}

const initialState: ApartmentsData = {
  apartments: [],
  selectedApartment: null,
};

export const apartments = createSlice({
  name: "apartments",
  initialState,
  reducers: {
    setApartments: (state, action: PayloadAction<Apartments>) => {
      state.apartments = action.payload;
    },
    selectApartment: (state, action: PayloadAction<Apartment | null>) => {
      state.selectedApartment = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, (state, action) => {
      state.apartments = [];
      state.selectedApartment = null;
    });
  },
});

export const { selectApartment, setApartments } = apartments.actions;

export default apartments.reducer;
