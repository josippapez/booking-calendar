import firebase from "firebase/compat/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Guest } from "../../src/components/Guests/GuestsModal/AddNewGuest";
import { AppDispatch, AppState } from "../store";

export const saveGuestForApartment = (guest: Guest) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;

    if (selectedApartment && selectedApartment.id) {
      await setDoc(
        doc(
          getFirestore(firebase.app()),
          `guests/${selectedApartment.id}/data`,
          crypto.randomUUID()
        ),
        guest
      );
    }
  };
};
