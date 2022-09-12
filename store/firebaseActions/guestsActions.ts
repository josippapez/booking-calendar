import firebase from "firebase/compat/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Guest } from "../../src/components/Guests/GuestsModal/AddNewGuest";
import { setGuests } from "../reducers/guests";
import { AppDispatch, AppState } from "../store";

export const saveGuestForApartment = (guest: Guest) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;

    if (selectedApartment && selectedApartment.id) {
      const guestsForAppartment = getState().guests.guests;
      const newGuestForMonth = {
        ...guestsForAppartment,
        [guest.dateOfArrival.split("-")[1]]: {
          ...guestsForAppartment[guest.dateOfArrival.split("-")[1]],
          [crypto.randomUUID()]: guest,
        },
      };

      await setDoc(
        doc(
          getFirestore(firebase.app()),
          `guests/${selectedApartment.id}/data`,
          guest.dateOfArrival.split("-")[0]
        ),
        newGuestForMonth
      );

      dispatch(setGuests(newGuestForMonth));
    }
  };
};
