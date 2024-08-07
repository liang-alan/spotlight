// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader } from '@googlemaps/js-api-loader';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXl4CpJ5lzd4bOEsNfAKl152dvSODG6KE",
  authDomain: "spotlight-7a223.firebaseapp.com",
  projectId: "spotlight-7a223",
  storageBucket: "spotlight-7a223.appspot.com",
  messagingSenderId: "402184955691",
  appId: "1:402184955691:web:7af5faaec76b58ebdc476e",
  measurementId: "G-T1RY5ZJ35R"
};

const loader = new Loader({
  apiKey: firebaseConfig.apiKey,
  version: "weekly",
  libraries: ["places"]
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

const getPosterInformation = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");

  }
}


export {
  loader,
    getDownloadURL,
    storage,
    ref,
    uploadBytes,
    db,
    analytics,
    auth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
    getPosterInformation
};