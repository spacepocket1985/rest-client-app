import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  where,
  query,
  DocumentData,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAo5AXxH5dPR1mWW_Sye6WVeSUltV3V774',
  authDomain: 'rest-client-2025.firebaseapp.com',
  projectId: 'rest-client-2025',
  storageBucket: 'rest-client-2025.firebasestorage.app',
  messagingSenderId: '890173189253',
  appId: '1:890173189253:web:f0ab1a40920376990f0dec',
  measurementId: 'G-0GX9R2V9TT',
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
const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string
) => {
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

const fetchUserName = async (
  user: User
): Promise<DocumentData[string] | undefined> => {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
    const doc = await getDocs(q);
    const data = doc.docs[0].data();
    return data.name;
  } catch (err) {
    if (err instanceof Error)
      alert('An error occured while fetching user data');
  }
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
  useUser,
  fetchUserName,
};
