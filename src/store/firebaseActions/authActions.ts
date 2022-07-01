import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';

import firebase from 'firebase/compat/app';
import { store } from '../store';
import { setUser } from '../reducers/user';
import { FirebaseError } from 'firebase/app';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const auth = getAuth(firebase.app());
    const db = getFirestore(firebase.app());
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, 'users'), where('uid', '==', user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        authProvider: 'google',
        email: user.email,
      });
    }
    if (user) {
      const serializedUser = {
        id: user.uid,
        email: user.email,
        accessToken: await user.getIdToken(),
      };
      return serializedUser;
    }
  } catch (err) {
    console.error(err);
  }
};

export const registerWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const auth = getAuth(firebase.app());
    const db = getFirestore(firebase.app());
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      authProvider: 'local',
      email,
    });
    const serializedUser: {
      id: string;
      email: string;
      accessToken: string | null;
    } = {
      id: user.uid,
      email: user.email ? user.email : '',
      accessToken: await user.getIdToken(),
    };
    store.dispatch(setUser(serializedUser));
  } catch (err) {
    console.error(err);
  }
};

export const signInEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const auth = getAuth(firebase.app());
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    if (user) {
      const serializedUser: {
        id: string;
        email: string;
        accessToken: string | null;
      } = {
        id: user.uid,
        email: user.email ? user.email : '',
        accessToken: await user.getIdToken(),
      };
      store.dispatch(setUser(serializedUser));
    } else {
      registerWithEmailAndPassword(email, password);
    }
  } catch (err) {
    if (err instanceof FirebaseError) {
      if (err.code === 'auth/user-not-found') {
        registerWithEmailAndPassword(email, password);
      }
    }
  }
};

export const logout = () => {
  const auth = getAuth(firebase.app());
  signOut(auth);
};
