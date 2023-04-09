import firebaseConfig from '@/store/Config/fbConfig';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from 'firebase/firestore';
import {
  Functions,
  connectFunctionsEmulator,
  getFunctions,
} from 'firebase/functions';
import {
  FirebaseStorage,
  connectStorageEmulator,
  getStorage,
} from 'firebase/storage';

export class FirebaseService {
  private static instance: FirebaseService;
  private firebaseApp: FirebaseApp;
  private auth: Auth;
  private firestore: Firestore;
  private storage: FirebaseStorage;
  private functions: Functions;

  private constructor() {
    this.firebaseApp = initializeApp(firebaseConfig);
    this.auth = getAuth(this.firebaseApp);
    this.firestore = getFirestore(this.firebaseApp);
    this.storage = getStorage(this.firebaseApp);
    this.functions = getFunctions(this.firebaseApp);
  }

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  getFirebaseApp(): FirebaseApp {
    return this.firebaseApp;
  }
  getAuth(): Auth {
    return this.auth;
  }
  getFirestore(): Firestore {
    return this.firestore;
  }
  getStorage(): FirebaseStorage {
    return this.storage;
  }
  getFunctions(): Functions {
    return this.functions;
  }

  initEmulators() {
    connectFirestoreEmulator(this.firestore, 'localhost', 8080);
    connectFunctionsEmulator(this.functions, 'localhost', 5001);
    connectAuthEmulator(this.auth, 'http://localhost:9099');
    connectStorageEmulator(this.storage, 'localhost', 9199);
  }
}
