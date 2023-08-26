import { initializeApp } from 'firebase/app'
import { getFirestore, doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBN6ZAr6HRnOTk3Hs1a4sYH7bjNUkU_Ack",
  authDomain: "the-flow-academy-v2.firebaseapp.com",
  projectId: "the-flow-academy-v2",
  storageBucket: "the-flow-academy-v2.appspot.com",
  messagingSenderId: "834705101389",
  appId: "1:834705101389:web:8cb97dbac5e8bfd4608204",
  measurementId: "G-JWZNL0D3FH"
};

const app = initializeApp(firebaseConfig)
export const firestore = getFirestore(app);

export const doc = doc();
export const collection = collection();
export const query = query();
export const where = where();
export const getDocs = getDocs();
export const getDoc = getDoc();
