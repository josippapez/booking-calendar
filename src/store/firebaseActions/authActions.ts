import {
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

const registerWithEmailAndPassword = async (
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
  } catch (err) {
    console.error(err);
  }
};

export const logout = () => {
  const auth = getAuth(firebase.app());
  signOut(auth);
};
