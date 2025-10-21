// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ إعدادات مشروعك من Firebase
const firebaseConfig = {
  apiKey: "AIzaSyADn_Tqy6a5MWxn4I1tWSJXk6o3yKCABWI",
  authDomain: "plnora.firebaseapp.com",
  projectId: "plnora",
  storageBucket: "plnora.firebasestorage.app",
  messagingSenderId: "919246113733",
  appId: "1:919246113733:web:91155707171572d4bd99ac",
  measurementId: "G-7507YZ00WS"
};

// ✅ تهيئة Firebase
const app = initializeApp(firebaseConfig);

// ✅ خدمات Firebase التي تحتاجها
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider(); // ← أضف السطر ده لو هتستخدم Google Sign-In
