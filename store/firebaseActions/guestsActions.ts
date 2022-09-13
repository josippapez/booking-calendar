import firebase from "firebase/compat/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Guest } from "../../src/components/Guests/GuestsModal/AddNewGuest";
import { Guests, setGuests } from "../reducers/guests";
import { AppDispatch, AppState } from "../store";

export const saveGuestForApartment = (guest: Guest) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;

    if (selectedApartment && selectedApartment.id) {
      const guestsForAppartment = getState().guests.guests;
      const dateOfArrival = guest.dateOfArrival.split("-");
      const dateOfDeparture = guest.dateOfDeparture.split("-");
      const UID = crypto.randomUUID();

      let newGuestsForAppartment = {};
      if (dateOfArrival[1] === dateOfDeparture[1]) {
        newGuestsForAppartment = {
          ...guestsForAppartment,
          [dateOfArrival[1]]: {
            ...guestsForAppartment[dateOfArrival[1]],
            [UID]: guest,
          },
        };
        await setDoc(
          doc(
            getFirestore(firebase.app()),
            `guests/${selectedApartment.id}/data`,
            dateOfArrival[0]
          ),
          newGuestsForAppartment
        );
      } else {
        newGuestsForAppartment = {
          ...guestsForAppartment,
          [dateOfArrival[1]]: {
            ...guestsForAppartment[dateOfArrival[1]],
            [UID]: guest,
          },
          [dateOfDeparture[1]]: {
            ...guestsForAppartment[dateOfDeparture[1]],
            [UID]: guest,
          },
        };
        await setDoc(
          doc(
            getFirestore(firebase.app()),
            `guests/${selectedApartment.id}/data`,
            dateOfArrival[0]
          ),
          newGuestsForAppartment
        );
        await setDoc(
          doc(
            getFirestore(firebase.app()),
            `guests/${selectedApartment.id}/data`,
            dateOfDeparture[0]
          ),
          newGuestsForAppartment
        );
      }

      dispatch(setGuests(newGuestsForAppartment));
    }
  };
};

export const deleteGuestForApartment = (guestId: string, guest: Guest) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;

    if (selectedApartment && selectedApartment.id) {
      const guestsForAppartment = { ...getState().guests.guests };
      let newGuestsForAppartment: Guests = {};
      const dateOfArrival = guest.dateOfArrival.split("-");
      const dateOfDeparture = guest.dateOfDeparture.split("-");

      if (dateOfArrival[1] === dateOfDeparture[1]) {
        newGuestsForAppartment = {
          ...guestsForAppartment,
          [dateOfArrival[1]]: {
            ...Object.entries(guestsForAppartment[dateOfArrival[1]])
              .filter(([key, value]) => key !== guestId)
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
          },
        };
        // remove empty months
        newGuestsForAppartment = Object.entries(newGuestsForAppartment)
          .filter(([key, value]) => Object.keys(value).length > 0)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        await setDoc(
          doc(
            getFirestore(firebase.app()),
            `guests/${selectedApartment.id}/data`,
            dateOfArrival[0]
          ),
          newGuestsForAppartment
        );
      } else {
        newGuestsForAppartment = {
          ...guestsForAppartment,
          [dateOfArrival[1]]: {
            ...Object.entries(guestsForAppartment[dateOfArrival[1]])
              .filter(([key, value]) => key !== guestId)
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
          },
          [dateOfDeparture[1]]: {
            ...Object.entries(guestsForAppartment[dateOfDeparture[1]])
              .filter(([key, value]) => key !== guestId)
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
          },
        };

        // remove empty months
        newGuestsForAppartment = Object.entries(newGuestsForAppartment)
          .filter(([key, value]) => Object.keys(value).length > 0)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        await setDoc(
          doc(
            getFirestore(firebase.app()),
            `guests/${selectedApartment.id}/data`,
            dateOfArrival[0]
          ),
          newGuestsForAppartment
        );
        await setDoc(
          doc(
            getFirestore(firebase.app()),
            `guests/${selectedApartment.id}/data`,
            dateOfDeparture[0]
          ),
          newGuestsForAppartment
        );
      }

      dispatch(setGuests(newGuestsForAppartment));
    }
  };
};
