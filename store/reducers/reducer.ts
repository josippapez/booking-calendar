import { combineReducers } from '@reduxjs/toolkit';
import apartments from './apartments';
import events from './events';
import user from './user';

export const reducers = combineReducers({
  events,
  apartments,
  user
});

export type RootState = ReturnType<typeof reducers>;
