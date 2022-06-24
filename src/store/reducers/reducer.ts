import { combineReducers } from '@reduxjs/toolkit';
import events from './events';

export const reducers = combineReducers({ events });

export type RootState = ReturnType<typeof reducers>;
