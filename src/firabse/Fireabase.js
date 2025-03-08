// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
// } from "firebase/firestore"; // Added the imports for Firestore functions

// // Your web app's Firebase configuration
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

// // Initialize Firestore
// const db = getFirestore(app);

// // Export the Firestore functions you need
// export { db, doc, getDoc, setDoc, updateDoc }; // Exporting Firestore functions

// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
// } from "firebase/firestore";

// // Import authentication modules
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   updatePassword,
//   EmailAuthProvider,
//   reauthenticateWithCredential,
// } from "firebase/auth";

// // Your web app's Firebase configuration
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

// // Initialize Firestore
// const db = getFirestore(app);

// // Initialize Authentication
// const auth = getAuth(app);

// // Authentication helper functions
// export const createAuthUserWithEmailAndPassword = async (email, password) => {
//   if (!email || !password) return;
//   return await createUserWithEmailAndPassword(auth, email, password);
// };

// export const signInAuthUserWithEmailAndPassword = async (email, password) => {
//   if (!email || !password) return;
//   return await signInWithEmailAndPassword(auth, email, password);
// };

// export const signOutUser = async () => await signOut(auth);

// export const onAuthStateChangedListener = (callback) =>
//   onAuthStateChanged(auth, callback);

// // Change password function
// export const changeUserPassword = async (currentPassword, newPassword) => {
//   const user = auth.currentUser;

//   if (!user) throw new Error("No user is currently signed in");

//   // Re-authenticate user before changing password
//   const credential = EmailAuthProvider.credential(user.email, currentPassword);

//   try {
//     // Reauthenticate
//     await reauthenticateWithCredential(user, credential);

//     // Update password
//     await updatePassword(user, newPassword);

//     return { success: true };
//   } catch (error) {
//     throw error;
//   }
// };

// // Export Firestore and Auth
// export { auth, db, doc, getDoc, setDoc, updateDoc };

// firebase-config.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
} from "firebase/auth";

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

// Initialize Authentication
const auth = getAuth(app);

// Authentication helper functions
export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

// Change password function
export const changeUserPassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;

  if (!user) throw new Error("No user is currently signed in");

  // Re-authenticate user before changing password
  const credential = EmailAuthProvider.credential(user.email, currentPassword);

  try {
    // Reauthenticate
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Password reset function
export const sendPasswordResetEmailToUser = async (email) => {
  if (!email) return;
  return await sendPasswordResetEmail(auth, email);
};

// Export Firestore and Auth
export { auth, db, doc, getDoc, setDoc, updateDoc };
