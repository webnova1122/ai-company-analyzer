import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDboKoqvq_XLSDU1Njsr4xl-clkAaWiuY",
  authDomain: "aibusiness-c1366.firebaseapp.com",
  projectId: "aibusiness-c1366",
  storageBucket: "aibusiness-c1366.firebasestorage.app",
  messagingSenderId: "374300740113",
  appId: "1:374300740113:web:37f561d481411f6b017fb0",
  measurementId: "G-ZGNLZCSB88"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
