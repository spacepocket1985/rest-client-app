import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, collection, addDoc, getDocs, where, query, DocumentData } from 'firebase/firestore';
import { getEnvVar } from './getEnvVar';

const firebaseConfig: FirebaseOptions = {
  apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId: getEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
};

const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = res;

    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
    });
  } catch (err) {
    if (err instanceof Error) throw new Error(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

const useUser = () => {
  const [user] = useAuthState(auth);

  return user;
};

const fetchUserName = async (user: User): Promise<DocumentData[string] | undefined> => {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
    const doc = await getDocs(q);
    const data = doc.docs[0].data();

    return data.name;
  } catch (err) {
    if (err instanceof Error) alert('An error occured while fetching user data');
  }
};

export { auth, db, logInWithEmailAndPassword, registerWithEmailAndPassword, logout, useUser, fetchUserName };
