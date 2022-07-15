import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getFirebase } from 'react-redux-firebase';
import {
  createFirestoreInstance,
  getFirestore,
  reduxFirestore,
} from 'redux-firestore';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import firebaseConfig from '../Config/fbConfig';
import { reducers, RootState } from './reducers/reducer';
import {
  getFirestore as GetFirestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

firebase.initializeApp(firebaseConfig);

// const db = GetFirestore();
// connectFirestoreEmulator(db, 'localhost', 8080);
// const functions = getFunctions(firebase.app());
// connectFunctionsEmulator(functions, 'localhost', 5001);
// const auth = getAuth();
// connectAuthEmulator(auth, 'http://localhost:9099');

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware => {
    const middleware = getDefaultMiddleware({
      serializableCheck: false,
    });
    middleware.concat([
      getFirebase,
      getFirestore,
      reduxFirestore(firebaseConfig),
    ]);

    return middleware;
  },
});
const persistor = persistStore(store);

const rrfProps = {
  firebase,
  config: {
    userProfile: 'users',
    useFirestoreForProfile: true,
    attachAuthIsReady: true,
  },
  dispatch: store.dispatch,
  createFirestoreInstance,
};

export { store, persistor, rrfProps };

export type AppDispatch = typeof store.dispatch;
export type AppState = typeof store.getState;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
