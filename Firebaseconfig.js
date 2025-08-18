import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCYEkslFkAI6Q2Yu0Wc-AnC61Cb7q2uDTU",
  authDomain: "microvision-9bb94.firebaseapp.com",
  projectId: "microvision-9bb94",
  storageBucket: "microvision-9bb94.firebasestorage.app", 
  messagingSenderId: "72145022613",
  appId: "1:72145022613:web:ea975c1bee8bdc48e3f59c"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);

// Fix: React Native persistence
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const storage = getStorage(FIREBASE_APP);
