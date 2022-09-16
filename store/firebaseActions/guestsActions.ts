import firebase from "firebase/compat/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
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

      let newGuestsForAppartment,
        newGuestForAppartmentForNewYear = {};
      if (dateOfArrival[0] === dateOfDeparture[0]) {
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
        }
      } else {
        newGuestsForAppartment = {
          ...guestsForAppartment,
          [dateOfArrival[1]]: {
            ...guestsForAppartment[dateOfArrival[1]],
            [UID]: guest,
          },
        };

        await getDoc(
          doc(
            getFirestore(firebase.app()),
            `guests/${selectedApartment.id}/data`,
            dateOfDeparture[0]
          )
        ).then(doc => {
          if (doc.exists()) {
            newGuestForAppartmentForNewYear = {
              ...doc.data(),
              [dateOfDeparture[1]]: {
                ...doc.data()[dateOfDeparture[1]],
                [UID]: guest,
              },
            };
          } else {
            newGuestForAppartmentForNewYear = {
              [dateOfDeparture[1]]: {
                [UID]: guest,
              },
            };
          }
        });

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
          newGuestForAppartmentForNewYear
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
      let newGuestsForAppartment,
        newGuestForAppartmentForNewYear = {};
      const dateOfArrival = guest.dateOfArrival.split("-");
      const dateOfDeparture = guest.dateOfDeparture.split("-");

      if (dateOfArrival[0] === dateOfDeparture[0]) {
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
      } else {
        await getDoc(
          doc(
            getFirestore(firebase.app()),
            `guests/${selectedApartment.id}/data`,
            dateOfArrival[0]
          )
        ).then(doc => {
          if (doc.exists()) {
            newGuestsForAppartment = {
              ...doc.data(),
              [dateOfArrival[1]]: {
                ...Object.entries(doc.data()[dateOfArrival[1]])
                  .filter(([key, value]) => key !== guestId)
                  .reduce(
                    (acc, [key, value]) => ({ ...acc, [key]: value }),
                    {}
                  ),
              },
            };

            // remove empty months
            newGuestsForAppartment = Object.entries(newGuestsForAppartment)
              .filter(([key, value]) => Object.keys(value).length > 0)
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
          }
        });

        await getDoc(
          doc(
            getFirestore(firebase.app()),
            `guests/${selectedApartment.id}/data`,
            dateOfDeparture[0]
          )
        ).then(doc => {
          if (doc.exists()) {
            newGuestForAppartmentForNewYear = {
              ...doc.data(),
              [dateOfDeparture[1]]: {
                ...Object.entries(doc.data()[dateOfDeparture[1]])
                  .filter(([key, value]) => key !== guestId)
                  .reduce(
                    (acc, [key, value]) => ({ ...acc, [key]: value }),
                    {}
                  ),
              },
            };

            newGuestForAppartmentForNewYear = Object.entries(
              newGuestForAppartmentForNewYear
            )
              .filter(([key, value]) => Object.keys(value as Guest).length > 0)
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
          }
        });

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
          newGuestForAppartmentForNewYear
        );
      }
      dispatch(setGuests(newGuestsForAppartment as Guests));
    }
  };
};
