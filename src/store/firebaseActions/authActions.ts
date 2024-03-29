import { FirebaseService } from '@/store/FirebaseService';
import { setUser } from '@/store/reducers/user';
import { persistor, store } from '@/store/store';
import { FirebaseError } from 'firebase/app';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import Cookies from 'js-cookie';

const firebase = FirebaseService.getInstance();

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const auth = firebase.getAuth();
    const db = firebase.getFirestore();
    await auth.setPersistence(browserLocalPersistence);
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
    const auth = firebase.getAuth();
    const db = firebase.getFirestore();
    await auth.setPersistence(browserLocalPersistence);
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
    if (err instanceof FirebaseError) {
      if (
        err.code === 'auth/weak-password' ||
        err.code === 'auth/too-many-requests'
      ) {
        return `auth.${err.code.split('/')[1]}`;
      }
      console.error(err);
    }
  }
};

export const signInEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const auth = firebase.getAuth();
    await auth.setPersistence(browserLocalPersistence);
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    if (user) {
      const serializedUser = {
        id: user.uid,
        email: user.email ? user.email : '',
        accessToken: await user.getIdToken(),
      };
      store.dispatch(setUser(serializedUser));
    } else {
      return registerWithEmailAndPassword(email, password);
    }
  } catch (err) {
    if (err instanceof FirebaseError) {
      if (
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/too-many-requests'
      ) {
        return `auth.${err.code.split('/')[1]}`;
      }
      if (err.code === 'auth/user-not-found') {
        return registerWithEmailAndPassword(email, password);
      }
    }
  }
};

export const logout = async () => {
  await persistor.purge();
  await persistor.flush();
  Cookies.remove('token');
  const auth = firebase.getAuth();
  await signOut(auth);
};
