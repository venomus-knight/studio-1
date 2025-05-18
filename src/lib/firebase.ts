
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC55EgH4SDCc56H-kHVzR2dnx39xwKjFNY",
  authDomain: "nyai-bb71b.firebaseapp.com",
  projectId: "nyai-bb71b", 
  storageBucket: "nyai-bb71b.firebasestorage.app",
  messagingSenderId: "344560773883",
  appId: "1:344560773883:web:e57d092094c7ec49499e5e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
