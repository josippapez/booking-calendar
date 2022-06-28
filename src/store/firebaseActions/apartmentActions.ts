import firebase from 'firebase/compat/app';
import { doc, setDoc, getFirestore, deleteDoc } from 'firebase/firestore';
import { setApartments } from '../reducers/apartments';
import { AppDispatch, AppState } from './../store';

export const saveApartment = (apartment: {
  id: string;
  name: string;
  address: string;
}) => {
  return (dispatch: AppDispatch, getState: AppState) => {
    const tempApartments = {
      ...getState().apartments.apartments,
      [apartment.id]: apartment,
    };
    dispatch(setApartments(tempApartments));

    setDoc(
      doc(getFirestore(firebase.app()), 'apartments', getState().user.user.id),
      tempApartments
    );
  };
};

export const editApartment = (apartment: {
  id: string;
  name: string;
  address: string;
}) => {
  return (dispatch: AppDispatch, getState: AppState) => {
    const tempApartments = {
      ...getState().apartments.apartments,
      [apartment.id]: apartment,
    };

    dispatch(setApartments(tempApartments));
    setDoc(
      doc(getFirestore(firebase.app()), 'apartments', getState().user.user.id),
      tempApartments
    );
  };
};

export const removeApartment = (apartmentId: string) => {
  return (dispatch: AppDispatch, getState: AppState) => {
    const tempApartments = { ...getState().apartments.apartments };
    delete tempApartments[apartmentId];

    dispatch(setApartments(tempApartments));

    deleteDoc(doc(getFirestore(firebase.app()), 'events', apartmentId));
    setDoc(
      doc(getFirestore(firebase.app()), 'apartments', getState().user.user.id),
      tempApartments
    );
  };
};
