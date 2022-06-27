import { Event } from '../../Components/Calendar/CalendarTypes';
import { AppDispatch, AppState } from './../store';

export const saveEventsForAppartment = (
  events: { [key: string]: Event[] },
  appartmentId: string
) => {
  return (
    dispatch: AppDispatch,
    getState: AppState,
    { getFirebase, getFirestore }: { getFirebase: any; getFirestore: any }
  ) => {
    const firebase = getFirebase();
    const profile = getState().firebase.profile;
    console.log(firebase.firestore());

    getFirebase()
      .firestore()
      .collection('events')
      .doc(appartmentId)
      .set(events)
      .then((result: any) => {
        console.log(result);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  };
};
