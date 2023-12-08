// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkOMvD93aNC050lUfRCL0V1m4GFSxY9b8",
  authDomain: "auth-project-509d3.firebaseapp.com",
  projectId: "auth-project-509d3",
  storageBucket: "auth-project-509d3.appspot.com",
  messagingSenderId: "344712108760",
  appId: "1:344712108760:web:baad40faa24b21ed7ad5ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Fire
export const db = getFirestore(app);
export const auth = getAuth(app);