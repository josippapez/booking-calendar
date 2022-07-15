import firebase from 'firebase/compat/app';
import { deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { setApartments } from '../reducers/apartments';
import { AppDispatch, AppState } from './../store';

export const saveApartment = (apartment: {
  id: string;
  name: string;
  address: string;
  email: string;
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

    setDoc(doc(getFirestore(firebase.app()), 'events', apartment.id), {
      userId: getState().user.user.id,
    });
  };
};

export const editApartment = (apartment: {
  id: string;
  name: string;
  address: string;
  email: string;
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

    setDoc(doc(getFirestore(firebase.app()), 'events', apartment.id), {
      userId: getState().user.user.id,
    });
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
