// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDbgtfVAyqxY5QeOzKIaPJ7BWOmNJEZOsI",
//   authDomain: "jlttransport-2bd63.firebaseapp.com",
//   projectId: "jlttransport-2bd63",
//   storageBucket: "jlttransport-2bd63.firebasestorage.app",
//   messagingSenderId: "938389231726",
//   appId: "1:938389231726:web:16ad659241f3c66e7d6e7f",
//   measurementId: "G-BH82PXRNT2",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const db = getFirestore();

// Import necessary Firebase functions
// Import necessary Firebase functions
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore"; // Added the imports for Firestore functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbgtfVAyqxY5QeOzKIaPJ7BWOmNJEZOsI",
  authDomain: "jlttransport-2bd63.firebaseapp.com",
  projectId: "jlttransport-2bd63",
  storageBucket: "jlttransport-2bd63.firebasestorage.app",
  messagingSenderId: "938389231726",
  appId: "1:938389231726:web:16ad659241f3c66e7d6e7f",
  measurementId: "G-BH82PXRNT2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export the Firestore functions you need
export { db, doc, getDoc, setDoc, updateDoc }; // Exporting Firestore functions
