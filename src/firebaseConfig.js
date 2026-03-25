import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDN8IH33guBfMb88FTg8vDWvQxarZAImMY",
  authDomain: "fyp-mvp-f3969.firebaseapp.com",
  projectId: "fyp-mvp-f3969",
  storageBucket: "fyp-mvp-f3969.firebasestorage.app",
  messagingSenderId: "343047240627",
  appId: "1:343047240627:web:e0f236e870d66a254d29c6",
  measurementId: "G-DP727GJ3PD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
