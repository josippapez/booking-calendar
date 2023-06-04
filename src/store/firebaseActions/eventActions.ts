import { FirebaseService } from '@/store/FirebaseService';
import { setEvents } from '@/store/reducers/events';
import { AppDispatch, AppState } from '@/store/store';
import {
  Event,
  EventsByYear,
  PublicEventsByYear,
} from '@modules/Calendar/CalendarTypes';
import { doc, setDoc } from 'firebase/firestore';

const firebase = FirebaseService.getInstance();

export const saveEventsForApartment = (events: EventsByYear) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;

    dispatch(setEvents(events));
    if (selectedApartment && selectedApartment.id) {
      const privateEventData: PublicEventsByYear = {};
      Object.keys(events).forEach(key => {
        privateEventData[key] = {};
        Object.keys(events[key]).forEach(eventKey => {
          const tempEvents: { start: string; end: string }[] = [];
          events[key][eventKey].forEach(event => {
            tempEvents.push({ start: event.start, end: event.end });
          });
          privateEventData[key][eventKey] = tempEvents;
        });
      });

      await setDoc(
        doc(
          firebase.getFirestore(),
          `events/${selectedApartment.id}/data`,
          'private'
        ),
        events
      );
      await setDoc(
        doc(
          firebase.getFirestore(),
          `events/${selectedApartment.id}/data`,
          'public'
        ),
        privateEventData
      );
    }
  };
};

export const removeEventForApartment = (eventId: string) => {
  return async (dispatch: AppDispatch, getState: AppState) => {
    const selectedApartment = getState().apartments.selectedApartment;
    const events = getState().events.events;

    if (!events) return;

    const removedEvents: { [key: string]: { [key: string]: Event[] } } = {};
    Object.keys(events).forEach(key => {
      removedEvents[key] = {};
      Object.keys(events[key]).forEach(eventKey => {
        const filtered = events[key][eventKey].filter(
          event => event.id !== eventId
        );
        if (filtered.length > 0) {
          removedEvents[key][eventKey] = filtered;
        }
      });
    });

    const privateEventData: {
      [key: string]: { [key: string]: { start: string; end: string }[] };
    } = {};
    Object.keys(removedEvents).forEach(key => {
      privateEventData[key] = {};
      Object.keys(removedEvents[key]).forEach(eventKey => {
        const tempEvents: { start: string; end: string }[] = [];
        removedEvents[key][eventKey].forEach(event => {
          tempEvents.push({ start: event.start, end: event.end });
        });
        privateEventData[key][eventKey] = tempEvents;
      });
    });

    dispatch(setEvents(removedEvents));

    if (selectedApartment && selectedApartment.id) {
      await setDoc(
        doc(
          firebase.getFirestore(),
          `events/${selectedApartment.id}/data`,
          'private'
        ),
        removedEvents
      );
      await setDoc(
        doc(
          firebase.getFirestore(),
          `events/${selectedApartment.id}/data`,
          'public'
        ),
        privateEventData
      );
    }
  };
};
