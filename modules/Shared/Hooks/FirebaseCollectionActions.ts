import { FirebaseService } from '@/store/FirebaseService';
import { AppDispatch, AppState } from '@/store/store';
import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

const firebase = FirebaseService.getInstance();

export const FirebaseCollectionActions = (collectionName: string) => {
  return {
    addByUserId: (data: any, onSuccess?: () => void, onError?: () => void) => {
      return async (dispatch: AppDispatch, getState: AppState) => {
        try {
          const { id } = getState().user.user;
          if (!id) {
            throw new Error('User not logged in');
          }
          await setDoc(doc(firebase.getFirestore(), collectionName, id), data);
          if (onSuccess) {
            onSuccess();
          }
        } catch (error) {
          console.log(error);
          if (onError) {
            onError();
          }
        }
      };
    },
    addByCustomId: (
      id: string,
      data: any,
      onSuccess?: () => void,
      onError?: () => void
    ) => {
      return async (dispatch: AppDispatch, getState: AppState) => {
        try {
          if (!id) {
            throw new Error('ID parameter missing');
          }
          await setDoc(doc(firebase.getFirestore(), collectionName, id), data);
          if (onSuccess) {
            onSuccess();
          }
        } catch (error) {
          console.log(error);
          if (onError) {
            onError();
          }
        }
      };
    },
    update: async (
      id: string,
      data: any,
      onSuccess?: () => void,
      onError?: () => void
    ) => {
      try {
        await updateDoc(doc(firebase.getFirestore(), collectionName, id), data);
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.log(error);
        if (onError) {
          onError();
        }
      }
    },
    deleteById: async (
      id: string,
      onSuccess?: () => void,
      onError?: () => void
    ) => {
      try {
        await deleteDoc(doc(firebase.getFirestore(), collectionName, id));
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.log(error);
        if (onError) {
          onError();
        }
      }
    },
    getById: async (
      id: string,
      onSuccess?: () => void,
      onError?: () => void
    ) => {
      try {
        const docRef = doc(firebase.getFirestore(), collectionName, id);
        const docSnap = await getDoc(docRef);
        let data = null;
        if (docSnap.exists()) {
          data = docSnap.data();
        }
        if (onSuccess) {
          onSuccess();
        }
        return data;
      } catch (error) {
        console.log(error);
        if (onError) {
          onError();
        }
      }
    },
    listenById: (
      id: string,
      setState: (data: any) => void,
      onSuccess?: () => void,
      onError?: () => void
    ) => {
      try {
        const docRef = doc(firebase.getFirestore(), collectionName, id);
        const unsubscribe = onSnapshot(docRef, doc => {
          if (doc.exists()) {
            setState(doc.data());
          }
        });
        if (onSuccess) {
          onSuccess();
        }
        return unsubscribe;
      } catch (error) {
        console.log(error);
        if (onError) {
          onError();
        }
      }
    },
  };
};
