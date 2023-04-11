import { Guests, setGuests } from '@/store/reducers/guests';
import { AppDispatch, AppState } from '@/store/store';
import { Guest } from '@modules/Guests';
import { FirebaseCollectionActions } from '@modules/Shared';
import { DocumentData } from 'firebase/firestore';

const { addById, getById } = FirebaseCollectionActions('guests');

export const saveGuestForApartment = (guest: Guest) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;
    if (!selectedApartment || !selectedApartment.id) return;

    const guestsForApartment = getState().guests.guests;
    const [arrivalYear, arrivalMonth] = guest.dateOfArrival.split('-');
    const [departureYear, departureMonth] = guest.dateOfDeparture.split('-');
    const UID = crypto.randomUUID();

    let newGuestsForApartment,
      newGuestForApartmentForNewYear = {};
    if (arrivalYear === departureYear) {
      if (arrivalMonth === departureMonth) {
        newGuestsForApartment = {
          ...guestsForApartment,
          [arrivalMonth]: {
            ...guestsForApartment[arrivalMonth],
            [UID]: guest,
          },
        };
        await addById(
          newGuestsForApartment,
          '/' + selectedApartment.id + '/data/' + arrivalYear
        );
      } else {
        const arrayOfMonths = Array.from(
          { length: Number(departureMonth) - Number(arrivalMonth) + 1 },
          (_, i) => Number(arrivalMonth) + i
        );

        newGuestsForApartment = arrayOfMonths.reduce(
          (acc, month) => ({
            ...acc,
            [month]: {
              ...guestsForApartment[month],
              [UID]: guest,
            },
          }),
          { ...guestsForApartment }
        );

        await addById(
          newGuestsForApartment,
          '/' + selectedApartment.id + '/data/' + arrivalYear
        );
      }
    } else {
      const arrayOfMonths = Array.from(
        { length: 12 - Number(arrivalMonth) + 1 },
        (_, i) => Number(arrivalMonth) + i
      );

      newGuestsForApartment = arrayOfMonths.reduce(
        (acc, month) => ({
          ...acc,
          [month]: {
            ...guestsForApartment[month],
            [UID]: guest,
          },
        }),
        { ...guestsForApartment }
      );

      await getById(
        `guests/${selectedApartment.id}/data/${departureYear}`
      ).then(data => {
        const arrayOfMonths = Array.from(
          { length: Number(departureMonth) },
          (_, i) => i + 1
        );
        if (data) {
          newGuestForApartmentForNewYear = {
            ...data,
          };

          newGuestForApartmentForNewYear = arrayOfMonths.reduce(
            (acc, month) => ({
              ...acc,
              [month]: {
                ...data[month],
                [UID]: guest,
              },
            }),
            {}
          );
        } else {
          newGuestForApartmentForNewYear = arrayOfMonths.reduce(
            (acc, month) => ({
              ...acc,
              [month]: {
                [UID]: guest,
              },
            }),
            {}
          );
        }
      });

      await addById(
        newGuestsForApartment,
        '/' + selectedApartment.id + '/data/' + arrivalYear
      );

      await addById(
        newGuestForApartmentForNewYear,
        '/' + selectedApartment.id + '/data/' + departureYear
      );
    }

    dispatch(setGuests(newGuestsForApartment));
  };
};

export const deleteGuestForApartment = (guestId: string, guest: Guest) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;
    if (!selectedApartment || !selectedApartment.id) return;

    let newGuestsForApartment,
      newGuestForApartmentForNewYear = {};
    const [arrivalYear, arrivalMonth] = guest.dateOfArrival.split('-');
    const [departureYear, departureMonth] = guest.dateOfDeparture.split('-');
    const arrivalYearData = (await getById(
      `/${selectedApartment.id}/data/${arrivalYear}`
    )) as DocumentData;

    if (arrivalYear === departureYear) {
      if (arrivalMonth === departureMonth) {
        newGuestsForApartment = {
          ...arrivalYearData,
          [arrivalMonth]: {
            ...Object.entries(arrivalYearData[arrivalMonth])
              .filter(([key]) => key !== guestId)
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
          },
        };
        // remove empty months
        newGuestsForApartment = Object.entries(newGuestsForApartment)
          .filter(([, value]) => Object.keys(value).length > 0)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        await addById(
          newGuestsForApartment,
          '/' + selectedApartment.id + '/data/' + arrivalYear
        );
      } else {
        const arrayOfMonths = Array.from(
          { length: Number(departureMonth) - Number(arrivalMonth) + 1 },
          (_, i) => Number(arrivalMonth) + i
        );

        newGuestsForApartment = arrayOfMonths.reduce(
          (acc, month) => ({
            ...acc,
            [month]: {
              ...Object.entries(arrivalYearData[month])
                .filter(([key]) => key !== guestId)
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
            },
          }),
          { ...arrivalYearData }
        );

        // remove empty months
        newGuestsForApartment = Object.entries(newGuestsForApartment)
          .filter(([, value]) => Object.keys(value).length > 0)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        await addById(
          newGuestsForApartment,
          '/' + selectedApartment.id + '/data/' + arrivalYear
        );
      }
    } else {
      const departureYearData = (await getById(
        `/${selectedApartment.id}/data/${departureYear}`
      )) as DocumentData;

      const arrayOfMonthsArrivalYear = Array.from(
        { length: 12 - Number(arrivalMonth) + 1 },
        (_, i) => Number(arrivalMonth) + i
      );
      const arrayOfMonthsDepartureYear = Array.from(
        { length: Number(departureMonth) },
        (_, i) => i + 1
      );

      if (arrivalYearData) {
        newGuestsForApartment = arrayOfMonthsArrivalYear.reduce(
          (acc, month) => ({
            ...acc,
            [month]: {
              ...Object.entries(arrivalYearData[month])
                .filter(([key]) => key !== guestId)
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
            },
          }),
          { ...arrivalYearData }
        );

        // remove empty months
        newGuestsForApartment = Object.entries(newGuestsForApartment)
          .filter(([, value]) => Object.keys(value).length > 0)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      }

      if (departureYearData) {
        newGuestForApartmentForNewYear = arrayOfMonthsDepartureYear.reduce(
          (acc, month) => ({
            ...acc,
            [month]: {
              ...Object.entries(departureYearData[month])
                .filter(([key]) => key !== guestId)
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
            },
          }),
          { ...departureYearData }
        );

        newGuestForApartmentForNewYear = Object.entries(
          newGuestForApartmentForNewYear
        )
          .filter(([, value]) => Object.keys(value as Guest).length > 0)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      }

      await addById(
        newGuestsForApartment,
        '/' + selectedApartment.id + '/data/' + arrivalYear
      );

      await addById(
        newGuestForApartmentForNewYear,
        '/' + selectedApartment.id + '/data/' + departureYear
      );
    }
    dispatch(setGuests(newGuestsForApartment as Guests));
  };
};
