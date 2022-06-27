import { combineReducers } from '@reduxjs/toolkit';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import apartments from './apartments';
import events from './events';
import user from './user';

export const reducers = combineReducers({
  events,
  apartments,
  user,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

export type RootState = ReturnType<typeof reducers>;
