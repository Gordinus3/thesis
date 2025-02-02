// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFBnmK4sWmmq8C72aOdb-j-2nytOr6SIQ",
  authDomain: "plasdetect-web.firebaseapp.com",
  projectId: "plasdetect-web",
  storageBucket: "plasdetect-web.firebasestorage.app",
  messagingSenderId: "1060940228041",
  appId: "1:1060940228041:web:a3a65a17f6ad4837167418",
  measurementId: "G-265N6C0VFB"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
