import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from 'firebase/compat/app';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { PURGE } from 'redux-persist';

type Apartment = {
  id: string;
  name: string;
  address: string;
};

type Apartments = {
  [key: string]: Apartment;
};

export interface ApartmentsData {
  apartments: Apartments;
  selectedApartment: Apartment | null;
}

const initialState: ApartmentsData = {
  apartments: {},
  selectedApartment: null,
};

export const apartments = createSlice({
  name: 'apartments',
  initialState,
  reducers: {
    setApartments: (state, action: PayloadAction<Apartments>) => {
      state.apartments = action.payload;
    },
    saveApartment: (state, action: PayloadAction<Apartment>) => {
      state.apartments = {
        ...state.apartments,
        [action.payload.id]: action.payload,
      };
    },
    editApartment: (state, action: PayloadAction<Apartment>) => {
      state.apartments = {
        ...state.apartments,
        [action.payload.id]: action.payload,
      };
    },
    removeApartment: (state, action: PayloadAction<string>) => {
      if (state.apartments) {
        let tempApartments = {} as Apartments;
        tempApartments = { ...state.apartments };
        delete tempApartments[action.payload];
        state.apartments = tempApartments;
        deleteDoc(doc(getFirestore(firebase.app()), 'events', action.payload));
      }
    },
    selectApartment: (state, action: PayloadAction<Apartment | null>) => {
      state.selectedApartment = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, (state, action) => {
      state.apartments = {};
      state.selectedApartment = null;
    });
  },
});

export const {
  saveApartment,
  removeApartment,
  selectApartment,
  editApartment,
  setApartments,
} = apartments.actions;

export default apartments.reducer;
