// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore}  from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGg_xvuGabcuWqJUNSHMYhWOMyB2mBzjo",
  authDomain: "house-marketplace-app-cc82d.firebaseapp.com",
  projectId: "house-marketplace-app-cc82d",
  storageBucket: "house-marketplace-app-cc82d.appspot.com",
  messagingSenderId: "120711653936",
  appId: "1:120711653936:web:a0d1d513cad05df4bd9bf5",
  measurementId: "G-C5D71WZQ8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);