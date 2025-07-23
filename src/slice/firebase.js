// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";





const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_APIKEY}`,
  authDomain: "rupee-root-5f259.firebaseapp.com",
  projectId: "rupee-root-5f259",
  storageBucket: "rupee-root-5f259.firebasestorage.app",
  messagingSenderId: "494116055983",
  appId: "1:494116055983:web:27658a67584034ef8c9d5a",
  measurementId: "G-QYRMGLLB7D"
};
console.log(firebaseConfig);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider, signInWithPopup };
