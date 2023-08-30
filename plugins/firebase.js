import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth"
import { getFirestore, doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
//import { getAnalytics } from "firebase/analytics"

export default defineNuxtPlugin(nuxtApp => {
    //const config = useRuntimeConfig()

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

    //const analytics = getAnalytics(app)
    const auth = getAuth(app)
    const firestore = getFirestore(app)
    const storage = getStorage(app)

    nuxtApp.provide('firebase', {
      firestore,
      auth,
      storage,
      getDocs,
      getDoc,
      doc,
      collection,
      query,
      where,
      ref,
      uploadBytes,
      getDownloadURL
    })

    nuxtApp.vueApp.provide('firebase', {
      firestore,
      auth,
      storage,
      getDocs,
      getDoc,
      doc,
      collection,
      query,
      where,
      ref,
      uploadBytes,
      getDownloadURL
    })
})