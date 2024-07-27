// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDCNxar8SsXbEkokLywL3qf6QfzbMnTJMc",
    authDomain: "spotlight-7a223.firebaseapp.com",
    projectId: "spotlight-7a223",
    storageBucket: "spotlight-7a223.appspot.com",
    messagingSenderId: "402184955691",
    appId: "1:402184955691:web:b36b2d88bba13364dc476e",
    measurementId: "G-8QSSCXQW1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

export { analytics, auth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword };