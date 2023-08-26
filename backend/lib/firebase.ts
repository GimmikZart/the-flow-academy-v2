// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBN6ZAr6HRnOTk3Hs1a4sYH7bjNUkU_Ack",
  authDomain: "the-flow-academy-v2.firebaseapp.com",
  projectId: "the-flow-academy-v2",
  storageBucket: "the-flow-academy-v2.appspot.com",
  messagingSenderId: "834705101389",
  appId: "1:834705101389:web:8cb97dbac5e8bfd4608204",
  measurementId: "G-JWZNL0D3FH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const firestoreDb = getFirestore(app);