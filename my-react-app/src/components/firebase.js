// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";         // Import getAuth
import { getFirestore } from "firebase/firestore"; // Import getFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCBYfC_eCxpOfv0qbY1IJ8mXUEz6o-mJg",
  authDomain: "web-auth-9d5a0.firebaseapp.com",
  projectId: "web-auth-9d5a0",
  storageBucket: "web-auth-9d5a0.appspot.com",
  messagingSenderId: "669948293627",
  appId: "1:669948293627:web:69651cf56659c0b6c1db5e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);               // Correctly initialize getAuth with the app instance
export const db = getFirestore(app);            // Correctly initialize getFirestore with the app instance

export default app;
